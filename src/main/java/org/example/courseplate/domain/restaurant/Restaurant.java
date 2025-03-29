package org.example.courseplate.domain.restaurant;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "restaurants")
@Data
public class Restaurant {
    @Id
    private String id;
    private String name;
    private String category;
    private String address;
    private String atmosphere;
    private double rating;
}