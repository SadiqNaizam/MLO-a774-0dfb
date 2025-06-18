import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Custom Components
import AddressCard from '@/components/AddressCard'; // From custom_component_code

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// Select is in layout_info, but not used in this specific implementation to keep it focused.
// If needed, it could be for something like delivery time slots.

// Lucide Icons
import { CreditCard, Home, ShoppingCart, ArrowLeft, Building, ShieldCheck } from 'lucide-react';

// Placeholder Header component for Checkout Page context
const CheckoutHeader: React.FC = () => (
  <header className="bg-white border-b shadow-sm sticky top-0 z-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
        FoodFleet
      </Link>
      <div className="flex items-center gap-3 sm:gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/cart">
            <ShoppingCart className="mr-1.5 h-4 w-4" />
            Cart
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
            <Link to="/user-profile">My Profile</Link>
        </Button>
      </div>
    </div>
  </header>
);

// Placeholder Footer component for Checkout Page context
const CheckoutFooter: React.FC = () => (
  <footer className="bg-gray-100 border-t mt-12">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
        <ShieldCheck className="h-5 w-5 text-green-600" />
        <span>Secure Checkout Process</span>
      </div>
      <p className="text-xs text-gray-500">
        &copy; {new Date().getFullYear()} FoodFleet. All rights reserved.
      </p>
       <p className="text-xs text-gray-500 mt-1">
        Need help? <Link to="/contact" className="underline hover:text-primary">Contact Us</Link> {/* Assuming /contact might exist */}
      </p>
    </div>
  </footer>
);

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

const CheckoutPage: React.FC = () => {
  console.log('CheckoutPage loaded');
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>('addr1');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const addresses = [
    { id: 'addr1', addressLine1: '123 Main St', city: 'Foodville', state: 'FS', zipCode: '90210', country: 'USA', addressType: 'Home' as 'Home' | 'Work' | string, isDefault: true },
    { id: 'addr2', addressLine1: '456 Corporate Ave', addressLine2: 'Suite 500', city: 'Biztown', state: 'BS', zipCode: '10001', country: 'USA', addressType: 'Work' as 'Home' | 'Work' | string, isDefault: false },
  ];

  const orderSummary = {
    items: [
      { name: 'Deluxe Burger', quantity: 1, price: 12.99 },
      { name: 'Large Fries', quantity: 1, price: 3.49 },
      { name: 'Soda', quantity: 2, price: 1.99 },
    ] as OrderItem[],
    get subtotal() {
      return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    deliveryFee: 2.50,
    get tax() { // Assuming 7% tax
      return this.subtotal * 0.07;
    },
    get total() {
      return this.subtotal + this.deliveryFee + this.tax;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
  };

  const handleEditAddress = (id: string) => {
    // Placeholder for actual edit functionality
    alert(`Edit address: ${id}. (This would typically open a modal or form)`);
    // Example: navigate(`/user-profile/addresses/edit/${id}`);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) {
        alert("Please select a delivery address.");
        return;
    }
    if (paymentMethod === 'card') {
        if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardName) {
            alert("Please fill in all card details.");
            return;
        }
    }
    console.log('Placing order:', {
      selectedAddressId,
      paymentMethod,
      cardDetails: paymentMethod === 'card' ? cardDetails : null,
      order: orderSummary,
    });
    // Simulate API call & success
    alert('Order Placed Successfully! Redirecting to your profile...');
    navigate('/user-profile', { state: { orderConfirmation: { ...orderSummary, orderId: `ORD-${Date.now()}` } } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CheckoutHeader />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/cart')} className="text-sm text-gray-600 hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
          </Button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content: Address & Payment */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" /> Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    {...addr}
                    isSelected={selectedAddressId === addr.id}
                    onSelectAddress={handleSelectAddress}
                    onEditAddress={handleEditAddress}
                  />
                ))}
                <Button variant="outline" className="w-full mt-2">
                  Add New Address
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  {[
                    { value: 'card', label: 'Credit/Debit Card', Icon: CreditCard },
                    { value: 'paypal', label: 'PayPal (Placeholder)', Icon: Building }, // Using Building as placeholder icon
                    { value: 'cod', label: 'Cash on Delivery (Placeholder)', Icon: Home } // Using Home as placeholder icon
                  ].map(opt => (
                    <Label 
                        key={opt.value}
                        htmlFor={`payment-${opt.value}`} 
                        className={`flex items-center space-x-3 p-3 border rounded-md cursor-pointer transition-all hover:border-primary/70 ${paymentMethod === opt.value ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-gray-200'}`}
                    >
                      <RadioGroupItem value={opt.value} id={`payment-${opt.value}`} />
                      <opt.Icon className={`h-5 w-5 ${paymentMethod === opt.value ? 'text-primary' : 'text-gray-500'}`} />
                      <span className="font-medium">{opt.label}</span>
                    </Label>
                  ))}
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
                    <h3 className="text-md font-semibold text-gray-700">Enter Card Details:</h3>
                    <div>
                      <Label htmlFor="cardNumber" className="text-sm font-medium">Card Number</Label>
                      <Input id="cardNumber" name="cardNumber" type="text" placeholder="0000 0000 0000 0000" value={cardDetails.cardNumber} onChange={handleInputChange} required className="mt-1"/>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate" className="text-sm font-medium">Expiry Date (MM/YY)</Label>
                        <Input id="expiryDate" name="expiryDate" type="text" placeholder="MM/YY" value={cardDetails.expiryDate} onChange={handleInputChange} required className="mt-1"/>
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm font-medium">CVV</Label>
                        <Input id="cvv" name="cvv" type="text" placeholder="123" value={cardDetails.cvv} onChange={handleInputChange} required className="mt-1"/>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardName" className="text-sm font-medium">Name on Card</Label>
                      <Input id="cardName" name="cardName" type="text" placeholder="Full Name as on Card" value={cardDetails.cardName} onChange={handleInputChange} required className="mt-1"/>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <Card className="shadow-md sticky top-24"> {/* Sticky summary */}
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {orderSummary.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{item.name} (x{item.quantity})</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr className="my-3 border-gray-200"/>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">${orderSummary.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7%)</span>
                  <span className="font-medium">${orderSummary.tax.toFixed(2)}</span>
                </div>
                <hr className="my-3 border-gray-200"/>
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>${orderSummary.total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="mt-2">
                <Button type="submit" className="w-full" size="lg">
                  Place Order & Pay ${orderSummary.total.toFixed(2)}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </main>

      <CheckoutFooter />
    </div>
  );
};

export default CheckoutPage;