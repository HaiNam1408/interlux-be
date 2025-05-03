import { NotificationType } from '@prisma/client';

export interface NotificationTemplate {
  type: NotificationType;
  title: string;
  content: string;
  getTitle: (params: Record<string, any>) => string;
  getContent: (params: Record<string, any>) => string;
}

export interface NotificationTemplateParams {
  [key: string]: any;
}
