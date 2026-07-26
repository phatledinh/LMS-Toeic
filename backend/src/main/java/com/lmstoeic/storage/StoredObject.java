package com.lmstoeic.storage;

import java.io.InputStream;

public record StoredObject(InputStream content, String contentType) {
}
