INSERT INTO supplier (name, contact_email, phone) VALUES 
('Apple Inc', 'support@apple.com', '+1-800-MY-APPLE'),
('Samsung Electronics', 'b2b@samsung.com', '+1-800-SAMSUNG'),
('Sony Corporation', 'wholesale@sony.com', '+1-800-222-SONY'),
('IKEA Group', 'commercial@ikea.com', '+46-775-700-500'),
('Penguin Random House', 'sales@penguin.com', '+1-800-733-3000'),
('Nike Inc', 'info@nike.com', '+1-800-806-6453');

INSERT INTO product (name, description, price, category, image_url, supplier_id) VALUES 
('Smart WiFi Router Pro', 'Next-generation router equipped with Wi-Fi 6 technology for blazing fast, seamless connectivity across your entire home.', 199.99, 'Electronics', 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800', 2),
('4K Action Camera', 'Capture all your adventures in stunning 4K detail. Completely waterproof and features advanced hyper-smooth stabilization.', 349.50, 'Electronics', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800', 3),

('Scandinavian Velvet Sofa', 'Luxurious minimalism. Our premium velvet sofa brings European aesthetics and unbelievable comfort to your living space.', 1250.00, 'Furniture', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 4),
('Ergonomic Office Chair', 'Breathable mesh back and fully adjustable lumbar support perfect for long hours of productive work.', 289.99, 'Furniture', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800', 4),

('Ceramic Minimalist Vase', 'Hand-crafted matte ceramic vase. Specifically designed to highlight your floral arrangements without overpowering them.', 45.00, 'Home', 'https://th.bing.com/th/id/OIP.W_Vu-NdEG711Bcj1YiCrOgHaHa?w=209&h=209&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 4),
('Aromatherapy Diffuser', 'Sleek wood-grain diffuser combined with LED lighting modes, creating a relaxing spa-like environment at home.', 55.20, 'Home', 'https://th.bing.com/th/id/OIP.LfSm4x-KuapW9cHruV8lnAHaHa?w=188&h=188&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 4),

('Classic Denim Jacket', 'Rugged, timeless, and versatile. Made from organic heavy-weight cotton to withstand the test of time.', 85.00, 'Clothing', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800', 6),
('Cotton Premium T-Shirt', 'The perfect blank canvas. Ridiculously soft, mid-weight cotton that perfectly drapes and retains its shape wash after wash.', 35.00, 'Clothing', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 6),

('The Design Everyday Things', 'A cognitive scientist details how design serves as the communication between object and user. A must read.', 19.99, 'Books', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800', 5),
('Clean Code Handbook', 'The modern bible for software developers looking to turn bad code into beautifully maintainable masterpieces.', 49.50, 'Books', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800', 5),

('Leather Bi-Fold Wallet', 'Genuine full-grain leather wallet featuring 6 card stots, RFID protection, and a sleek modern profile.', 65.00, 'Accessories', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800', 6),
('Polarized Sunglasses', 'UV400 protection wrapped in a classic retro acetate frame. Lightweight and incredibly highly durable.', 120.00, 'Accessories', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', 6),

('Aura X Premium 256GB', 'A stunning smartphone crafted with aerospace-grade aluminum, edge-to-edge OLED display, and incredible battery life.', 999.00, 'Smartphones', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', 1),
('Nova Foldable Mobile', 'Experience the future with a seamless folding glass display, allowing you to multi-task like never before on the go.', 1499.00, 'Smartphones', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800', 2),

('Wireless Over-Ear Headphones', 'Industry-leading noise cancellation combined with high-res audio drivers provides an unparalleled listening experience.', 299.00, 'Audio', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 3),
('Studio Monitor IEMs', 'Precision-crafted in-ear monitors delivering flat frequency response tailored precisely for mixing engineers and audiophiles.', 149.00, 'Audio', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', 3),

('Fitness Tracker Pro', 'Monitor your heart rate, sleep cycles, and daily steps. Fully waterproof and features an impressive 14-day battery.', 79.99, 'Wearables', 'https://th.bing.com/th/id/OIP.o4iIPD5xL0DppS7e7-8WrQHaHa?w=168&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 2),
('Titanium Smart Watch', 'A premium wearable that blends classic chronometer aesthetics with modern LTE smart functionalities.', 399.00, 'Wearables', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 1),

('ZenBook Pro 15', 'Extremely lightweight ultrabook packing a serious punch with a dedicated GPU and a stunning 4K OLED screen.', 1899.00, 'Computers', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', 2),
('Creator Mini Desktop', 'A compact powerhouse optimized for rendering, 3D workloads, and extreme multitasking without taking up desk space.', 1250.00, 'Computers', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800', 2),

('Mirrorless Hybrid Camera', 'Capture breathtaking 24MP photographs and cinematic 10-bit video in a compact weather-sealed body.', 1599.00, 'Photography', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800', 3),
('50mm Prime Lens F1.4', 'The perfect nifty fifty. Renowned for incredible background blurring, massive light gathering, and edge-to-edge sharpness.', 550.00, 'Photography', 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=800', 3),

('Mechanical Gaming Keyboard', 'Featuring tactile clicky switches, aircraft-grade aluminum frame, and customizable per-key RGB backlighting.', 129.99, 'Gaming', 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800', 3),
('Wireless Console Controller', 'Haptic feedback and adaptive triggers put you right in the middle of your game. Includes long-lasting rechargeable battery.', 69.99, 'Gaming', 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800', 3),

('65-Inch OLED 4K TV', 'Unmatched contrast ratios with perfect blacks and extremely vivid colors, equipped with smart TV operating system.', 2100.00, 'TV & Video', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800', 3),
('Portable LED Projector', 'Easily cast a 120-inch screen on any wall. Designed for outdoor movies, camping trips, and indoor entertainment.', 349.00, 'TV & Video', 'https://th.bing.com/th/id/OIP.LEsj5FQfgkCR_jm5H7qCUQHaF1?w=230&h=182&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 2),

('Bluetooth Portable Speaker', 'Fills the room with rich 360-degree sound. Rugged exterior allows you to take your music absolutely anywhere.', 119.00, 'Speakers', 'https://th.bing.com/th/id/OIP.sJhOvSGxp1Fv_5VTX_ZYgAHaDt?w=258&h=150&c=6&o=7&dpr=1.3&pid=1.7&rm=3', 3),
('Home Theater Soundbar', 'A massive audio upgrade to any TV. Includes wireless subwoofer for deep, rumbling low frequencies during action scenes.', 450.00, 'Speakers', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800', 3),

('Stylus 11-inch Pad', 'Digital canvas engineered for artists. Ultra-responsive screen paired with an active magnetic stylus pen.', 599.00, 'Tablets', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', 1),
('E-Ink Reader Pro', 'Read absolutely glare-free even in direct sunlight. Includes warm-light adjustments and a massive 32GB library storage.', 149.00, 'Tablets', 'https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=800', 2);