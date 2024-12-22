# LocalMart

## Quick Commerce for Fresh Produce and Dairy

![LocalMart Logo](/public/images/localmart-logo.png)

LocalMart is an innovative web application that bridges the gap between local vegetable, fruit, and dairy shops and customers within a 500-meter radius. Our platform facilitates quick, on-demand delivery of fresh produce and dairy products, enhancing convenience for consumers while supporting local businesses.

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [For Customers](#for-customers)
  - [For Vendors](#for-vendors)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Hyperlocal Connectivity**: Connects customers with shops within a 500-meter radius.
- **Real-time Inventory**: Live updates of product availability from local shops.
- **Quick Delivery**: Facilitates rapid delivery from shop to customer.
- **User-friendly Interface**: Intuitive design using shadcn UI components for both customers and vendors.
- **Multi-vendor Support**: Allows multiple local shops to list their products.
- **Secure Payments**: Integrated payment gateway for safe transactions.
- **Order Tracking**: Real-time updates on order status.
- **Rating System**: Allows customers to rate products and delivery experience.
- **Responsive Design**: Fully responsive web application that works seamlessly on desktop and mobile devices.

## How It Works

1. **Customer Sign-up**: Users create an account and set their delivery address.
2. **Shop Discovery**: The app shows available shops within a 500-meter radius.
3. **Product Browsing**: Customers can view products, prices, and availability in real-time.
4. **Ordering**: Users select products, choose delivery time, and place orders.
5. **Shop Notification**: Vendors receive order notifications instantly.
6. **Quick Delivery**: Shop prepares the order and delivers it to the customer.
7. **Payment & Rating**: Customers pay through the app and can rate their experience.

## Technology Stack

- **Frontend**:
  - React.js: A JavaScript library for building user interfaces
  - shadcn UI: A collection of re-usable components built with Radix UI and Tailwind CSS
  - Tailwind CSS: A utility-first CSS framework for rapid UI development
  - Lucide React: A library of crisp, pixel-perfect icons

- **Backend**:
  - Spring Boot: An open-source Java-based framework for building robust backend services
  - Spring Data JPA: Simplifies data access layer implementation
  - Spring Security: Provides authentication and authorization

- **Database**: PostgreSQL

- **Authentication**: JWT (JSON Web Tokens)

- **Maps & Geolocation**: Google Maps API

- **Payment Integration**: Stripe

- **Real-time Updates**: WebSocket with STOMP protocol

- **Build Tool**: Maven

- **Hosting**:
  - Frontend: Vercel
  - Backend: Heroku

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Java Development Kit (JDK) 11 or later
- Maven
- PostgreSQL
- Google Maps API key
- Stripe account for payments

### Installation

1. Clone the repository:
