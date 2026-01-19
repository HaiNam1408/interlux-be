import { CouponService } from './coupon.service';
import { CreateCouponDto, UpdateCouponDto } from './dto';
import ApiResponse from 'src/global/api.response';
import { GetAllCouponDto } from './dto/get-all-coupon.dto';
export declare class CouponController {
    private readonly couponService;
    constructor(couponService: CouponService);
    findAll({ page, limit, status }: GetAllCouponDto): Promise<ApiResponse<any>>;
    findOne(id: number): Promise<ApiResponse<any>>;
    findByCode(code: string): Promise<ApiResponse<any>>;
    create(createCouponDto: CreateCouponDto): Promise<ApiResponse<any>>;
    update(id: number, updateCouponDto: UpdateCouponDto): Promise<ApiResponse<any>>;
    remove(id: number): Promise<ApiResponse<any>>;
}
