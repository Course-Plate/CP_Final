// src/context/PlacesContext.js
import React, { createContext, useState } from 'react';

const initialPlaces = [
    {
        id: 'a',
        name: '조선면옥',
        link: 'test1',
        category: '한식',
        telephone: '010-1234-5678',
        lat: 37.571,
        lng: 126.98,
        address: '서울특별시 종로구 종로1가 24 르메이에르종로타운1',
        roadAddress: '서울특별시 종로구 종로 19',
        type: '아침',
        description: '한식 전문점',
        review: [
            {
                id: 'a',
                userId: '1',
                restaurantName: '조선면옥',
                menu: 'A',
                content: '테스트입니다',
                date: '2025-01-01'
            },
            {
                id: 'b',
                userId: '2',
                restaurantName: '조선면옥',
                menu: 'A',
                content: '테스트입니다2',
                date: '2025-01-02'
            },
            {
                id: 'c',
                userId: '2',
                restaurantName: '조선면옥',
                menu: 'A',
                content: '테스트입니다2',
                date: '2025-01-02'
            },
            {
                id: 'd',
                userId: '2',
                restaurantName: '조선면옥',
                menu: 'A',
                content: '테스트입니다2',
                date: '2025-01-02'
            },
            {
                id: 'e',
                userId: '2',
                restaurantName: '조선면옥',
                menu: 'A',
                content: '테스트입니다2',
                date: '2025-01-02'
            },
            {
                id: 'f',
                userId: '2',
                restaurantName: '조선면옥',
                menu: 'A',
                content: '테스트입니다2',
                date: '2025-01-02'
            },
        ]
    },
    {
        id: 'b',
        name: '떡볶이공방',
        link: 'test2',
        category: '분식',
        telephone: '010-2345-6789',
        lat: 37.572,
        lng: 126.981,
        address: '서울특별시 종로구 청진동 4-3',
        roadAddress: '서울특별시 종로구 삼봉로 66',
        type: '점심',
        description: '분식 맛집',
        review: [
            {
                id: 'a',
                userId: '1',
                restaurantName: '떡볶이공방',
                menu: 'ee',
                content: '테스트입니다',
                date: '2025-01-01'
            },
            {
                id: 'b',
                userId: '2',
                restaurantName: '떡볶이공방',
                menu: 'ee',
                content: '테스트입니다2',
                date: '2025-01-02'
            },
        ]
    },
    {
        id: 'c',
        name: '이탈리안라운지',
        link: 'test3',
        category: '양식',
        telephone: '010-3456-7890',
        lat: 37.573,
        lng: 126.982,
        address: '서울특별시 종로구 수송동 58 두산위브파빌리온',
        roadAddress: '서울특별시 종로구 삼봉로 81',
        type: '저녁',
        description: '이탈리안 레스토랑',
        review: [
            {
                id: 'a',
                userId: '1',
                restaurantName: '이탈리안라운지',
                menu: 'C',
                content: '테스트입니다',
                date: '2025-01-01'
            },
            {
                id: 'b',
                userId: '2',
                restaurantName: '이탈리안라운지',
                menu: 'C',
                content: '테스트입니다2',
                date: '2025-01-02'
            },
        ]
    }
];


export const PlacesContext = createContext({
    places: initialPlaces,
    setPlaces: () => {},
});


export function PlacesProvider({ children }) {
    const [places, setPlaces] = useState(initialPlaces);

    return (
        <PlacesContext.Provider value={{ places, setPlaces }}>
            {children}
        </PlacesContext.Provider>
    );
}
