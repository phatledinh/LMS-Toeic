package com.lmstoeic.feature.user.dto;

import com.lmstoeic.feature.user.entity.User;

public record UserResponse(
    Long id, 
    String fullName, 
    String email, 
    Integer targetScore, 
    Boolean isActive
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
            user.getId(), 
            user.getFullName(), 
            user.getEmail(), 
            user.getTargetScore(), 
            user.getIsActive()
        );
    }
}
