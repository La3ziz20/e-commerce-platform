package com.ecommerce.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsDTO {
    private long totalUsers;
    private long totalProducts;
    private long totalSuppliers;
    private long totalOrders;
    private double totalRevenue;

    private Map<String, Long> usersByRole;
    private Map<String, Long> productsByCategory;
    private Map<String, Long> productsBySupplier;
    private Map<String, Long> ordersByStatus;
    private List<Map<String, Object>> revenueOverTime;

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getTotalSuppliers() { return totalSuppliers; }
    public void setTotalSuppliers(long totalSuppliers) { this.totalSuppliers = totalSuppliers; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Map<String, Long> getUsersByRole() { return usersByRole; }
    public void setUsersByRole(Map<String, Long> usersByRole) { this.usersByRole = usersByRole; }

    public Map<String, Long> getProductsByCategory() { return productsByCategory; }
    public void setProductsByCategory(Map<String, Long> productsByCategory) { this.productsByCategory = productsByCategory; }

    public Map<String, Long> getProductsBySupplier() { return productsBySupplier; }
    public void setProductsBySupplier(Map<String, Long> productsBySupplier) { this.productsBySupplier = productsBySupplier; }

    public Map<String, Long> getOrdersByStatus() { return ordersByStatus; }
    public void setOrdersByStatus(Map<String, Long> ordersByStatus) { this.ordersByStatus = ordersByStatus; }

    public List<Map<String, Object>> getRevenueOverTime() { return revenueOverTime; }
    public void setRevenueOverTime(List<Map<String, Object>> revenueOverTime) { this.revenueOverTime = revenueOverTime; }
}
