export declare class MailService {
    private transporter;
    constructor();
    sendVerificationEmail(email: string, token: string, name: string): Promise<any>;
    sendForgotPasswordEmail(email: string, token: string, name: string): Promise<any>;
}
