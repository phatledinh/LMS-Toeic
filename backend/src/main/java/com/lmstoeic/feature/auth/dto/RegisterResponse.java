package com.lmstoeic.feature.auth.dto;

import com.lmstoeic.feature.user.entity.User;

public record RegisterResponse(
    Long id, 
    String fullName, 
    String email
) {
    public static RegisterResponse fromEntity(User user) {
        return new RegisterResponse(
            user.getId(), 
            user.getFullName(), 
            user.getEmail()
        );
    }
}
