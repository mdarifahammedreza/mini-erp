export declare class UploadController {
    uploadFile(file: Express.Multer.File): {
        success: boolean;
        url: string;
        fileName: string;
        size: number;
    };
}
