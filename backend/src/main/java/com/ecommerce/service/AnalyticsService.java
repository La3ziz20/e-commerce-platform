package com.ecommerce.service;

import com.ecommerce.dto.AnalyticsDTO;
import com.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private OrderRepository orderRepository;

    public AnalyticsDTO getAnalytics() {
        AnalyticsDTO dto = new AnalyticsDTO();
        
        dto.setTotalUsers(userRepository.count());
        dto.setTotalProducts(productRepository.count());
        dto.setTotalSuppliers(supplierRepository.count());
        dto.setTotalOrders(orderRepository.count());

        // Users by Role
        Map<String, Long> usersByRole = new HashMap<>();
        usersByRole.put("Super Admin", userRepository.countByRole("SUPER_ADMIN"));
        usersByRole.put("Admin", userRepository.countByRole("ADMIN"));
        usersByRole.put("User", userRepository.countByRole("USER"));
        dto.setUsersByRole(usersByRole);

        // Products by Category
        List<Object[]> productCat = productRepository.countProductsByCategory();
        Map<String, Long> catMap = new HashMap<>();
        if (productCat != null) {
            for (Object[] obj : productCat) {
                String cat = obj[0] != null ? obj[0].toString() : "Uncategorized";
                Long count = obj[1] != null ? ((Number) obj[1]).longValue() : 0L;
                catMap.put(cat, count);
            }
        }
        dto.setProductsByCategory(catMap);

        // Products by Supplier
        List<Object[]> productSupplier = productRepository.countProductsBySupplier();
        Map<String, Long> supplierMap = new HashMap<>();
        if (productSupplier != null) {
            for (Object[] obj : productSupplier) {
                String supplierName = obj[0] != null ? obj[0].toString() : "Unknown Supplier";
                Long count = obj[1] != null ? ((Number) obj[1]).longValue() : 0L;
                supplierMap.put(supplierName, count);
            }
        }
        dto.setProductsBySupplier(supplierMap);

        // Orders by Status
        List<Object[]> orderStatus = orderRepository.countOrdersByStatus();
        Map<String, Long> statusMap = new HashMap<>();
        if (orderStatus != null) {
            for (Object[] obj : orderStatus) {
                String status = obj[0] != null ? obj[0].toString() : "Unknown";
                Long count = obj[1] != null ? ((Number) obj[1]).longValue() : 0L;
                statusMap.put(status, count);
            }
        }
        dto.setOrdersByStatus(statusMap);

        // Revenue Over Time & Total Revenue
        List<Object[]> revenueData = orderRepository.sumTotalByDate();
        List<Map<String, Object>> revenueList = new ArrayList<>();
        double totalRev = 0;
        if (revenueData != null) {
            for (Object[] obj : revenueData) {
                Map<String, Object> map = new HashMap<>();
                String dateStr = obj[0] != null ? obj[0].toString() : "Unknown";
                double dailyTotal = obj[1] != null ? ((Number) obj[1]).doubleValue() : 0.0;
                totalRev += dailyTotal;
                map.put("date", dateStr);
                map.put("revenue", dailyTotal);
                revenueList.add(map);
            }
        }
        dto.setRevenueOverTime(revenueList);
        dto.setTotalRevenue(totalRev);

        return dto;
    }
}
