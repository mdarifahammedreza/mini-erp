export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        fullName: string;
        role: string;
        permissions: string[];
        avatar?: string;
    };
}
