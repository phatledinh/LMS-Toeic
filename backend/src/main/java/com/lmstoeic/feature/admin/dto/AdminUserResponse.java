package com.lmstoeic.feature.admin.dto;

import com.lmstoeic.feature.user.entity.User;

import java.util.List;

public record AdminUserResponse(
        Long id,
        String fullName,
        String email,
        Integer targetScore,
        Boolean isActive,
        List<String> roles) {

    public static AdminUserResponse fromEntity(User user) {
        List<String> roleNames = user.getRoles() == null
                ? List.of()
                : user.getRoles().stream().map(role -> role.getName()).toList();

        return new AdminUserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getTargetScore(),
                user.getIsActive(),
                roleNames);
    }
}
