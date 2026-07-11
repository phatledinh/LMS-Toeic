# LMS TOEIC

LMS TOEIC is a comprehensive Learning Management System designed to help users prepare for the TOEIC exam. It features a robust backend built with Spring Boot 3, utilizing an OAuth2 Resource Server architecture with JWT for secure authentication and authorization.

## System Architecture

### Backend
- **Framework**: Spring Boot 3.4.x (Java 21)
- **Database**: MySQL 8
- **Security**: Spring Security 6 with OAuth2 Resource Server & JWT.
- **Project Structure**: Feature-based architecture (`com.lmstoeic.feature.*`)

### Key Features
- **Online Mock Tests**: Allows users to take TOEIC mock tests in a simulated real-world environment.
- **Role-Based Access Control (RBAC)**: Fine-grained dynamic permissions mapping Users -> Roles -> Permissions.
- **Dynamic Authorization**: Custom `PermissionAuthorizationManager` dynamically checking endpoint permissions based on requested URL patterns.
- **User Management**: Secure Authentication, token issuance, and Profile management.

## Setup & Run

### Prerequisites
- Java 21
- Maven
- MySQL 8

### Backend Configuration
1. Update `application.yml` with your MySQL database credentials.
2. Provide a strong `jwt.secret` (Base64 encoded) for JWT token signing.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
