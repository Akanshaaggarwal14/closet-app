# Styloé 👗✨

*Your intelligent wardrobe companion*

A modern digital wardrobe assistant that helps users organize their clothes, plan outfits, and make smarter styling decisions based on their wardrobe, occasions, and weather.

Styloé transforms a physical wardrobe into a personalized digital closet where users can manage clothing items, create outfits, schedule looks, and prepare for different situations effortlessly.

---

# Overview

People often own many clothes but still struggle with:

* Deciding what to wear every day
* Remembering what exists in their wardrobe
* Planning outfits for events
* Choosing clothes according to weather
* Organizing their clothing collection

Styloé solves this by creating a digital version of the user's wardrobe and providing tools to organize, plan, and style outfits.

---

# Features

## 👚 Digital Closet

Manage your complete wardrobe digitally.

Features:

* Add clothing items
* Edit clothing details
* Delete clothing items
* Mark favorite items
* Search wardrobe
* Filter by category
* Filter by occasion
* Browse all clothing items in a visual grid

---

## 🏷 Clothing Organization

Each clothing item can be organized using:

### Categories

* Tops
* Bottoms
* Dresses
* Shoes
* Accessories

### Occasions

* Casual
* Outgoing
* Formal
* Party
* Sports

This structure allows smarter filtering and future AI-powered recommendations.

---

## 👗 Outfit Studio

Create complete outfits manually using your own wardrobe.

Features:

* Combine multiple clothing items
* Save outfit combinations
* Edit outfits
* Delete outfits
* Reuse saved looks

The goal is to help users build outfits intentionally instead of searching through their wardrobe repeatedly.

---

## 📅 Outfit Calendar Planner

Plan outfits ahead of time.

Features:

* Monthly calendar view
* Assign outfits to specific dates
* View upcoming planned outfits
* Modify scheduled looks

Useful for:

* Events
* Work outfits
* Travel planning
* Special occasions

---

## 🌦 Weather-Based Wardrobe

Styloé uses weather information to make wardrobe browsing more relevant.

Technology:

* Browser Geolocation API
* Open-Meteo Weather API
* Reverse geocoding for location detection

The application:

* Detects current weather
* Determines suitable seasonal clothing
* Filters wardrobe items accordingly

Users can still access their complete wardrobe whenever needed.

---

## 📊 Dashboard

A personalized home screen showing:

* User greeting
* Current weather
* Total wardrobe items
* Today's planned outfit
* Upcoming outfits
* Quick actions

Designed to give users a quick overview of their wardrobe activity.

---

## 📸 Smart Wardrobe Import *(In Development)*

The goal of this feature is to make adding clothes faster.

Current direction:

* Upload clothing images
* Automatically remove backgrounds
* Preview processed clothing items
* Edit details before saving
* Add items directly to the digital closet

Future improvements:

* Automatic clothing detection
* AI categorization
* Advanced wardrobe scanning

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

## Backend & Database

* Supabase
* PostgreSQL
* Supabase Storage
* Supabase Authentication

## APIs & Services

* Open-Meteo Weather API
* Browser Geolocation API
* BigDataCloud Reverse Geocoding

## Development Tools

* Git
* GitHub
* VS Code

---

# Architecture

```text
                 User

                  │

                  ▼

          Next.js Application

                  │

        ┌─────────┴─────────┐

        ▼                   ▼

   Supabase             External Services

(Database + Auth)          │

                           ├── Open-Meteo Weather

                           └── Location Services
```

---

# Project Structure

```text
closet-app/

├── src/
│
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│
├── supabase/
│
├── ai-service/
│
├── package.json
│
└── README.md
```

---

# Development Roadmap

## Completed ✅

* Authentication system
* Digital Closet
* Clothing management
* Clothing categories
* Occasion organization
* Outfit Studio
* Calendar outfit planning
* Dashboard
* Weather-based wardrobe filtering

## In Progress 🚧

* Smart Wardrobe Import
* Improved clothing image processing

## Future Vision 🔮

* AI outfit recommendations
* Personal style analysis
* Clothing similarity search
* Automatic wardrobe organization
* Virtual try-on
* Travel packing assistant
* Smart shopping recommendations

---

# Why This Project?

Styloé explores the intersection of:

* Artificial Intelligence
* Fashion Technology
* Personal Productivity
* Computer Vision

The goal is to build an intelligent wardrobe assistant that understands a user's clothing collection and helps them make better outfit decisions.

---

# Running Locally

## Frontend Setup

Clone the repository:

```bash
git clone https://github.com/Akanshaaggarwal14/closet-app.git
```

Navigate into the project:

```bash
cd closet-app
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

# Future Goal

Styloé aims to become a personal AI fashion assistant that understands:

* User wardrobe
* Weather
* Occasions
* Personal style preferences

and helps users decide not only what they own, but what they should wear.

---

# License

This project is currently developed as a personal portfolio project.