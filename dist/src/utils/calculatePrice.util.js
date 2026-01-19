"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFinalPrice = calculateFinalPrice;
function calculateFinalPrice(price, percentOff) {
    if (percentOff && percentOff > 0) {
        return price * (1 - percentOff / 100);
    }
    return price;
}
//# sourceMappingURL=calculatePrice.util.js.map