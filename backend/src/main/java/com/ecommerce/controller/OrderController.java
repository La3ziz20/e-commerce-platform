package com.ecommerce.controller;

import com.ecommerce.model.Order;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByDateDesc();
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        // Link items to order (this is already handled somewhat by setItems in Order, but let's ensure it)
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }

        Order savedOrder = orderRepository.save(order);

        // Notify admins
        String subject = "New Order Placed: " + savedOrder.getId();
        String body = "A new order has been placed by " + savedOrder.getUserName() + " for total $" + savedOrder.getTotal();
        try {
            emailService.sendAdminAlerts(subject, body);
            emailService.sendSuperAdminAlerts(subject, body);
            
            // Notify the user directly
            if (savedOrder.getUserEmail() != null && !savedOrder.getUserEmail().isEmpty()) {
                emailService.sendOrderConfirmationEmail(savedOrder.getUserEmail(), savedOrder.getId().toString(), savedOrder.getTotal());
            }
        } catch (Exception e) {
            System.err.println("Failed to send order emails: " + e.getMessage());
        }

        return ResponseEntity.ok(savedOrder);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable @NonNull String id, @RequestBody Map<String, String> payload) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order order = orderOpt.get();
        String newStatus = payload.get("status");
        order.setStatus(newStatus);
        Order savedOrder = orderRepository.save(order);

        // Notify User and Admin
        try {
            if (order.getUserEmail() != null && !order.getUserEmail().isEmpty()) {
                emailService.sendOrderStatusUpdate(order.getUserEmail(), id, newStatus);
            }
            emailService.sendAdminAlerts("Order Status Updated", "Order " + id + " is now " + newStatus);
        } catch (Exception e) {
            System.err.println("Failed to send admin email: " + e.getMessage());
        }

        return ResponseEntity.ok(savedOrder);
    }
}
