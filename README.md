# Aura E-Commerce Platform

Aura is a modern, responsive, full-stack e-commerce web application meticulously designed with a Glassmorphism aesthetic featuring a comprehensive Admin Dashboard with strict Tiered Role-Based Access Control, dedicated supplier integrations, secure checkout flows, dynamic product evaluations, and a built-in dark/light mode toggle.

## Core Features
* **Full-Stack Authentication**: Secure user registration, robust login logic, and a full 6-digit email verification flow.
* **Tiered User Management**: Complete CRUD governance allowing Super Admins to instantly modify user roles, delete accounts, and manage platform access.
* **Automated Email Notifications**: Deep JavaMailSender integration automatically firing personalized welcome emails, order status changes, new product alerts, and admin notifications via SMTP.
* **Interactive Product Ratings**: Embedded 1-5 Star interactive module mapping subjective reviews entirely to persistent Spring Boot data stores.
* **Dynamic Category Management**: Powerful CRUD environment enabling administrators to infinitely govern overarching site categories natively.
* **Complete Order Governance**: Direct interaction allowing administrative-level order cancellations and real-time status updates instantly rippling across unified UI structures.
* **Robust Theme Toggle**: Switch instantly between beautifully optimized Light Mode and Dark Mode parameters.

## Tech Stack
* **Frontend**: React, Vite, React Router DOM, Context API, Lucide React (Icons), Native CSS (`var(...)` CSS Theming).
* **Backend**: Spring Boot, Spring Data JPA, JavaMailSender, Jackson, Maven.
* **Persistence Layer**: MySQL (via XAMPP) natively handling relational data with `@Entity` ORM schema definitions and automated JDBC updates.

## Setup & Run Instructions

### 1. Requirements
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (latest LTS)
- [Java Development Kit (JDK) 17+](https://adoptium.net/)
- [XAMPP](https://www.apachefriends.org/) (for local MySQL database)

### 2. Database Setup
1. Open XAMPP and start the **MySQL** module.
2. The Spring Boot application is configured to automatically create the `ecommercedb` database and its tables on startup if they don't exist.
3. Ensure you have your `application.properties` updated with a valid Gmail App Password to enable the email system.

### 2. Run the Backend (Spring Boot)
Open a terminal in the `backend/` directory and execute the Maven wrapper:
```bash
cd backend
./mvnw spring-boot:run
```
The backend REST API will power on at `http://localhost:8080`.

### 3. Run the Frontend (React + Vite)
Open a separate terminal in the `frontend/` directory, install packages, and boot the dev server:
```bash
cd frontend
npm install
npm run dev
```
The frontend interface will deploy locally at usually `http://localhost:5173`. 

## Architecture Map
- `/frontend/src/pages/AdminDashboard.jsx`: Absolute unified view encapsulating products, categories, and order logic contexts in independent toggled tabs.
- `/backend/src/main/java/com/ecommerce/model/Review.java`: High-volume payload storage controller preventing 500 error boundaries through `@Column(length=2048)` limit expansions on media definitions.
- `/frontend/src/pages/ProductDetails.jsx`: Dedicated product interaction route explicitly rendering specific analytical responses matched to its respective ID parameters over REST `GET` and `POST` maps.
