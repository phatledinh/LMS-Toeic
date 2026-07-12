-- Flyway script to insert initial data for users, roles, and full permissions

-- ==========================================
-- 1. Insert Roles
-- ==========================================
INSERT INTO roles (name, description, created_at, updated_at) VALUES 
('ADMIN', 'System Administrator', NOW(), NOW()),
('USER', 'Standard User', NOW(), NOW());

-- ==========================================
-- 2. Insert Permissions
-- ==========================================
INSERT INTO permissions (name, api_path, method, module, description, created_at, updated_at) VALUES 
-- AUTH & USER PROFILE
('View Profile', '/api/v1/auth/me', 'GET', 'AUTH', 'Allow user to view their profile', NOW(), NOW()),
('Update Profile', '/api/v1/auth/me', 'PUT', 'AUTH', 'Allow user to update their profile', NOW(), NOW()),

-- USER_MANAGEMENT & ROLE
('View Users', '/api/v1/users/**', 'GET', 'USER_MANAGEMENT', 'Allow to view user list', NOW(), NOW()),
('Manage Users', '/api/v1/users/**', 'ALL', 'USER_MANAGEMENT', 'Allow to manage all users', NOW(), NOW()),
('Manage Roles', '/api/v1/roles/**', 'ALL', 'ROLE_PERMISSION', 'Allow to manage roles and permissions', NOW(), NOW()),

-- COURSE
('Manage Courses', '/api/v1/courses/**', 'ALL', 'COURSE_MANAGEMENT', 'Allow to manage courses, sections, topics, lessons', NOW(), NOW()),
('View Courses', '/api/v1/courses/**', 'GET', 'COURSE_LEARNING', 'Allow to view courses', NOW(), NOW()),
('Submit Exercise', '/api/v1/exercises/*/submit', 'POST', 'COURSE_LEARNING', 'Allow to submit exercise progress', NOW(), NOW()),

-- EXAM & MOCK TEST
('Manage Exams', '/api/v1/exams/**', 'ALL', 'EXAM_MANAGEMENT', 'Allow to manage exam bank', NOW(), NOW()),
('View Exams', '/api/v1/exams/**', 'GET', 'MOCKTEST', 'Allow to view available exams', NOW(), NOW()),
('Take Mock Test', '/api/v1/mocktests/**', 'POST', 'MOCKTEST', 'Allow to take mock tests', NOW(), NOW()),
('View Test Results', '/api/v1/mocktests/**', 'GET', 'MOCKTEST', 'Allow to view mock test results', NOW(), NOW());



-- ==========================================
-- 3. Insert Role-Permission mappings
-- ==========================================

-- ADMIN gets all 'Manage', 'View', and specific admin permissions
INSERT INTO role_permission (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'ADMIN'; 
-- (Admin có toàn quyền, nên ta map luôn toàn bộ bảng permissions cho gọn, hoặc có thể map từng cái. 
-- Ở đây map toàn bộ quyền cho ADMIN)

-- USER gets specific learning and viewing permissions
INSERT INTO role_permission (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'USER' AND p.name IN (
    'View Profile',
    'Update Profile',
    'View Courses',
    'Submit Exercise',
    'View Exams',
    'Take Mock Test',
    'View Test Results'
);

-- ==========================================
-- 4. Insert Users
-- ==========================================
-- Password is '123456' hashed with BCrypt
INSERT INTO users (email, password, full_name, target_score, is_active) VALUES 
('admin@gmail.com', '$2a$10$CoPUEB8adsPxmW.7F4EIx.E2ySfaLRfl4WhZqGfz5z2pmE7CCH6Wy', 'Admin User', 990, true),
('ledinhphat@gmail.com', '$2a$10$CoPUEB8adsPxmW.7F4EIx.E2ySfaLRfl4WhZqGfz5z2pmE7CCH6Wy', 'Le Dinh Phat', 800, true);

-- ==========================================
-- 5. Insert User-Role mappings
-- ==========================================
-- admin@gmail.com -> ADMIN
INSERT INTO user_role (user_id, role_id) VALUES 
((SELECT id FROM users WHERE email = 'admin@gmail.com'), (SELECT id FROM roles WHERE name = 'ADMIN'));

-- ledinhphat@gmail.com -> USER
INSERT INTO user_role (user_id, role_id) VALUES 
((SELECT id FROM users WHERE email = 'ledinhphat@gmail.com'), (SELECT id FROM roles WHERE name = 'USER'));
