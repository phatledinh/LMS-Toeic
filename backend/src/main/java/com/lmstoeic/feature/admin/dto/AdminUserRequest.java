package com.lmstoeic.feature.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record AdminUserRequest(
        @NotBlank(message = "Họ tên không được để trống")
        String fullName,

        @Email(message = "Email không hợp lệ")
        @NotBlank(message = "Email không được để trống")
        String email,

        @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
        String password,

        @Min(value = 10, message = "Target score tối thiểu là 10")
        @Max(value = 990, message = "Target score tối đa là 990")
        Integer targetScore,

        Boolean isActive,

        List<String> roles) {
}
