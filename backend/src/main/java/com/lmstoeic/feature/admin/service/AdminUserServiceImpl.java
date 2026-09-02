package com.lmstoeic.feature.admin.service;

import com.lmstoeic.common.exception.DuplicateResourceException;
import com.lmstoeic.common.exception.ResourceNotFoundException;
import com.lmstoeic.feature.admin.dto.AdminUserRequest;
import com.lmstoeic.feature.admin.dto.AdminUserResponse;
import com.lmstoeic.feature.role.entity.Role;
import com.lmstoeic.feature.role.repository.RoleRepository;
import com.lmstoeic.feature.user.entity.User;
import com.lmstoeic.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAllByOrderByIdAsc()
                .stream()
                .map(AdminUserResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public AdminUserResponse createUser(AdminUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Người dùng", "email", request.email());
        }

        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Mật khẩu không được để trống");
        }

        User user = new User();
        applyUserFields(user, request);
        user.setPassword(passwordEncoder.encode(request.password()));

        return AdminUserResponse.fromEntity(userRepository.save(user));
    }

    @Override
    @Transactional
    public AdminUserResponse updateUser(Long id, AdminUserRequest request) {
        User user = getUser(id);
        userRepository.findByEmail(request.email())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new DuplicateResourceException("Người dùng", "email", request.email());
                });

        applyUserFields(user, request);
        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        return AdminUserResponse.fromEntity(userRepository.save(user));
    }

    @Override
    @Transactional
    public AdminUserResponse setActive(Long id, boolean active) {
        User user = getUser(id);
        user.setIsActive(active);
        return AdminUserResponse.fromEntity(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = getUser(id);
        userRepository.delete(user);
    }

    private User getUser(Long id) {
        return userRepository.findWithRolesById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", id));
    }

    private void applyUserFields(User user, AdminUserRequest request) {
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setTargetScore(request.targetScore() != null ? request.targetScore() : 500);
        user.setIsActive(request.isActive() != null ? request.isActive() : true);
        user.setRoles(resolveRoles(request.roles()));
    }

    private List<Role> resolveRoles(List<String> requestedRoles) {
        List<String> roleNames = requestedRoles == null || requestedRoles.isEmpty()
                ? List.of("USER")
                : requestedRoles;

        return roleNames.stream()
                .map(String::trim)
                .filter(roleName -> !roleName.isBlank())
                .distinct()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseThrow(() -> new ResourceNotFoundException("Vai trò", "name", roleName)))
                .toList();
    }
}
