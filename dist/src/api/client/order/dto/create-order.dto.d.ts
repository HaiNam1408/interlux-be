import { AddressDto } from './address.dto';
export declare class CreateOrderDto {
    shippingAddress: AddressDto;
    billingAddress?: AddressDto;
    shippingId: number;
    paymentMethod: string;
    couponCode?: string;
    note?: string;
}
