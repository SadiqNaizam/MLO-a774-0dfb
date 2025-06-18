import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, Soup, Truck, PackageCheck } from 'lucide-react';
import { cn } from "@/lib/utils"; // Assuming standard shadcn/ui setup

// Define the order status type
export type OrderStatus = 'confirmed' | 'preparing' | 'delivery' | 'delivered';

// Define the props for the OrderTracker component
export interface OrderTrackerProps {
  status: OrderStatus;
  estimatedDeliveryTime?: string; // Overall ETA for the order, e.g., "Est. delivery: 5:30 PM"
  stageTimings?: { // Specific timings or details for each stage
    confirmed?: string;   // e.g., "10:00 AM" or "Order confirmed by restaurant"
    preparing?: string; // e.g., "Est. ready by 10:15 AM" or "Chef is working on it!"
    delivery?: string;  // e.g., "Driver: John Doe (Honda Civic, ABC-123)" or "On its way, near downtown"
    delivered?: string;   // e.g., "10:45 AM - Left at front door" or "Handed to customer"
  };
}

// Define the stages configuration
const STAGES_CONFIG = [
  { id: 'confirmed' as OrderStatus, title: 'Order Confirmed', Icon: ThumbsUp, description: "Your order has been confirmed by the restaurant." },
  { id: 'preparing' as OrderStatus, title: 'Preparing Food', Icon: Soup, description: "The restaurant is preparing your meal." },
  { id: 'delivery' as OrderStatus, title: 'Out for Delivery', Icon: Truck, description: "Your order is on its way." },
  { id: 'delivered' as OrderStatus, title: 'Delivered', Icon: PackageCheck, description: "Enjoy your meal!" },
];

const OrderTracker: React.FC<OrderTrackerProps> = ({ status, estimatedDeliveryTime, stageTimings }) => {
  console.log('OrderTracker loaded with status:', status);

  const currentStageIndex = STAGES_CONFIG.findIndex(s => s.id === status);

  const getProgressValue = () => {
    if (currentStageIndex === -1) return 0; // Should not happen with typed props
    // Progress: ((current stage index + 1) / total stages) * 100
    return ((currentStageIndex + 1) / STAGES_CONFIG.length) * 100;
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-xl md:text-2xl font-bold text-gray-800">Order Status</CardTitle>
        {estimatedDeliveryTime && (
          <p className="text-sm text-gray-600 mt-1">{estimatedDeliveryTime}</p>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Progress value={getProgressValue()} className="w-full h-2.5 rounded-full" />

        <div className="space-y-8 pt-2">
          {STAGES_CONFIG.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isPending = index > currentStageIndex;

            let detailText = "Pending";
            if (isCompleted) {
              detailText = stageTimings?.[stage.id] || "Completed";
            } else if (isCurrent) {
              detailText = stageTimings?.[stage.id] || stage.description;
            }

            return (
              <div key={stage.id} className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300",
                      isCompleted ? "bg-green-500 border-green-600 text-white" : "",
                      isCurrent ? "bg-blue-500 border-blue-600 text-white animate-pulse ring-4 ring-blue-200" : "",
                      isPending ? "bg-gray-100 border-gray-300 text-gray-400" : ""
                    )}
                  >
                    <stage.Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  {/* Connector line - except for the last item */}
                  {index < STAGES_CONFIG.length - 1 && (
                    <div className={cn(
                        "w-0.5 grow min-h-[2.5rem] mt-1 transition-colors duration-500", // grow makes it fill space
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  )}
                </div>
                
                <div className="pt-1 sm:pt-2 min-w-0 flex-1"> {/* Min-w-0 for text truncation if needed */}
                  <h3
                    className={cn(
                      "font-semibold text-base sm:text-lg",
                      isCompleted ? "text-green-700" : "",
                      isCurrent ? "text-blue-700" : "",
                      isPending ? "text-gray-500" : ""
                    )}
                  >
                    {stage.title}
                  </h3>
                  <p className={cn(
                      "text-xs sm:text-sm mt-0.5",
                      isPending ? "text-gray-400" : "text-gray-600"
                    )}>
                    {detailText}
                  </p>
                  {isCurrent && stage.id === 'delivery' && (
                    <div className="mt-2 p-2.5 bg-blue-50 rounded-md border border-blue-200">
                      <p className="text-xs sm:text-sm text-blue-700">
                        Your order is on the move! 
                        {/* Simplified map view placeholder */}
                        {/* <a href="#" className="font-medium hover:underline ml-1">Track on map</a> */}
                      </p>
                       {/* Example of showing driver info if passed in stageTimings.delivery */}
                       {stageTimings?.delivery && stageTimings.delivery.toLowerCase().includes("driver") && (
                         <p className="text-xs text-gray-600 mt-1">{stageTimings.delivery}</p>
                       )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTracker;