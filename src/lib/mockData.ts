export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  isPopular: boolean;
  isVeg: boolean;
  tags?: string[];
}

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'completed';
export type PaymentMethod = 'COD' | 'QR' | 'UPI' | 'CARD';
export type PaymentStatus = 'Pending' | 'Paid';

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  pickupTime: string;
  createdAt: string;
}

export const mockMenu: MenuItem[] = [
  // Breakfast & Drinks
  { id: "b1", name: "Kulhad Chai", description: "Hot traditional tea served in an earthen clay cup.", price: 20, category: "Breakfast & Drinks", imageUrl: "/menu-items/kulhad-tea.jpg", isAvailable: true, isPopular: true, isVeg: true, tags: ["Bestseller"] },
  { id: "b2", name: "Kulhad Milk", description: "Warm, sweet milk served in a traditional kulhad.", price: 40, category: "Breakfast & Drinks", imageUrl: "/menu-items/kulhad-milk.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "b3", name: "Poha", description: "Freshly made flattened rice tempered with mild spices.", price: 30, category: "Breakfast & Drinks", imageUrl: "/menu-items/poha.jpg", isAvailable: true, isPopular: true, isVeg: true },
  { id: "b4", name: "Samosa", description: "Crispy fried pastry filled with spiced potatoes.", price: 20, category: "Breakfast & Drinks", imageUrl: "/menu-items/samosa.jpg", isAvailable: true, isPopular: true, isVeg: true, tags: ["Hot"] },
  { id: "b5", name: "Besan Chilla", description: "Savory pancake made with gram flour and veggies.", price: 65, category: "Breakfast & Drinks", imageUrl: "/menu-items/besan-chilla.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "b6", name: "Aloo Puff", description: "Flaky puff pastry stuffed with spiced potato filling.", price: 25, category: "Breakfast & Drinks", imageUrl: "https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?q=80&w=600", isAvailable: true, isPopular: false, isVeg: true },
  { id: "b7", name: "Chilli Paneer Puff", description: "Crisp puff loaded with spicy chilli paneer chunks.", price: 30, category: "Breakfast & Drinks", imageUrl: "/menu-items/chilli-paneer-puff.jpg", isAvailable: true, isPopular: true, isVeg: true },
  { id: "b8", name: "Masala Puff", description: "Baked pastry infused with aromatic mixed masala.", price: 40, category: "Breakfast & Drinks", imageUrl: "/menu-items/masala-puff.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "b9", name: "Chowmin Puff", description: "Unique fusion puff stuffed with spicy chowmein.", price: 35, category: "Breakfast & Drinks", imageUrl: "/menu-items/chowmin-puff.png", isAvailable: false, isPopular: false, isVeg: true },
  { id: "b10", name: "Paneer 65 Puff", description: "A special puff packed with tangy Paneer 65.", price: 40, category: "Breakfast & Drinks", imageUrl: "/menu-items/paneer-65-puff.jpg", isAvailable: true, isPopular: true, isVeg: true },
  { id: "b11", name: "Corn Puff", description: "Sweet and savory cream corn filled puff pastry.", price: 30, category: "Breakfast & Drinks", imageUrl: "/menu-items/corn-puff.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "b12", name: "Idli Sambar (2 pcs)", description: "Soft steamed rice cakes served with lentil soup.", price: 40, category: "Breakfast & Drinks", imageUrl: "/menu-items/idli-sambar.jpg", isAvailable: true, isPopular: true, isVeg: true },
  { id: "b13", name: "Idli (3 pcs)", description: "Three soft steamed rice cakes with chutney.", price: 40, category: "Breakfast & Drinks", imageUrl: "/menu-items/idli-3pcs.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "b14", name: "Aloo Paratha (Half) + Curd", description: "Half portion of stuffed potato flatbread with fresh curd.", price: 45, category: "Breakfast & Drinks", imageUrl: "/menu-items/aloo-paratha-half.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "b15", name: "Aloo Paratha (Full) + Curd", description: "Full portion of stuffed potato flatbread with fresh curd.", price: 70, category: "Breakfast & Drinks", imageUrl: "/menu-items/aloo-paratha-full.jpg", isAvailable: true, isPopular: true, isVeg: true, tags: ["Bestseller"] },
  { id: "b16", name: "Pyaz Paratha (2 pcs)", description: "Two onion-stuffed Indian flatbreads.", price: 80, category: "Breakfast & Drinks", imageUrl: "/menu-items/pyaz-paratha.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "b17", name: "Mix Veg Paratha (Half)", description: "Half portion of hearty mixed vegetable flatbread.", price: 50, category: "Breakfast & Drinks", imageUrl: "/menu-items/mix-veg-paratha-half.png", isAvailable: true, isPopular: false, isVeg: true },
  { id: "b18", name: "Mix Veg Paratha (Full)", description: "Full portion of hearty mixed vegetable flatbread.", price: 80, category: "Breakfast & Drinks", imageUrl: "/menu-items/mix-veg-paratha-full.jpg", isAvailable: true, isPopular: false, isVeg: true },

  // Snacks & Sandwiches
  { id: "s1", name: "Vada Pav", description: "Spicy potato fritter stuffed in a soft bread bun.", price: 40, category: "Snacks & Sandwiches", imageUrl: "/menu-items/vada-pav.jpg", isAvailable: true, isPopular: true, isVeg: true, tags: ["Trending"] },
  { id: "s2", name: "Veg Burger", description: "Classic burger with a crispy vegetable patty.", price: 45, category: "Snacks & Sandwiches", imageUrl: "/menu-items/veg-burger.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "s3", name: "Veg Cheese Burger", description: "Crispy veg patty burger topped with a mature cheese slice.", price: 55, category: "Snacks & Sandwiches", imageUrl: "/menu-items/veg-cheese-burger.jpg", isAvailable: true, isPopular: true, isVeg: true },
  { id: "s4", name: "Grilled Sandwich", description: "Toasted sandwich filled with fresh chopped vegetables.", price: 60, category: "Snacks & Sandwiches", imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600", isAvailable: true, isPopular: false, isVeg: true },
  { id: "s5", name: "Grilled Cheese Sandwich", description: "Toasted veg sandwich loaded with melted cheese.", price: 70, category: "Snacks & Sandwiches", imageUrl: "/menu-items/grilled-cheese-sand.jpg", isAvailable: true, isPopular: true, isVeg: true },
  { id: "s6", name: "Mexican Sandwich", description: "Spicy Mexican style beans and salsa sandwiched in fresh bread.", price: 60, category: "Snacks & Sandwiches", imageUrl: "/menu-items/mexican-sand.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "s7", name: "Punjabi Sandwich", description: "Robust Punjabi spiced fillings inside a toasted sandwich.", price: 70, category: "Snacks & Sandwiches", imageUrl: "/menu-items/punjabi-sand.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "s8", name: "Cheese Corn Sandwich", description: "Creamy sweet corn and melted cheese filling.", price: 60, category: "Snacks & Sandwiches", imageUrl: "/menu-items/cheese-corn-sand.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "s9", name: "Cheese Chutney Sandwich", description: "Zesty green chutney paired with cool cheese slices.", price: 60, category: "Snacks & Sandwiches", imageUrl: "/menu-items/cheese-chutney-sand.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "s10", name: "Paneer Tikka Sandwich", description: "Smoky paneer tikka pieces grilled in jumbo bread.", price: 70, category: "Snacks & Sandwiches", imageUrl: "/menu-items/paneer-tikka-sandwich.jpg", isAvailable: true, isPopular: true, isVeg: true, tags: ["Must Try"] },
  { id: "s11", name: "Hot Dog", description: "Classic vegetarian hot dog with mustard and ketchup.", price: 40, category: "Snacks & Sandwiches", imageUrl: "/menu-items/hot-dog.jpg", isAvailable: false, isPopular: false, isVeg: true },
  { id: "s12", name: "Paneer Kulcha", description: "Soft Indian bread roasted and stuffed with spiced cottage cheese.", price: 50, category: "Snacks & Sandwiches", imageUrl: "/menu-items/paneer-kulcha.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "s13", name: "Pav Bhaji", description: "Thick vegetable curry accompanied by soft buttered bread rolls.", price: 50, category: "Snacks & Sandwiches", imageUrl: "/menu-items/pav-bhaji.jpg", isAvailable: true, isPopular: true, isVeg: true },
  { id: "s14", name: "Chole Kulche (2 pcs)", description: "Spicy chickpea curry served with two fluffy kulchas.", price: 50, category: "Snacks & Sandwiches", imageUrl: "/menu-items/chole-kulche.jpg", isAvailable: true, isPopular: true, isVeg: true },
  { id: "s15", name: "Samosa Chaat", description: "Crushed samosas topped with yogurt, chutneys, and spices.", price: 40, category: "Snacks & Sandwiches", imageUrl: "/menu-items/samosa-chaat.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "s16", name: "Aloo Tikki Chaat", description: "Fried potato patties draped in sweet and spicy sauces.", price: 40, category: "Snacks & Sandwiches", imageUrl: "/menu-items/aloo-tikki-chaat.jpg", isAvailable: true, isPopular: true, isVeg: true },
  { id: "s17", name: "Spring Roll", description: "Crispy fried rolls packed with savory vegetable mix.", price: 50, category: "Snacks & Sandwiches", imageUrl: "/menu-items/spring-roll.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "s18", name: "Veg Momos (5 pcs)", description: "Steamed dumplings stuffed with finely minced vegetables.", price: 50, category: "Snacks & Sandwiches", imageUrl: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?q=80&w=600", isAvailable: true, isPopular: true, isVeg: true },
  { id: "s19", name: "Fried Momos (5 pcs)", description: "Crispy deep-fried variations of our classic veg momos.", price: 60, category: "Snacks & Sandwiches", imageUrl: "/menu-items/fried-momos.jpg", isAvailable: true, isPopular: true, isVeg: true },
  { id: "s20", name: "Smiley", description: "Joyful potato smiles deep-fried to golden perfection.", price: 50, category: "Snacks & Sandwiches", imageUrl: "/menu-items/potato-smiley.png", isAvailable: true, isPopular: false, isVeg: true },

  // Finger Foods & Noodles
  { id: "f1", name: "French Fries", description: "Classic salted crispy potato sticks.", price: 60, category: "Finger Foods & Noodles", imageUrl: "/menu-items/fries.jpg", isAvailable: true, isPopular: true, isVeg: true },
  { id: "f2", name: "Peri Peri Fries", description: "Crispy fries tossed in fiery Peri Peri seasoning.", price: 70, category: "Finger Foods & Noodles", imageUrl: "/menu-items/peri-peri-fries.jpg", isAvailable: true, isPopular: true, isVeg: true, tags: ["Hot"] },
  { id: "f3", name: "Onion Rings (6 pcs)", description: "Crunchy battered onion rings served with dip.", price: 60, category: "Finger Foods & Noodles", imageUrl: "https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=600", isAvailable: true, isPopular: false, isVeg: true },
  { id: "f4", name: "Veggie Finger (5 pcs)", description: "Crumbed and fried vegetable sticks packed with flavor.", price: 60, category: "Finger Foods & Noodles", imageUrl: "/menu-items/veggie-finger.png", isAvailable: true, isPopular: false, isVeg: true },
  { id: "f5", name: "V-Crispers (8-10 pcs)", description: "Unique V-cut potato crisps, perfectly seasoned.", price: 60, category: "Finger Foods & Noodles", imageUrl: "/menu-items/v-crispers.jpg", isAvailable: false, isPopular: false, isVeg: true },
  { id: "f6", name: "Popcorn Fries", description: "Bite-sized potato pops tossed in secret spices.", price: 60, category: "Finger Foods & Noodles", imageUrl: "/menu-items/popcorn-fries.jpg", isAvailable: true, isPopular: true, isVeg: true },

  // Pizza
  { id: "p1", name: "OTC Pizza", description: "Onion, Tomato, and Capsicum regular sized pizza.", price: 110, category: "Pizza", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600", isAvailable: true, isPopular: true, isVeg: true },
  { id: "p2", name: "Pizza Margherita", description: "Classic cheese and robust tomato sauce pie.", price: 110, category: "Pizza", imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600", isAvailable: true, isPopular: false, isVeg: true },
  { id: "p3", name: "Cheese N Corn Pizza", description: "Gooey mozzarella cheese perfectly paired with sweet corn.", price: 110, category: "Pizza", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600", isAvailable: true, isPopular: false, isVeg: true },
  { id: "p4", name: "Paneer Pizza", description: "Loaded with fresh paneer chunks and vibrant veggies.", price: 120, category: "Pizza", imageUrl: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=600", isAvailable: true, isPopular: true, isVeg: true, tags: ["Special"] },

  // South Indian
  { id: "si1", name: "Masala Dosa", description: "Thin, crisp rice crepe filled with spicy potato mash.", price: 75, category: "South Indian", imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=600", isAvailable: true, isPopular: true, isVeg: true, tags: ["Bestseller"] },
  { id: "si2", name: "Veg Uttapam", description: "Thick savory pancake topped with finely chopped vegetables.", price: 70, category: "South Indian", imageUrl: "/menu-items/veg-uttapam.jpg", isAvailable: true, isPopular: false, isVeg: true },

  // Mini Meals & Rice
  { id: "m1", name: "Fried Rice", description: "Wok tossed classic vegetable fried rice.", price: 60, category: "Mini Meals & Rice", imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600", isAvailable: true, isPopular: true, isVeg: true },
  { id: "m2", name: "Manchurian", description: "Vegetable dumplings coated in a dark, spicy soy sauce.", price: 50, category: "Mini Meals & Rice", imageUrl: "/menu-items/manchurian.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "m3", name: "Rajma Rice", description: "Comforting kidney bean curry served piping hot over rice.", price: 70, category: "Mini Meals & Rice", imageUrl: "/menu-items/rajma-rice.jpg", isAvailable: true, isPopular: true, isVeg: true },
  { id: "m4", name: "Chole Rice", description: "Hearty chickpea masala beautifully paired with streamed rice.", price: 70, category: "Mini Meals & Rice", imageUrl: "/menu-items/chole-rice.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "m5", name: "Fried Rice + Manchurian", description: "Perfect combo of wok tossed rice and savory manchurian.", price: 70, category: "Mini Meals & Rice", imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600", isAvailable: true, isPopular: true, isVeg: true, tags: ["Combo"] },
  { id: "m6", name: "Mini Thali (Daal)", description: "Chapati (4 pcs) + Daal + Raita + Pickle.", price: 70, category: "Mini Meals & Rice", imageUrl: "/menu-items/mini-thali-daal.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "m7", name: "Mini Thali (Dry Veg)", description: "Chapati (4 pcs) + Dry Vegetable + Raita.", price: 80, category: "Mini Meals & Rice", imageUrl: "/menu-items/mini-thali-dry-veg.jpg", isAvailable: true, isPopular: true, isVeg: true },
  { id: "m8", name: "Mini Thali (Paneer Veg)", description: "Chapati (4 pcs) + Premium Paneer Curry + Raita.", price: 90, category: "Mini Meals & Rice", imageUrl: "/menu-items/mini-thali-paneer.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "m9", name: "Deluxe Thali", description: "Chapati (4 pcs) + Daal + Paneer Curry + Raita.", price: 110, category: "Mini Meals & Rice", imageUrl: "/menu-items/deluxe-thali.jpg", isAvailable: true, isPopular: true, isVeg: true, tags: ["Special"] },

  // Desserts & Bakery
  { id: "d1", name: "Cream Roll", description: "Crispy horn pastry piped with sweet rich cream.", price: 20, category: "Desserts & Bakery", imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=600", isAvailable: true, isPopular: false, isVeg: true },
  { id: "d2", name: "Ramball", description: "Dense chocolate delicacy infused with rich syrup.", price: 40, category: "Desserts & Bakery", imageUrl: "/menu-items/ramball.jpg", isAvailable: true, isPopular: false, isVeg: true },
  { id: "d3", name: "Choco Lava Cake", description: "Warm chocolate cake harboring a molten fudge center.", price: 45, category: "Desserts & Bakery", imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600", isAvailable: true, isPopular: true, isVeg: true, tags: ["Bestseller"] },
  { id: "d4", name: "Muffins", description: "Freshly baked soft, fluffy morning muffins.", price: 30, category: "Desserts & Bakery", imageUrl: "https://images.unsplash.com/photo-1558401391-7899b4bd5bbf?q=80&w=600", isAvailable: true, isPopular: false, isVeg: true },
  { id: "d5", name: "Ring Doughnut", description: "Classic glazed ring doughnut baked to perfection.", price: 40, category: "Desserts & Bakery", imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600", isAvailable: true, isPopular: true, isVeg: true },
  { id: "d6", name: "Choc. Brownie Almond", description: "Fudgy brownie studded with crunchy roasted almonds.", price: 45, category: "Desserts & Bakery", imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=600", isAvailable: true, isPopular: true, isVeg: true },
  { id: "d7", name: "Choc. Truffle Pastry", description: "Decadent slice of intense chocolate truffle cake.", price: 60, category: "Desserts & Bakery", imageUrl: "/menu-items/choc-truffle-pastry.jpg", isAvailable: true, isPopular: true, isVeg: true },
  { id: "d8", name: "Pastry", description: "Traditional sweet pastry layered with fresh cream.", price: 50, category: "Desserts & Bakery", imageUrl: "https://images.unsplash.com/photo-1557925923-33b251d5928f?q=80&w=600", isAvailable: true, isPopular: false, isVeg: true },
  { id: "d9", name: "Cheese Cake Pastry", description: "Premium velvety baked cheesecake slice.", price: 130, category: "Desserts & Bakery", imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600", isAvailable: true, isPopular: true, isVeg: true, tags: ["Special"] }
];

export const mockOrders: Order[] = [];
