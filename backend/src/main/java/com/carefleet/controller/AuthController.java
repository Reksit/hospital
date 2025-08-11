package com.carefleet.controller;

import com.carefleet.dto.AuthResponse;
import com.carefleet.dto.LoginRequest;
import com.carefleet.dto.RegisterRequest;
import com.carefleet.dto.RefreshTokenRequest;
import com.carefleet.dto.VerifyEmailRequest;
import com.carefleet.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            String verificationToken = authService.registerUser(registerRequest);
            return ResponseEntity.ok(Map.of(
                "message", "Registration successful. Please check your email to verify your account.",
                "verificationToken", verificationToken
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "REGISTRATION_FAILED",
                "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "LOGIN_FAILED",
                "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/verify-email")
    @Operation(summary = "Verify email with token and OTP")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody VerifyEmailRequest verifyRequest) {
        try {
            AuthResponse authResponse = authService.verifyEmail(verifyRequest);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "EMAIL_VERIFICATION_FAILED",
                "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshRequest) {
        try {
            AuthResponse authResponse = authService.refreshToken(refreshRequest.getRefreshToken());
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "TOKEN_REFRESH_FAILED",
                "message", e.getMessage()
            ));
        }
    }
}