package com.carefleet.service;

import com.carefleet.dto.*;
import com.carefleet.model.User;
import com.carefleet.model.UserRole;
import com.carefleet.repository.UserRepository;
import com.carefleet.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private EmailService emailService;

    public String registerUser(RegisterRequest registerRequest) {
        // Check if user already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        // Create new user
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setRole(UserRole.valueOf(registerRequest.getRole()));
        user.setHospitalId(registerRequest.getHospitalId());
        
        // Generate verification token and OTP
        String verificationToken = UUID.randomUUID().toString();
        String otp = generateOTP();
        
        user.setEmailVerificationToken(verificationToken);
        user.setEmailOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(15));
        user.setLastOtpRequest(LocalDateTime.now());

        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), verificationToken, otp);

        return verificationToken;
    }

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userOpt.get();
        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email before logging in");
        }

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );

        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        return new AuthResponse(accessToken, refreshToken, convertToUserDto(user));
    }

    public AuthResponse verifyEmail(VerifyEmailRequest verifyRequest) {
        Optional<User> userOpt = userRepository.findByEmailVerificationToken(verifyRequest.getToken());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid verification token");
        }

        User user = userOpt.get();
        
        // Check OTP
        if (!verifyRequest.getOtp().equals(user.getEmailOtp())) {
            user.setOtpAttempts(user.getOtpAttempts() + 1);
            userRepository.save(user);
            throw new RuntimeException("Invalid OTP");
        }

        // Check OTP expiry
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        // Verify email
        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailOtp(null);
        user.setOtpExpiry(null);
        user.setOtpAttempts(0);
        userRepository.save(user);

        // Generate tokens
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            user, null, user.getAuthorities()
        );
        
        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        return new AuthResponse(accessToken, refreshToken, convertToUserDto(user));
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String userId = tokenProvider.getUserIdFromToken(refreshToken);
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        String newAccessToken = tokenProvider.generateTokenFromUser(user, 86400000); // 24 hours
        String newRefreshToken = tokenProvider.generateTokenFromUser(user, 604800000); // 7 days

        return new AuthResponse(newAccessToken, newRefreshToken, convertToUserDto(user));
    }

    private String generateOTP() {
        return String.format("%06d", (int) (Math.random() * 1000000));
    }

    private UserDto convertToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole().name());
        dto.setEmailVerified(user.isEmailVerified());
        return dto;
    }
}