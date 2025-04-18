export function calculateFinalPrice(price: number, percentOff?: number): number {
    if (percentOff && percentOff > 0) {
        return price * (1 - percentOff / 100);
    }
    return price;
}