import { NotificationTemplate, NotificationTemplateParams } from './interfaces/notification-template.interface';
export declare class NotificationTemplateService {
    private templates;
    getTemplate(key: string): NotificationTemplate | undefined;
    generateNotification(templateKey: string, params: NotificationTemplateParams): {
        title: string;
        content: string;
        type: import(".prisma/client").$Enums.NotificationType;
    };
    addTemplate(key: string, template: NotificationTemplate): void;
}
