package com.recipes.app.auth.dto;

import com.recipes.app.user.Role;
import com.recipes.app.user.User;

import java.util.UUID;

public record UserDto(UUID id, String email, String name, Role role) {
    public static UserDto from(User u) {
        return new UserDto(u.getId(), u.getEmail(), u.getName(), u.getRole());
    }
}
