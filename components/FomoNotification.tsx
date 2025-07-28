
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card } from "../components/ui/card";
import { cn } from "../lib/utils";
import { useProducts } from "../hooks/useWordPress";

const locations = ["Rohini", "Pitampura", "Delhi", "Gurugram", "Noida", "Saket", "Punjabi Bagh", "Janakpuri"];
const times = ["just now", "2 minutes ago", "5 minutes ago", "10 minutes ago", "15 minutes ago", "30 minutes ago"];
const firstNames = ["Riya", "Aayush", "Lakshay", "Kanika", "Sanya", "Pooja", "Rajesh", "Mohit"];
const lastInitials = ["M", "D", "R", "P", "S", "T", "L", "W"];

const FomoNotification = () => {
  const [currentNotification, setCurrentNotification] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { data: products } = useProducts({ per_page: "10" });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasShownInitial, setHasShownInitial] = useState(false);

  // Generate realistic notifications when products load
  useEffect(() => {
    if (products && products.length > 0) {
      const generatedNotifications = products.map((product, index) => {
        const nameIndex = Math.floor(Math.random() * firstNames.length);
        const locationIndex = Math.floor(Math.random() * locations.length);
        const timeIndex = Math.floor(Math.random() * times.length);
        
        return {
          id: index + 1,
          name: `${firstNames[nameIndex]} ${lastInitials[nameIndex]}.`,
          product: product.name,
          location: locations[locationIndex],
          time: times[timeIndex],
          image: product.images[0]?.src || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=200&q=80",
        };
      });
      
      setNotifications(generatedNotifications);
    }
  }, [products]);

  useEffect(() => {
    if (notifications.length === 0) return;

    const showNotification = () => {
      if (!isVisible) {
        const randomIndex = Math.floor(Math.random() * notifications.length);
        setCurrentNotification(randomIndex);
        setIsVisible(true);
        
        // Hide notification after 12 seconds (increased from 8)
        setTimeout(() => {
          setIsVisible(false);
        }, 12000);
      }
    };

    // Show first notification after 8 seconds (increased from 5)
    if (!hasShownInitial) {
      const initialTimer = setTimeout(() => {
        showNotification();
        setHasShownInitial(true);
      }, 8000);
      
      return () => clearTimeout(initialTimer);
    }

    // Set up interval for subsequent notifications every 45 seconds (increased from 20)
    const interval = setInterval(() => {
      if (!isVisible) {
        showNotification();
      }
    }, 45000);
    
    return () => clearInterval(interval);
  }, [notifications, isVisible, hasShownInitial]);

  if (currentNotification === null || !isVisible || notifications.length === 0) {
    return null;
  }

  const notification = notifications[currentNotification % notifications.length];

  return (
    <div className={cn(
      "fixed bottom-5 left-5 z-50 transition-all duration-500 transform",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    )}>
      <Card className="p-3 w-80 flex items-start gap-3 shadow-lg border-l-4 border-l-primary animate-fade-in">
        <div className="flex-shrink-0">
          <img 
            src={notification.image} 
            alt={notification.product}
            className="w-12 h-12 rounded-lg object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className="font-medium text-sm">{notification.name}</p>
            <button 
              onClick={() => setIsVisible(false)} 
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Booked <span className="font-medium text-foreground">{notification.product}</span>
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{notification.location}</span>
            <span>•</span>
            <span>{notification.time}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FomoNotification;
