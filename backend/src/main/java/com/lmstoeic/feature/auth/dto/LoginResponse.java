package com.lmstoeic.feature.auth.dto;

public record LoginResponse(
    String accessToken, 
    String refreshToken,
    String fullName,
    String role
) {}
