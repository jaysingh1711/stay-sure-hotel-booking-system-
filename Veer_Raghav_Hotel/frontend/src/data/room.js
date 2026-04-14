export const rooms = [
  {
    id: "1",
    name: 'Deluxe Suite',
    description: 'Spacious suite with a king-size bed and city view',
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    price: 250,
    rating: 4.8,
    type: 'Suite',
    capacity: 2,
    amenities: ['City View', 'King Bed', 'Mini Bar', 'Jacuzzi'],
    isAvailable: true
  },
  {
    id: "2",
    name: 'Executive Room',
    description: 'Comfortable room with a queen-size bed and work desk',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1631049307264-2a55c6a908c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1585418587716-ece0a4b81afd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1587985399351-f25891ec4476?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    price: 180,
    rating: 4.5,
    type: 'Room',
    capacity: 2,
    amenities: ['Work Desk', 'Queen Bed', 'Free WiFi', 'City View'],
    isAvailable: true
  },
  {
    id: "3",
    name: 'Family Suite',
    description: 'Perfect for families with two bedrooms and a living area',
    images: [
      'https://images.unsplash.com/photo-1560347876-aeef00d7d6a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1492138786289-dee35a5a6d2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1631049307264-2a55c6a908c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1585418587716-ece0a4b81afd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    price: 350,
    rating: 4.9,
    type: 'Suite',
    capacity: 4,
    amenities: ['Two Bedrooms', 'Living Area', 'Kitchen', 'Family Friendly', 'Balcony'],
    isAvailable: false
  },
  {
    id: "4",
    name: 'Standard Room',
    description: 'Cozy room with all essential amenities',
    images: [
      'https://images.unsplash.com/photo-1598928636135-d146006ff4be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded76cc4f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1516455660113-5abb5e4d7daa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1540574163026-643ea4f36519?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcbcd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    price: 120,
    rating: 4.3,
    type: 'Room',
    capacity: 1,
    amenities: ['Single Bed', 'Compact', 'Budget Friendly', 'Free WiFi'],
    isAvailable: true
  },
  {
    id: "5",
    name: 'Luxury Presidential Suite',
    description: 'Ultimate luxury with panoramic views and premium amenities',
    images: [
      'https://images.unsplash.com/photo-1596394533824-9440e5d68392?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1520271347168-31blvm8hpbk?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1631049035582-c2b9526fadd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    price: 500,
    rating: 4.9,
    type: 'Suite',
    capacity: 3,
    amenities: ['Panoramic View', 'Private Terrace', 'Personal Chef', 'Spa Bath', 'Butler Service'],
    isAvailable: false
  }
];