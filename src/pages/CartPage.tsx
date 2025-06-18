import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Trash2, Plus, Minus } from 'lucide-react';

// Import MenuItem interface from the custom MenuItemCard component
// We'll use this for the structure of our cart items.
import MenuItemCard, { MenuItem as CartItemProps } from '@/components/MenuItemCard';

// Define an extended CartItem type if needed, or use CartItemProps directly
interface CartItem extends CartItemProps {
  imageUrl?: string; // Add imageUrl if not already in MenuItem
}

const initialCartItems: CartItem[] = [
  {
    id: 'item1',
    name: 'Margherita Pizza',
    price: 12.99,
    quantity: 2,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1675351099200-8072549a4776?q=80&w=600',
  },
  {
    id: 'item2',
    name: 'Spicy Burger',
    price: 8.50,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600',
  },
  {
    id: 'item3',
    name: 'Caesar Salad',
    price: 7.25,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=600',
  },
];

const suggestedItemsData = [
  {
    id: 'sugg1',
    name: 'Chocolate Lava Cake',
    description: 'Warm, gooey chocolate cake with a molten center. The perfect end to any meal.',
    price: 6.00,
    imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b82?q=80&w=600',
    customizationAvailable: false,
  },
  {
    id: 'sugg2',
    name: 'Garlic Bread Sticks',
    description: 'Crispy on the outside, soft on the inside, served with marinara sauce.',
    price: 4.50,
    imageUrl: 'https://images.unsplash.com/photo-1627620114490-930414061190?q=80&w=600',
    customizationAvailable: false,
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CartPage loaded');
  }, []);

  const handleQuantityChange = (itemId: string | number, newQuantity: number) => {
    if (newQuantity < 1) return; // Minimum quantity is 1
    setCartItems(
      cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string | number) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    });
  };

  const handleApplyPromoCode = () => {
    if (promoCode.toUpperCase() === 'DISCOUNT10') {
      toast({
        title: "Promo Code Applied",
        description: "10% discount has been applied to your order!",
      });
      // Actual discount logic would affect subtotal/total calculation
    } else {
      toast({
        title: "Invalid Promo Code",
        description: "The promo code entered is not valid.",
        variant: "destructive",
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Placeholder for discount and tax logic
  const discountAmount = promoCode.toUpperCase() === 'DISCOUNT10' ? subtotal * 0.1 : 0;
  const taxRate = 0.08; // 8% tax
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + taxAmount;

  const handleProceedToCheckout = () => {
    console.log('Proceeding to checkout with items:', cartItems);
    // Pass cart data to checkout page via state or context/store
    navigate('/checkout', { state: { cartItems, subtotal, discountAmount, taxAmount, total } });
  };

  const handleDummyAddToCart = (item: CartItemProps) => {
    toast({
      title: `${item.name} Added`,
      description: `You've added ${item.name} to your cart. (Demo)`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Page Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            FoodApp
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
              Menu
            </Link>
            <Link to="/cart" className="text-primary font-semibold">
              Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </Link>
            <Link to="/user-profile" className="text-gray-600 hover:text-primary transition-colors">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
              <Button asChild>
                <Link to="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="lg:flex lg:gap-8">
            {/* Cart Items Table */}
            <section className="lg:w-2/3 mb-6 lg:mb-0">
              <Card>
                <CardHeader>
                  <CardTitle>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden md:table-cell w-[100px]">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Remove</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="hidden md:table-cell">
                            <img
                              src={item.imageUrl || 'https://via.placeholder.com/80'}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={e => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)}
                                className="w-12 h-8 text-center px-1"
                                min="1"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>

            {/* Order Summary Card */}
            <aside className="lg:w-1/3">
              <Card className="sticky top-24"> {/* top-24 to account for sticky header + margin */}
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div>
                    <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Promotional Code
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        id="promoCode"
                        type="text"
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        className="flex-grow"
                      />
                      <Button variant="outline" onClick={handleApplyPromoCode}>
                        Apply
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="lg" className="w-full" onClick={handleProceedToCheckout}>
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </aside>
          </div>
        )}

        {/* "You Might Also Like" Section */}
        {cartItems.length > 0 && ( /* Only show if cart is not empty */
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {suggestedItemsData.map(item => (
                <MenuItemCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  imageUrl={item.imageUrl}
                  customizationAvailable={item.customizationAvailable}
                  onAddToCart={handleDummyAddToCart} // Using a dummy handler for suggestions
                  // onCustomize can be omitted or also be a dummy
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Page Footer */}
      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} FoodApp Ordering Platform. All rights reserved.
          <div className="mt-2 space-x-4">
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;