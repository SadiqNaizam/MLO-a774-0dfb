import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import RestaurantCard from '@/components/RestaurantCard';
import CuisineCategoryChip from '@/components/CuisineCategoryChip';

// Shadcn/ui Components
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

// Lucide Icons
import { Search, UserCircle, ShoppingCart } from 'lucide-react';

interface Restaurant {
  id: string;
  imageUrl: string;
  name: string;
  cuisineTypes: string[];
  rating: number;
  reviewCount?: number;
  deliveryTime: string;
  promotionalTag?: string;
  description?: string;
}

const ALL_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Bella Italia Trattoria',
    cuisineTypes: ['Italian', 'Pizza'],
    rating: 4.7,
    reviewCount: 320,
    deliveryTime: '25-35 min',
    promotionalTag: 'Free Delivery',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    description: 'Authentic Italian pasta, wood-fired pizzas, and delightful desserts.',
  },
  {
    id: '2',
    name: 'Taco Fiesta Express',
    cuisineTypes: ['Mexican', 'Fast Food'],
    rating: 4.3,
    reviewCount: 180,
    deliveryTime: '20-30 min',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-BA5d35548945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    description: 'Sizzling tacos, loaded burritos, and refreshing agua frescas.',
  },
  {
    id: '3',
    name: 'Dragon Wok Palace',
    cuisineTypes: ['Chinese', 'Asian'],
    rating: 4.5,
    reviewCount: 250,
    deliveryTime: '30-40 min',
    promotionalTag: '15% Off Orders $30+',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNoaW5lc2UlMjBmb29kfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    description: 'A wide variety of classic Chinese dishes, from dim sum to kung pao chicken.',
  },
  {
    id: '4',
    name: 'The Curry House',
    cuisineTypes: ['Indian', 'Vegetarian'],
    rating: 4.8,
    reviewCount: 410,
    deliveryTime: '35-45 min',
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    description: 'Rich and aromatic Indian curries, biryanis, and freshly baked naan.',
  },
  {
    id: '5',
    name: 'Burger Bliss Joint',
    cuisineTypes: ['Burgers', 'American'],
    rating: 4.2,
    reviewCount: 150,
    deliveryTime: '20-30 min',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    description: 'Juicy gourmet burgers, crispy fries, and creamy milkshakes.',
  },
  {
    id: '6',
    name: 'Sushi Heaven',
    cuisineTypes: ['Japanese', 'Sushi'],
    rating: 4.6,
    reviewCount: 290,
    deliveryTime: '30-40 min',
    promotionalTag: 'Sushi Combo Deals',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    description: 'Fresh and artfully crafted sushi rolls, sashimi, and Japanese appetizers.',
  },
];

const CUISINE_CATEGORIES = ['Italian', 'Mexican', 'Chinese', 'Indian', 'Burgers', 'Sushi', 'Pizza', 'Vegan', 'Desserts'];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(ALL_RESTAURANTS);

  useEffect(() => {
    console.log('HomePage loaded');
  }, []);

  useEffect(() => {
    let restaurants = ALL_RESTAURANTS;
    if (selectedCuisine) {
      restaurants = restaurants.filter(r => r.cuisineTypes.includes(selectedCuisine));
    }
    if (searchTerm) {
      restaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisineTypes.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredRestaurants(restaurants);
  }, [searchTerm, selectedCuisine]);

  const handleCuisineSelect = (cuisineName: string) => {
    setSelectedCuisine(prev => (prev === cuisineName ? null : cuisineName));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-extrabold text-orange-600 hover:text-orange-700 transition-colors">
              FoodFleet
            </Link>
            <div className="flex-1 max-w-lg mx-4 hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search restaurants or cuisines..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search restaurants or cuisines"
                />
              </div>
            </div>
            <nav className="flex items-center space-x-2 sm:space-x-3">
              <Link to="/user-profile">
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="User Profile">
                  <UserCircle className="h-6 w-6 text-gray-600 hover:text-orange-600" />
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="View Cart">
                  <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-orange-600" />
                  {/* Placeholder for cart item count badge */}
                  {/* <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span> */}
                </Button>
              </Link>
            </nav>
          </div>
           {/* Search bar for mobile, visible only on small screens */}
           <div className="mt-3 sm:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search restaurants..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search restaurants or cuisines"
              />
            </div>
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Cuisine Categories Section */}
          <section aria-labelledby="cuisine-categories-title" className="mb-6 sm:mb-8">
            <h2 id="cuisine-categories-title" className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Explore Cuisines
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {CUISINE_CATEGORIES.map((cuisine) => (
                <CuisineCategoryChip
                  key={cuisine}
                  cuisineName={cuisine}
                  onClick={handleCuisineSelect}
                  isActive={selectedCuisine === cuisine}
                />
              ))}
            </div>
          </section>

          {/* Restaurant Listings Section */}
          <section aria-labelledby="restaurant-listings-title">
            <h2 id="restaurant-listings-title" className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              {selectedCuisine ? `${selectedCuisine} Restaurants` : searchTerm ? 'Search Results' : 'Featured Restaurants'}
            </h2>
            {filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} {...restaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg text-gray-600">
                  No restaurants found. Try adjusting your search or cuisine selection.
                </p>
              </div>
            )}
          </section>
        </main>
      </ScrollArea>

      {/* Footer Section */}
      <footer className="bg-gray-100 border-t py-8 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-lg font-semibold text-orange-600 hover:text-orange-700 transition-colors mb-2 inline-block">
            FoodFleet
          </Link>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} FoodFleet Inc. All rights reserved.
          </p>
          <nav className="mt-3 space-x-4">
            <Link to="/user-profile" className="text-sm text-gray-600 hover:text-orange-600 hover:underline">My Profile</Link>
            {/* Using placeholder links, ensure these routes exist or handle NotFound */}
            <Link to="/contact" className="text-sm text-gray-600 hover:text-orange-600 hover:underline">Contact Us</Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-orange-600 hover:underline">Privacy Policy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;