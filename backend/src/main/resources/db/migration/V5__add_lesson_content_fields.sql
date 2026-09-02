-- Add content/video/document fields to lessons, needed for real Lesson CRUD
-- (previously only title/slug/durationMinutes/orderIndex/isActive existed).
ALTER TABLE lessons
    ADD COLUMN content TEXT NULL,
    ADD COLUMN video_url VARCHAR(1000) NULL,
    ADD COLUMN doc_url VARCHAR(1000) NULL,
    ADD COLUMN doc_file_name VARCHAR(255) NULL;
