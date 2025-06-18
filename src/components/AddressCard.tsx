import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, CheckCircle, Home, Building } from 'lucide-react';
import { cn } from "@/lib/utils"; // Assuming utils.ts exists for cn

interface AddressCardProps {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType?: 'Home' | 'Work' | string; // Allow custom types but suggest common ones
  isDefault?: boolean;
  isSelected?: boolean;
  onSelectAddress: (id: string) => void;
  onEditAddress: (id: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  id,
  addressLine1,
  addressLine2,
  city,
  state,
  zipCode,
  country,
  addressType,
  isDefault,
  isSelected,
  onSelectAddress,
  onEditAddress,
}) => {
  console.log('AddressCard loaded for ID:', id);

  const AddressIcon = addressType === 'Home' ? Home : addressType === 'Work' ? Building : null;

  return (
    <Card className={cn("w-full transition-all", isSelected ? "border-primary ring-2 ring-primary shadow-lg" : "hover:shadow-md")}>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                {AddressIcon && <AddressIcon className="h-5 w-5 text-muted-foreground" />}
                <CardTitle className="text-lg">
                    {addressType || "Delivery Address"}
                </CardTitle>
            </div>
            {isDefault && !isSelected && (
                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">Default</span>
            )}
            {isSelected && (
                 <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Selected</span>
            )}
        </div>
        <CardDescription className="pt-1">
          {addressLine1}
          {addressLine2 && <br />}
          {addressLine2}
          <br />
          {city}, {state} {zipCode}
          <br />
          {country}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Additional content can go here if needed in the future */}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4 border-t">
        <Button variant="outline" size="sm" onClick={() => onEditAddress(id)} className="w-full sm:w-auto">
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
        {!isSelected && (
          <Button variant="default" size="sm" onClick={() => onSelectAddress(id)} className="w-full sm:w-auto">
            <CheckCircle className="mr-2 h-4 w-4" /> Select this Address
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AddressCard;