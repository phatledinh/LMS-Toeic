package com.lmstoeic.feature.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
    @NotBlank(message = "Họ tên không được để trống") 
    String fullName,
    
    @NotBlank(message = "Email không được để trống") 
    @Email(message = "Email không đúng định dạng") 
    String email,
    
    @NotBlank(message = "Mật khẩu không được để trống") 
    String password,
    
    Integer targetScore
) {}
