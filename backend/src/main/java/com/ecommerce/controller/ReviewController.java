package com.ecommerce.controller;

import com.ecommerce.model.Review;
import com.ecommerce.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/product/{productId}")
    public List<Review> getReviewsByProductId(@PathVariable @NonNull Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    @PostMapping
    public Review createReview(@RequestBody @NonNull Review review) {
        return reviewRepository.save(review);
    }
}
