package com.ecommerce.controller;

import com.ecommerce.model.Supplier;
import com.ecommerce.repository.SupplierRepository;
import com.ecommerce.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:5173") // Use 5173 for Vite
public class SupplierController {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable @NonNull Long id) {
        return supplierRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Supplier createSupplier(@RequestBody @NonNull Supplier supplier) {
        Supplier saved = supplierRepository.save(supplier);
        try {
            emailService.sendAdminAlerts("Supplier Created", "New supplier added: " + saved.getName());
        } catch (Exception e) {
            System.err.println("Failed to send admin alert: " + e.getMessage());
        }
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable @NonNull Long id, @RequestBody @NonNull Supplier supplierDetails) {
        return supplierRepository.findById(id).map(supplier -> {
            supplier.setName(supplierDetails.getName());
            supplier.setContactEmail(supplierDetails.getContactEmail());
            supplier.setPhone(supplierDetails.getPhone());
            Supplier saved = supplierRepository.save(supplier);
            try {
                emailService.sendAdminAlerts("Supplier Updated", "Supplier updated: " + saved.getName());
            } catch (Exception e) {
                System.err.println("Failed to send admin alert: " + e.getMessage());
            }
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable @NonNull Long id) {
        return supplierRepository.findById(id).map((@NonNull Supplier supplier) -> {
            supplierRepository.delete(supplier);
            try {
                emailService.sendAdminAlerts("Supplier Deleted", "Supplier deleted: " + supplier.getName());
            } catch (Exception e) {
                System.err.println("Failed to send admin alert: " + e.getMessage());
            }
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
