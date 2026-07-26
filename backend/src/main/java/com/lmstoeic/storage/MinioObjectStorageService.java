package com.lmstoeic.storage;

import com.lmstoeic.config.StorageProperties;
import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.MakeBucketArgs;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.StatObjectArgs;
import io.minio.StatObjectResponse;
import io.minio.errors.ErrorResponseException;
import java.io.InputStream;
import org.springframework.stereotype.Service;

@Service
public class MinioObjectStorageService implements ObjectStorageService {
    private final io.minio.MinioClient minioClient;
    private final StorageProperties storageProperties;

    public MinioObjectStorageService(io.minio.MinioClient minioClient, StorageProperties storageProperties) {
        this.minioClient = minioClient;
        this.storageProperties = storageProperties;
    }

    @Override
    public void putObject(String objectKey, InputStream content, long size, String contentType) {
        try {
            ensureBucketExists();
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(storageProperties.getMinio().getBucket())
                    .object(objectKey)
                    .stream(content, size, -1)
                    .contentType(contentType)
                    .build());
        } catch (Exception e) {
            throw new IllegalStateException("Không thể lưu ảnh vào MinIO", e);
        }
    }

    private void ensureBucketExists() throws Exception {
        String bucket = storageProperties.getMinio().getBucket();
        boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
        if (!exists) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
        }
    }

    @Override
    public StoredObject getObject(String objectKey) {
        try {
            StatObjectResponse stat = minioClient.statObject(StatObjectArgs.builder()
                    .bucket(storageProperties.getMinio().getBucket())
                    .object(objectKey)
                    .build());
            InputStream content = minioClient.getObject(GetObjectArgs.builder()
                    .bucket(storageProperties.getMinio().getBucket())
                    .object(objectKey)
                    .build());
            return new StoredObject(content, stat.contentType());
        } catch (ErrorResponseException e) {
            if ("NoSuchKey".equals(e.errorResponse().code()) || "NoSuchObject".equals(e.errorResponse().code())) {
                return null;
            }
            throw new IllegalStateException("Không thể đọc file từ MinIO", e);
        } catch (Exception e) {
            throw new IllegalStateException("Không thể đọc file từ MinIO", e);
        }
    }

    @Override
    public ObjectMetadata statObject(String objectKey) {
        try {
            StatObjectResponse stat = minioClient.statObject(StatObjectArgs.builder()
                    .bucket(storageProperties.getMinio().getBucket())
                    .object(objectKey)
                    .build());
            return new ObjectMetadata(stat.contentType(), stat.size());
        } catch (ErrorResponseException e) {
            if ("NoSuchKey".equals(e.errorResponse().code()) || "NoSuchObject".equals(e.errorResponse().code())) {
                return null;
            }
            throw new IllegalStateException("Không thể đọc metadata file từ MinIO", e);
        } catch (Exception e) {
            throw new IllegalStateException("Không thể đọc metadata file từ MinIO", e);
        }
    }

    @Override
    public void removeObject(String objectKey) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(storageProperties.getMinio().getBucket())
                    .object(objectKey)
                    .build());
        } catch (Exception e) {
            throw new IllegalStateException("Không thể xóa file từ MinIO", e);
        }
    }
}
