package com.ecommerce.controller;

import com.ecommerce.model.User;
import com.ecommerce.model.VerificationToken;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.repository.VerificationTokenRepository;
import com.ecommerce.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable @NonNull Long id, @RequestBody Map<String, String> payload) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        user.setRole(payload.get("role"));
        userRepository.save(user);

        try {
            emailService.sendRoleUpdateEmail(user.getEmail(), user.getName(), user.getRole());
        } catch (Exception e) {
            System.err.println("Failed to send role update email: " + e.getMessage());
        }

        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable @NonNull Long id, @RequestBody User userDetails) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setPassword(userDetails.getPassword());
        user.setRole(userDetails.getRole());
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable @NonNull Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = userOpt.get();
        
        // Delete associated token to avoid foreign key constraint violations
        Optional<VerificationToken> tokenOpt = tokenRepository.findByUser(user);
        if (tokenOpt.isPresent()) {
            tokenRepository.deleteById(java.util.Objects.requireNonNull(tokenOpt.get().getId()));
        }
        
        userRepository.deleteById(id);
        
        try {
            emailService.sendUserDeletedEmail(user.getEmail(), user.getName());
        } catch (Exception e) {
            System.err.println("Failed to send deletion email: " + e.getMessage());
        }
        
        return ResponseEntity.ok().build();
    }
}
