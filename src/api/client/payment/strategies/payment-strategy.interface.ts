// Define the interface for all payment strategies
export interface PaymentStrategy {
  // Generate a payment URL for the given order
  generatePaymentUrl(order: any): Promise<string>;
  
  // Handle the callback from the payment gateway
  handleCallback(params: any): Promise<{
    success: boolean;
    transactionId?: string;
    message: string;
    metadata?: any;
  }>;
  
  // Verify a payment (for manual verification or additional checks)
  verifyPayment(orderId: number, transactionId: string, metadata: any): Promise<boolean>;
}
