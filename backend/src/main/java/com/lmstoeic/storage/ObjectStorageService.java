package com.lmstoeic.storage;

import java.io.InputStream;

public interface ObjectStorageService {
    void putObject(String objectKey, InputStream content, long size, String contentType);

    StoredObject getObject(String objectKey);

    ObjectMetadata statObject(String objectKey);

    void removeObject(String objectKey);
}
