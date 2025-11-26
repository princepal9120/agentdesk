import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class StorageService {
    private readonly logger = new Logger(StorageService.name);
    private storage: Storage;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        this.storage = new Storage({
            projectId: this.configService.get<string>('GCP_PROJECT_ID'),
            keyFilename: this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS'),
        });
        this.bucketName = this.configService.get<string>('GCP_STORAGE_BUCKET');
    }

    async uploadFile(
        file: Buffer,
        destination: string,
        contentType?: string,
    ): Promise<string> {
        try {
            const bucket = this.storage.bucket(this.bucketName);
            const blob = bucket.file(destination);

            await blob.save(file, {
                contentType: contentType || 'application/octet-stream',
            });

            const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${destination}`;
            this.logger.log(`File uploaded: ${publicUrl}`);

            return publicUrl;
        } catch (error) {
            this.logger.error('Error uploading file:', error);
            throw error;
        }
    }

    async deleteFile(fileName: string): Promise<void> {
        try {
            await this.storage.bucket(this.bucketName).file(fileName).delete();
            this.logger.log(`File deleted: ${fileName}`);
        } catch (error) {
            this.logger.error('Error deleting file:', error);
            throw error;
        }
    }

    async getSignedUrl(fileName: string, expiresIn: number = 3600): Promise<string> {
        const [url] = await this.storage
            .bucket(this.bucketName)
            .file(fileName)
            .getSignedUrl({
                action: 'read',
                expires: Date.now() + expiresIn * 1000,
            });

        return url;
    }
}
