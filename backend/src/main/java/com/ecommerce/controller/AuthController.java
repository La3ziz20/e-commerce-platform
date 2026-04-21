package com.ecommerce.controller;

import com.ecommerce.model.User;
import com.ecommerce.model.VerificationToken;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.repository.VerificationTokenRepository;
import com.ecommerce.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user.getEmail() != null) user.setEmail(user.getEmail().trim().toLowerCase());
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already registered");
        }

        user.setEnabled(false); // require verification
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        user.setRegistered(java.time.LocalDate.now());
        User savedUser = userRepository.save(user);

        // Generate 6-digit code
        String code = String.format("%06d", new Random().nextInt(999999));
        VerificationToken token = new VerificationToken(code, savedUser);
        tokenRepository.save(token);

        // Send email
        try {
            emailService.sendVerificationEmail(savedUser.getEmail(), code);
            emailService.sendSuperAdminAlerts("New User Registration", "A new user has signed up: " + savedUser.getName() + " (" + savedUser.getEmail() + ").");
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = payload.get("code");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = userOpt.get();

        Optional<VerificationToken> tokenOpt = tokenRepository.findByUser(user);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Token not found");
        }

        VerificationToken token = tokenOpt.get();
        if (token.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token expired");
        }

        if (token.getToken().equals(code)) {
            user.setEnabled(true);
            userRepository.save(user);
            
            try {
                emailService.sendWelcomeEmail(user.getEmail(), user.getName());
            } catch (Exception e) {
                System.err.println("Failed to send welcome email: " + e.getMessage());
            }
            
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.badRequest().body("Invalid code");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email") != null ? payload.get("email").trim().toLowerCase() : "";
        String password = payload.get("password") != null ? payload.get("password").trim() : "";

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(password)) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }

        if (!user.isEnabled()) {
            return ResponseEntity.badRequest().body("Please verify your email first");
        }

        return ResponseEntity.ok(user);
    }
}
