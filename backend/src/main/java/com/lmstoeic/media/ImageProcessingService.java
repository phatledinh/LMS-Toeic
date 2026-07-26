package com.lmstoeic.media;

import com.lmstoeic.config.StorageProperties;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Set;
import javax.imageio.ImageIO;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageProcessingService {
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private final StorageProperties storageProperties;

    public ImageProcessingService(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    public ProcessedImage process(MultipartFile file) {
        validate(file);
        try {
            BufferedImage source = ImageIO.read(file.getInputStream());
            if (source == null) {
                throw new IllegalArgumentException("File tải lên không phải là ảnh hợp lệ");
            }

            BufferedImage rgbSource = toRgb(source);
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            Thumbnails.of(rgbSource)
                    .size(storageProperties.getImage().getMaxWidth(), storageProperties.getImage().getMaxHeight())
                    .outputFormat("jpg")
                    .outputQuality(storageProperties.getImage().getQuality())
                    .toOutputStream(output);

            return new ProcessedImage(output.toByteArray(), "image/jpeg", "jpg");
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException("Không thể xử lý ảnh tải lên", e);
        }
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Vui lòng chọn ảnh để tải lên");
        }
        if (file.getSize() > storageProperties.getImage().getMaxSizeBytes()) {
            throw new IllegalArgumentException("Ảnh vượt quá dung lượng cho phép");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP");
        }
    }

    private BufferedImage toRgb(BufferedImage source) {
        BufferedImage rgb = new BufferedImage(source.getWidth(), source.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = rgb.createGraphics();
        graphics.setColor(Color.WHITE);
        graphics.fillRect(0, 0, source.getWidth(), source.getHeight());
        graphics.drawImage(source, 0, 0, null);
        graphics.dispose();
        return rgb;
    }

    public ByteArrayInputStream asInputStream(ProcessedImage image) {
        return new ByteArrayInputStream(image.content());
    }
}
