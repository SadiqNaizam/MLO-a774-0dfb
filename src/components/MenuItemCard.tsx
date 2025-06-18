import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Minus, ShoppingCart, Settings2 } from 'lucide-react';

export interface MenuItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  // Potentially other details like selected customizations if added through a dialog
}

interface MenuItemCardProps {
  id: string | number;
  imageUrl?: string;
  name: string;
  description: string;
  price: number;
  customizationAvailable?: boolean;
  onAddToCart: (item: MenuItem) => void;
  onCustomize?: (itemId: string | number) => void;
  initialQuantity?: number; // In case it's pre-filled, e.g. from cart
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  imageUrl,
  name,
  description,
  price,
  customizationAvailable = false,
  onAddToCart,
  onCustomize,
  initialQuantity = 1,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const { toast } = useToast();

  useEffect(() => {
    console.log(`MenuItemCard loaded for: ${name}`);
  }, [name]);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    } else if (event.target.value === '') {
      // Let user clear it, but default to 1 if they leave it blank and try to add
      // For now, setting to 1 immediately to keep input valid.
      setQuantity(1);
    }
  };

  const handleAddToCartClick = () => {
    const itemToAdd: MenuItem = { id, name, price, quantity };
    onAddToCart(itemToAdd);
    toast({
      title: "Item Added to Cart",
      description: `${quantity} x ${name} successfully added.`,
    });
    // Optionally reset quantity to 1 after adding, or let parent decide via initialQuantity prop if item is re-rendered
    // setQuantity(1); 
  };

  const handleCustomizeClick = () => {
    if (onCustomize) {
      onCustomize(id);
    } else {
      // Fallback toast if customization is marked available but no handler is provided
      toast({
        title: "Customization",
        description: `Customization options for ${name} would appear here.`,
        variant: "default",
      });
    }
  };

  return (
    <Card className="w-full overflow-hidden flex flex-col shadow-md hover:shadow-lg transition-shadow duration-200">
      {imageUrl && (
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl}
              alt={name}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </CardHeader>
      )}
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg md:text-xl font-semibold mb-1">{name}</CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-3 h-[3.75rem]">{description}</CardDescription>
        <p className="text-base md:text-lg font-bold text-gray-900">${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-3 md:p-4 border-t bg-gray-50">
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={handleDecrement} aria-label="Decrease quantity">
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-14 h-9 text-center"
                aria-label="Item quantity"
              />
              <Button variant="outline" size="icon" onClick={handleIncrement} aria-label="Increase quantity">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleAddToCartClick} className="flex-1 w-full">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            {customizationAvailable && (
              <Button variant="secondary" onClick={handleCustomizeClick} className="flex-1 sm:flex-none w-full sm:w-auto">
                <Settings2 className="mr-2 h-4 w-4" />
                Customize
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;