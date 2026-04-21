package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable @NonNull Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product createProduct(@RequestBody @NonNull Product product) {
        Product saved = productRepository.save(product);
        
        try {
            List<String> emails = userRepository.findAll().stream().map(User::getEmail).collect(Collectors.toList());
            emailService.sendNewProductEmailToAllUsers(emails, saved.getName());
            emailService.sendAdminAlerts("Product Created", "Product created: " + saved.getName());
        } catch (Exception e) {
            System.err.println("Failed to send product emails: " + e.getMessage());
        }
        
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable @NonNull Long id, @RequestBody @NonNull Product productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setPrice(productDetails.getPrice());
            product.setImageUrl(productDetails.getImageUrl());
            product.setCategory(productDetails.getCategory());
            product.setSupplier(productDetails.getSupplier());
            Product updatedProduct = productRepository.save(product);
            
            try {
                emailService.sendAdminAlerts("Product Updated", "Product updated: " + updatedProduct.getName());
            } catch (Exception e) {
                System.err.println("Failed to send admin alert: " + e.getMessage());
            }
            
            return ResponseEntity.ok(updatedProduct);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable @NonNull Long id) {
        return productRepository.findById(id).map((@NonNull Product product) -> {
            productRepository.delete(product);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
