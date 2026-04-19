package com.recipes.app.auth.dto;

public record AuthResponse(String token, UserDto user) {}
