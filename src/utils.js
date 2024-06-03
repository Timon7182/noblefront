import { BASE_URL } from "@/api";

export function currencyFormatter() {
    return new Intl.NumberFormat('en-US', {
        currency: 'KZT',
        maximumFractionDigits: 0
    });
}

export function getImgUrl(path) {
    return `${BASE_URL}/images${path}`
}