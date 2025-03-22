export interface MailOptions {
    service: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}
