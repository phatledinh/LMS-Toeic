package com.lmstoeic.feature.admin.service;

import com.lmstoeic.feature.admin.dto.AdminUserRequest;
import com.lmstoeic.feature.admin.dto.AdminUserResponse;

import java.util.List;

public interface AdminUserService {
    List<AdminUserResponse> getAllUsers();

    AdminUserResponse createUser(AdminUserRequest request);

    AdminUserResponse updateUser(Long id, AdminUserRequest request);

    AdminUserResponse setActive(Long id, boolean active);

    void deleteUser(Long id);
}
