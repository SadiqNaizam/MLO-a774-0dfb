import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from 'lucide-react';

interface RestaurantCardProps {
  id: string;
  imageUrl: string;
  name: string;
  cuisineTypes: string[];
  rating: number; // e.g., 4.5
  reviewCount?: number; // e.g., 200
  deliveryTime: string; // e.g., "25-35 min"
  promotionalTag?: string; // e.g., "20% OFF"
  description?: string; // Short description
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  imageUrl,
  name,
  cuisineTypes,
  rating,
  reviewCount,
  deliveryTime,
  promotionalTag,
  description,
}) => {
  console.log('RestaurantCard loaded for:', name);

  return (
    <Link
      to="/restaurant-menu"
      state={{ restaurantId: id }}
      className="block rounded-lg overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label={`View menu for ${name}`}
    >
      <Card className="w-full h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-focus-within:shadow-xl">
        <CardHeader className="p-0 relative">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl || 'https://via.placeholder.com/400x225?text=Restaurant'}
              alt={`Image of ${name}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
          {promotionalTag && (
            <Badge
              variant="destructive"
              className="absolute top-3 right-3 text-xs px-2 py-1 z-10"
            >
              {promotionalTag}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-4 space-y-2 flex-grow flex flex-col">
          <CardTitle className="text-xl font-semibold line-clamp-1 group-hover:text-primary">
            {name}
          </CardTitle>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">
              {description}
            </p>
          )}

          {cuisineTypes && cuisineTypes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {cuisineTypes.slice(0, 3).map((cuisine, index) => ( // Show max 3 cuisines
                <Badge key={index} variant="outline" className="text-xs">
                  {cuisine}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <div className="p-4 border-t mt-auto">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
              {reviewCount && <span>({reviewCount})</span>}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{deliveryTime}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default RestaurantCard;