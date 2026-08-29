#!/usr/bin/env bash
# Выполняется НА СЕРВЕРЕ: разворачивает новую статику и перечитывает nginx.
# Архив dist.tar.gz должен быть предварительно залит в $STAGING.
# Каталоги меняются местами, поэтому сайт не «моргает» пустотой. При неудаче — откат.
set -euo pipefail

WEB_ROOT=/var/www/noble
SITE_URL=https://noble.kz/
STAGING="$HOME/deploy-staging"
BACKUPS="$HOME/deploy-backups"
ARCHIVE="$STAGING/dist.tar.gz"
STAMP=$(date +%Y%m%d-%H%M%S)

if [ ! -f "$ARCHIVE" ]; then
    echo "Нет залитого архива: $ARCHIVE" >&2
    exit 1
fi

mkdir -p "$BACKUPS"

echo "==> Бэкап текущей версии"
if [ -d "$WEB_ROOT" ]; then
    sudo tar -czf "$BACKUPS/front-$STAMP.tar.gz" -C "$WEB_ROOT" .
    echo "    $BACKUPS/front-$STAMP.tar.gz"
fi
ls -1t "$BACKUPS"/front-*.tar.gz 2>/dev/null | tail -n +6 | xargs -r sudo rm -f

echo "==> Распаковка новой версии"
sudo rm -rf "$WEB_ROOT.new"
sudo mkdir -p "$WEB_ROOT.new"
sudo tar -xzf "$ARCHIVE" -C "$WEB_ROOT.new"
sudo chown -R root:root "$WEB_ROOT.new"
sudo chmod -R a+rX "$WEB_ROOT.new"

if [ ! -f "$WEB_ROOT.new/index.html" ]; then
    echo "В собранной версии нет index.html — деплой отменён" >&2
    sudo rm -rf "$WEB_ROOT.new"
    exit 1
fi

echo "==> Переключение каталога"
sudo rm -rf "$WEB_ROOT.old"
[ -d "$WEB_ROOT" ] && sudo mv "$WEB_ROOT" "$WEB_ROOT.old"
sudo mv "$WEB_ROOT.new" "$WEB_ROOT"
sudo nginx -t
sudo systemctl reload nginx
rm -f "$ARCHIVE"

code=$(curl -s -o /dev/null -w '%{http_code}' "$SITE_URL" || true)
case "$code" in
    2*|3*)
        echo "    сайт отвечает: HTTP $code"
        echo "==> Фронтенд задеплоен"
        exit 0
        ;;
esac

echo "!! Сайт отвечает HTTP $code — откат" >&2
if [ -d "$WEB_ROOT.old" ]; then
    sudo rm -rf "$WEB_ROOT.failed"
    sudo mv "$WEB_ROOT" "$WEB_ROOT.failed"
    sudo mv "$WEB_ROOT.old" "$WEB_ROOT"
    sudo systemctl reload nginx
    echo "    откат выполнен, на сайте прежняя версия" >&2
fi
exit 1
