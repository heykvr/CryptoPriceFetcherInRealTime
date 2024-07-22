# Crypto Price Tracker

This project is a real-time cryptocurrency price tracker

## Prerequisites

- Node.js (v14 or later)
- npm
- MongoDB Atlas account

## Backend Setup

1. Navigate to the backend directory
2. Install dependencies:
   ### npm install
3. Start the backend server:
   ### npm run dev
The server will start on http://localhost:5000

## API Endpoints

- GET `/api/prices`: Fetch the latest prices for all tracked cryptocurrencies
- GET `/api/prices/:crypto`: Fetch the 20 most recent price entries for a specific cryptocurrency


## Frontend Setup

1. Navigate to the frontend directory
2. Install dependencies:
   ### npm install
3. Start the frontend development server:
   ### npm run dev
The frontend will be available at http://localhost:8080

## Usage

1. Open your browser and go to http://localhost:8080
2. You should see the crypto price tracker interface
3. The prices will update in real-time every few seconds

Technologies Used

- Backend:
- Express.js
- MongoDB
- TypeScript

- Frontend:
- Next.js
- React
- TypeScript
- Redux for state management

## Troubleshooting

If you encounter any issues:
1. Ensure all dependencies are installed
2. Check that MongoDB Atlas is properly configured and accessible
3. Verify that the backend server is running and accessible from the frontend
4. Check the console for any error messages
