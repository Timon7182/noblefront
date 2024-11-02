import { BASE_URL } from "@/api";

export function currencyFormatter() {
    return new Intl.NumberFormat('de-De', {
        currency: 'KZT',
        maximumFractionDigits: 0
    });
}

export function getImgUrl(path) {
    return `${path}`
}