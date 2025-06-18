import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MenuItemCard, { MenuItem as CartItem } from '@/components/MenuItemCard'; // Custom component
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger, // Not using trigger, opening programmatically
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input"; // For dialog
import { Label } from "@/components/ui/label"; // For dialog
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // For dialog
import { Checkbox } from "@/components/ui/checkbox"; // For dialog
import { ChefHat, MapPin, Star, Clock, ShoppingCart, Utensils, Home, UserCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"; // For general page toasts if needed

// Mock Restaurant Data
const mockRestaurant = {
  id: "res123",
  name: "The Gourmet Place",
  address: "123 Culinary Ave, Food City, FC 54321",
  rating: 4.7,
  reviewCount: 350,
  openingHours: "10:00 AM - 10:00 PM",
  cuisineTypes: ["Italian", "Pizza", "Desserts"],
  imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop", // Placeholder
};

// Mock Menu Item Data
const mockMenuItems = [
  {
    id: "item1",
    name: "Margherita Pizza",
    description: "Classic delight with 100% real mozzarella cheese, fresh tomatoes, and basil.",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000&auto=format&fit=crop",
    customizationAvailable: true,
    options: {
      size: ["Small", "Medium", "Large"],
      crust: ["Thin", "Regular", "Stuffed"],
      extraToppings: [
        { id: "top1", name: "Mushrooms", price: 1.50 },
        { id: "top2", name: "Olives", price: 1.00 },
        { id: "top3", name: "Pepperoni", price: 2.00 },
      ],
    }
  },
  {
    id: "item2",
    name: "Pasta Carbonara",
    description: "Spaghetti with creamy egg sauce, pancetta, and pecorino cheese.",
    price: 15.50,
    imageUrl: "https://images.unsplash.com/photo-1600803907087-f56d462fd26b?q=80&w=1000&auto=format&fit=crop",
    customizationAvailable: false,
  },
  {
    id: "item3",
    name: "Tiramisu",
    description: "A classic Italian dessert made with mascarpone cheese, coffee, and ladyfingers.",
    price: 7.00,
    imageUrl: "https://images.unsplash.com/photo-1571877275904-68eb865a5e79?q=80&w=1000&auto=format&fit=crop",
    customizationAvailable: true,
    options: {
      servingSize: ["Single", "Double"],
    }
  },
  {
    id: "item4",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, croutons, Parmesan cheese, and Caesar dressing.",
    price: 9.25,
    imageUrl: "https://images.unsplash.com/photo-1550304943-4324150f53f5?q=80&w=1000&auto=format&fit=crop",
    customizationAvailable: true,
    options: {
      protein: ["None", "Chicken", "Shrimp"],
    }
  },
];

// Simple Header Component (as per layout_info)
const AppHeader = () => (
  <header className="bg-white shadow-sm sticky top-0 z-50">
    <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary">
        <Utensils className="h-7 w-7" />
        <span>FoodFleet</span>
      </Link>
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-gray-600 hover:text-primary transition-colors flex items-center space-x-1">
          <Home className="h-5 w-5" /> <span>Home</span>
        </Link>
        <Link to="/cart" className="text-gray-600 hover:text-primary transition-colors flex items-center space-x-1">
          <ShoppingCart className="h-5 w-5" /> <span>Cart</span>
        </Link>
        <Link to="/user-profile" className="text-gray-600 hover:text-primary transition-colors flex items-center space-x-1">
          <UserCircle className="h-5 w-5" /> <span>Profile</span>
        </Link>
      </div>
    </nav>
  </header>
);

// Simple Footer Component (as per layout_info)
const AppFooter = () => (
  <footer className="bg-gray-800 text-white py-8 mt-12">
    <div className="container mx-auto px-4 text-center">
      <p>&copy; {new Date().getFullYear()} FoodFleet. All rights reserved.</p>
      <p className="text-sm text-gray-400 mt-1">Your favorite food, delivered.</p>
    </div>
  </footer>
);


const RestaurantMenuPage = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState(mockRestaurant); // In a real app, fetch based on ID
  const [menuItems, setMenuItems] = useState(mockMenuItems); // In a real app, fetch
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
  const [selectedMenuItemForCustomization, setSelectedMenuItemForCustomization] = useState<any | null>(null);

  // Example customization state
  const [customizationChoices, setCustomizationChoices] = useState<Record<string, any>>({});


  useEffect(() => {
    console.log('RestaurantMenuPage loaded');
    const restaurantIdFromState = location.state?.restaurantId;
    if (restaurantIdFromState) {
      console.log('Restaurant ID from navigation state:', restaurantIdFromState);
      // Here you would typically fetch restaurant and menu data based on restaurantIdFromState
      // For now, we'll just use the mock data.
    }
  }, [location.state]);

  const handleAddToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id && JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)); // Simplistic check for customizations
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return updatedCart;
      }
      return [...prevCart, item];
    });
    // Toast is handled by MenuItemCard, but we can show a summary one here too if needed
    console.log(`${item.name} added to cart. Current cart:`, cart);
  };

  const handleOpenCustomizeDialog = (itemId: string | number) => {
    const item = menuItems.find(mi => mi.id === itemId);
    if (item && item.customizationAvailable) {
      setSelectedMenuItemForCustomization(item);
      setCustomizationChoices({}); // Reset choices for new item
      setIsCustomizeDialogOpen(true);
    }
  };

  const handleCustomizationChange = (optionType: string, value: any, isMultiSelect = false) => {
    setCustomizationChoices(prev => {
      const updatedChoices = { ...prev };
      if (isMultiSelect) {
        const currentSelection = updatedChoices[optionType] || [];
        if (currentSelection.includes(value)) {
          updatedChoices[optionType] = currentSelection.filter((v: any) => v !== value);
        } else {
          updatedChoices[optionType] = [...currentSelection, value];
        }
      } else {
        updatedChoices[optionType] = value;
      }
      return updatedChoices;
    });
  };
  
  const handleSaveCustomization = () => {
    if (!selectedMenuItemForCustomization) return;

    const customizedItem: CartItem = {
      id: selectedMenuItemForCustomization.id,
      name: selectedMenuItemForCustomization.name,
      price: selectedMenuItemForCustomization.price, // Base price, customizations might add to it
      quantity: 1, // Default quantity for customized item, can be adjusted later
      customizations: customizationChoices,
      imageUrl: selectedMenuItemForCustomization.imageUrl,
    };
    // Price adjustment logic would go here based on customizationChoices
    // For simplicity, we're not adjusting price in this example.

    handleAddToCart(customizedItem);
    setIsCustomizeDialogOpen(false);
    setSelectedMenuItemForCustomization(null);
    toast({
      title: "Item Customized & Added",
      description: `${customizedItem.name} with your selections has been added to the cart.`,
    });
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader />

      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        <section aria-label="Breadcrumbs" className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {/* In a real app, this might be a "Restaurants" list page */}
              <BreadcrumbItem>
                 <BreadcrumbLink asChild><Link to="/">Restaurants</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{restaurant.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>

        <Card className="mb-8 shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img src={restaurant.imageUrl} alt={restaurant.name} className="object-cover h-48 w-full md:h-full" />
            </div>
            <div className="md:w-2/3">
              <CardHeader className="pb-3">
                <CardTitle className="text-3xl font-bold text-gray-800">{restaurant.name}</CardTitle>
                <CardDescription className="text-gray-600 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1.5" /> {restaurant.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pb-4">
                <div className="flex items-center text-sm text-gray-700">
                  <Star className="h-5 w-5 mr-1.5 text-yellow-500 fill-yellow-500" />
                  <span>{restaurant.rating.toFixed(1)} ({restaurant.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Clock className="h-5 w-5 mr-1.5" />
                  <span>Open: {restaurant.openingHours}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {restaurant.cuisineTypes.map(cuisine => (
                    <span key={cuisine} className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full">{cuisine}</span>
                  ))}
                </div>
              </CardContent>
            </div>
          </div>
        </Card>

        <section aria-labelledby="menu-heading">
          <div className="flex justify-between items-center mb-6">
            <h2 id="menu-heading" className="text-2xl md:text-3xl font-semibold text-gray-800 flex items-center">
              <ChefHat className="h-8 w-8 mr-3 text-primary" /> Menu
            </h2>
             {/* Placeholder for filters or sorting if needed in future */}
          </div>
          
          <ScrollArea className="h-[calc(100vh-500px)] md:h-[calc(100vh-450px)] lg:h-[calc(100vh-400px)] pr-3 -mr-3"> {/* Adjust height and padding for scrollbar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  imageUrl={item.imageUrl}
                  customizationAvailable={item.customizationAvailable}
                  onAddToCart={handleAddToCart}
                  onCustomize={item.customizationAvailable ? handleOpenCustomizeDialog : undefined}
                />
              ))}
            </div>
          </ScrollArea>
        </section>
      </main>

      {selectedMenuItemForCustomization && (
        <Dialog open={isCustomizeDialogOpen} onOpenChange={(open) => {
            if (!open) {
                setSelectedMenuItemForCustomization(null);
            }
            setIsCustomizeDialogOpen(open);
        }}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Customize: {selectedMenuItemForCustomization.name}</DialogTitle>
              <DialogDescription>
                Make selections to customize your item. Base price: ${selectedMenuItemForCustomization.price.toFixed(2)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto px-1">
              {selectedMenuItemForCustomization.options?.size && (
                <div className="space-y-2">
                  <Label htmlFor="size-options" className="font-semibold">Size</Label>
                  <RadioGroup 
                    id="size-options"
                    defaultValue={selectedMenuItemForCustomization.options.size[0]}
                    onValueChange={(value) => handleCustomizationChange('size', value)}
                  >
                    {selectedMenuItemForCustomization.options.size.map((s: string) => (
                      <div key={s} className="flex items-center space-x-2">
                        <RadioGroupItem value={s} id={`size-${s}`} />
                        <Label htmlFor={`size-${s}`}>{s}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {selectedMenuItemForCustomization.options?.crust && (
                 <div className="space-y-2">
                  <Label htmlFor="crust-options" className="font-semibold">Crust</Label>
                  <RadioGroup 
                    id="crust-options"
                    defaultValue={selectedMenuItemForCustomization.options.crust[0]}
                    onValueChange={(value) => handleCustomizationChange('crust', value)}
                  >
                    {selectedMenuItemForCustomization.options.crust.map((c: string) => (
                      <div key={c} className="flex items-center space-x-2">
                        <RadioGroupItem value={c} id={`crust-${c}`} />
                        <Label htmlFor={`crust-${c}`}>{c}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
              
              {selectedMenuItemForCustomization.options?.extraToppings && (
                <div className="space-y-2">
                  <Label className="font-semibold">Extra Toppings</Label>
                  {selectedMenuItemForCustomization.options.extraToppings.map((topping: { id: string, name: string, price: number }) => (
                    <div key={topping.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`topping-${topping.id}`} 
                        onCheckedChange={(checked) => handleCustomizationChange('extraToppings', topping.name, true)}
                      />
                      <Label htmlFor={`topping-${topping.id}`} className="flex-grow">{topping.name}</Label>
                      <span className="text-sm text-gray-600">+${topping.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

               {selectedMenuItemForCustomization.options?.servingSize && (
                <div className="space-y-2">
                  <Label htmlFor="serving-size-options" className="font-semibold">Serving Size</Label>
                  <RadioGroup
                    id="serving-size-options"
                    defaultValue={selectedMenuItemForCustomization.options.servingSize[0]}
                    onValueChange={(value) => handleCustomizationChange('servingSize', value)}
                  >
                    {selectedMenuItemForCustomization.options.servingSize.map((ss: string) => (
                      <div key={ss} className="flex items-center space-x-2">
                        <RadioGroupItem value={ss} id={`serving-${ss}`} />
                        <Label htmlFor={`serving-${ss}`}>{ss}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

               {selectedMenuItemForCustomization.options?.protein && (
                <div className="space-y-2">
                  <Label htmlFor="protein-options" className="font-semibold">Add Protein</Label>
                  <RadioGroup
                    id="protein-options"
                    defaultValue={selectedMenuItemForCustomization.options.protein[0]}
                    onValueChange={(value) => handleCustomizationChange('protein', value)}
                  >
                    {selectedMenuItemForCustomization.options.protein.map((p: string) => (
                      <div key={p} className="flex items-center space-x-2">
                        <RadioGroupItem value={p} id={`protein-${p}`} />
                        <Label htmlFor={`protein-${p}`}>{p}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {!Object.keys(selectedMenuItemForCustomization.options || {}).length && (
                <p className="text-sm text-gray-500">No specific customization options available for this item. Add directly to cart.</p>
              )}

            </div>
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setIsCustomizeDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveCustomization}>Save & Add to Cart</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <AppFooter />
    </div>
  );
};

export default RestaurantMenuPage;