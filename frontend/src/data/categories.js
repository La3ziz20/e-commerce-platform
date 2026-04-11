import { Monitor, Smartphone, Headphones, Watch, Laptop, Camera, Gamepad, Home, Mouse, Tv, Speaker, Tablet, Armchair, Shirt, BookOpen } from 'lucide-react';

export const CATEGORIES = [
  { name: 'Electronics', count: 124, icon: Monitor },
  { name: 'Furniture', count: 35, icon: Armchair },
  { name: 'Home', count: 18, icon: Home },
  { name: 'Clothing', count: 96, icon: Shirt },
  { name: 'Books', count: 42, icon: BookOpen },
  { name: 'Accessories', count: 210, icon: Mouse },
  { name: 'Smartphones', count: 89, icon: Smartphone },
  { name: 'Audio', count: 45, icon: Headphones },
  { name: 'Wearables', count: 32, icon: Watch },
  { name: 'Computers', count: 76, icon: Laptop },
  { name: 'Photography', count: 21, icon: Camera },
  { name: 'Gaming', count: 54, icon: Gamepad },
  { name: 'TV & Video', count: 37, icon: Tv },
  { name: 'Speakers', count: 42, icon: Speaker },
  { name: 'Tablets', count: 29, icon: Tablet },
];

export const CATEGORY_NAMES = CATEGORIES.map(c => c.name);
