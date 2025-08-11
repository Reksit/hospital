package com.carefleet.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendVerificationEmail(String to, String token, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("CareFleet - Email Verification");
            message.setText(String.format(
                "Welcome to CareFleet!\n\n" +
                "Please verify your email by using the following OTP: %s\n\n" +
                "This OTP will expire in 15 minutes.\n\n" +
                "If you didn't create an account with CareFleet, please ignore this email.\n\n" +
                "Best regards,\n" +
                "CareFleet Team",
                otp
            ));
            
            mailSender.send(message);
            logger.info("Verification email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send verification email to: {}", to, e);
        }
    }
}