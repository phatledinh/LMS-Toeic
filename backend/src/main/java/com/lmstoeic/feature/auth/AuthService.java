package com.lmstoeic.feature.auth;

import com.lmstoeic.feature.auth.dto.LoginRequest;
import com.lmstoeic.feature.auth.dto.LoginResponse;
import com.lmstoeic.feature.auth.dto.RegisterRequest;
import com.lmstoeic.feature.auth.dto.RegisterResponse;
import com.lmstoeic.feature.user.dto.UserResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request, String deviceInfo, String ipAddress);

    RegisterResponse register(RegisterRequest request);

    LoginResponse refresh(String rawRefreshToken);

    void logout(String rawRefreshToken);

    UserResponse getMe(String email);
}
