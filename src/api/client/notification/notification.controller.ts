// api/client/notification/notification.controller.ts
import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Query,
    UseGuards,
    Request,
    ParseIntPipe,
    HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import ApiResponse from 'src/global/api.response';
import { resError } from 'src/global/handleError.global';
import { ClientNotificationService } from './notification.service';
import { QueryNotificationDto } from './dto';

@ApiTags('Notification')
@Controller('notification')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class NotificationController {
    constructor(private readonly notificationService: ClientNotificationService) {}

    @Get()
    @ApiOperation({ summary: 'Get user notifications' })
    async getUserNotifications(
        @Request() req: any,
        @Query() query: QueryNotificationDto,
    ) {
        try {
            const userId = req.user.userId;
            const result = await this.notificationService.getUserNotifications(userId, query);

            return new ApiResponse(
                'Notifications retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @Get('unread-count')
    @ApiOperation({ summary: 'Get unread notification count' })
    async getUnreadCount(@Request() req: any) {
        try {
            const userId = req.user.userId;
            const count = await this.notificationService.getUnreadCount(userId);

            return new ApiResponse(
                'Unread count retrieved successfully',
                HttpStatus.OK,
                { count },
            );
        } catch (error) {
            return resError(error);
        }
    }

    @Post(':id/read')
    @ApiOperation({ summary: 'Mark notification as read' })
    async markAsRead(
        @Request() req: any,
        @Param('id', ParseIntPipe) id: number,
    ) {
        try {
            const userId = req.user.userId;
            await this.notificationService.markAsRead(userId, id);

            return new ApiResponse(
                'Notification marked as read',
                HttpStatus.OK,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @Post('read-all')
    @ApiOperation({ summary: 'Mark all notifications as read' })
    async markAllAsRead(@Request() req: any) {
        try {
            const userId = req.user.userId;
            await this.notificationService.markAllAsRead(userId);

            return new ApiResponse(
                'All notifications marked as read',
                HttpStatus.OK,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a notification' })
    async deleteNotification(
        @Request() req: any,
        @Param('id', ParseIntPipe) id: number,
    ) {
        try {
            const userId = req.user.userId;
            await this.notificationService.deleteNotification(userId, id);

            return new ApiResponse(
                'Notification deleted successfully',
                HttpStatus.OK,
            );
        } catch (error) {
            return resError(error);
        }
    }
}
