# Aura E-Commerce Platform

Aura is a modern, full-stack e-commerce web application featuring dynamic category management, real-time cart functionality, secure checkout flows, and a comprehensive Admin Dashboard. Designed with a sleek, responsive aesthetic and a built-in dark/light mode toggle.

## Tech Stack
* **Frontend**: React, Vite, React Router, Context API, Lucide React (Icons), Custom CSS Variables for Theming.
* **Backend**: Spring Boot, Spring Data JPA, H2 Database (In-Memory), Maven.
* **Tooling**: Node.js, npm, Java.

## Features
* **Dynamic Cart System**: Persistent shopping cart mapped with immediate price calculation.
* **Robust Theme Toggle**: Switch instantly between carefully designed Light Mode and Dark Mode.
* **Integrated Admin Dashboard**: 
  * Add, View, Edit, and Delete Products seamlessly.
  * Dedicated Category Management (fully interactive CRUD module).
  * Direct Order Management with instant cancellation integration.
* **Responsive Layout**: Designed specifically for fluid navigation across Desktop, Tablet, and Mobile displays.

## Setup & Run Instructions

### 1. Requirements
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (latest LTS)
- [Java Development Kit (JDK) 17+](https://adoptium.net/)

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

## Built For
This project was refactored and built to emulate absolute structural perfection across full-stack modern environments, demonstrating precise DOM manipulation alongside Spring Boot Data persistence.
