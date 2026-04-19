package com.recipes.app.auth;

import com.recipes.app.auth.dto.AuthResponse;
import com.recipes.app.auth.dto.LoginRequest;
import com.recipes.app.auth.dto.RegisterRequest;
import com.recipes.app.auth.dto.UserDto;
import com.recipes.app.security.JwtService;
import com.recipes.app.user.Role;
import com.recipes.app.user.User;
import com.recipes.app.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final AuthenticationManager authManager;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt, AuthenticationManager authManager) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
        this.authManager = authManager;
    }

    public AuthResponse register(RegisterRequest req) {
        if (users.existsByEmailIgnoreCase(req.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        User user = User.builder()
                .email(req.email())
                .passwordHash(encoder.encode(req.password()))
                .name(req.name())
                .role(Role.USER)
                .build();

        users.save(user);
        String token = jwt.generateToken(user.getEmail());
        return new AuthResponse(token, UserDto.from(user));
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));

        User user = users.findByEmailIgnoreCase(req.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        String token = jwt.generateToken(user.getEmail());
        return new AuthResponse(token, UserDto.from(user));
    }
}
