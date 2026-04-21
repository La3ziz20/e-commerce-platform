package com.ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("aura.55697648@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Verify your Aura account");
        message.setText("Welcome to Aura! Your verification code is: " + code);
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String toEmail, String userName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("aura.55697648@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Welcome to Aura E-commerce!");
        message.setText("Hello " + userName + ",\n\nYour account has been successfully verified! You can now log in and start shopping.\n\nWelcome aboard!");
        mailSender.send(message);
    }

    public void sendUserDeletedEmail(String toEmail, String userName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("aura.55697648@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Account Deletion Notice");
        message.setText("Hello " + userName + ",\n\nYour account has been deleted by an administrator. If you believe this was a mistake, please contact support.");
        mailSender.send(message);
    }

    public void sendRoleUpdateEmail(String toEmail, String userName, String newRole) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("aura.55697648@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Aura Account Role Update");
        message.setText("Hello " + userName + ",\n\nYour account role has been updated to: " + newRole + ". If you have any questions, please contact support.");
        mailSender.send(message);
    }

    public void sendNewProductEmailToAllUsers(List<String> userEmails, String productName) {
        for (String email : userEmails) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("aura.55697648@gmail.com");
            message.setTo(email);
            message.setSubject("New Product Alert: " + productName);
            message.setText("Check out our new product: " + productName + " on Aura E-commerce!");
            mailSender.send(message);
        }
    }

    public void sendOrderStatusUpdate(String toEmail, String orderId, String status) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("aura.55697648@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Order Status Update - " + orderId);
        message.setText("Your order " + orderId + " is now " + status + ".");
        mailSender.send(message);
    }

    public void sendAdminAlerts(String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("aura.55697648@gmail.com");
        message.setTo("aura.55697648@gmail.com");
        message.setSubject("ADMIN ALERT: " + subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendSuperAdminAlerts(String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("aura.55697648@gmail.com");
        message.setTo("aura.55697648@gmail.com");
        message.setSubject("SUPER ADMIN ALERT: " + subject);
        message.setText(body);
        mailSender.send(message);
    }
}
