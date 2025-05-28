export interface PaymentStrategy {
  generatePaymentUrl(order: any, ipAddress?: string): Promise<string>;
  
  handleCallback(params: any): Promise<{
    success: boolean;
    transactionId?: string;
    message: string;
    metadata?: any;
  }>;
  
  verifyPayment(orderId: number, transactionId: string, metadata: any): Promise<boolean>;
}
