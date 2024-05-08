package com.project.shopapp.responses;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CrategoryProductResponse {
    private Long categoryId;
    private String categoryName;
    private int totalProducts;
}
