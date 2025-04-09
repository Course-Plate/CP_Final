package org.example.courseplate.restaurant;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "restaurants")
@Data
public class Restaurant {
    @Id
    private String id;
    private String restaurantName;
    private String phone;
    private String category;
    private String address;
    private String atmosphere;
    private double rating;
    private double latitude;
    private double longitude;
}