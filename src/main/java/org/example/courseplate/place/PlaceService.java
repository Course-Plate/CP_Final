package org.example.courseplate.place;

import org.example.courseplate.user.User;

public interface PlaceService{

    Place add(Place place);

    String getPlaceByPlaceName(String PlaceName);
}
