export declare enum PaymentMethodEnum {
    VNPAY = "VNPAY",
    MOMO = "MOMO",
    PAYPAL = "PAYPAL",
    COD = "COD"
}
export declare class CreatePaymentUrlDto {
    orderId: number;
    paymentMethod: PaymentMethodEnum;
}
