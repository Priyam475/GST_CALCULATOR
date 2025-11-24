# Charny - Customer Churn Prediction

Charny is a full-stack web application designed to predict customer churn rates using a Machine Learning model. It allows users to input customer data and receive a churn probability percentage.

## Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS
*   **Backend**: Flask (Python)
*   **Machine Learning**: Scikit-learn, Pandas, NumPy

## Prerequisites

Ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v14 or higher)
*   [Python](https://www.python.org/) (v3.8 or higher)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd charny
```

### 2. Backend Setup
Navigate to the server directory and install Python dependencies:
```bash
cd server
pip install -r requirements.txt
```

### 3. Frontend Setup
Navigate to the client directory and install Node.js dependencies:
```bash
cd client
npm install
```

## Usage

You can start the application using the provided batch script or by running the backend and frontend manually.

### Option 1: Using the Start Script (Windows)
Double-click `start_app.bat` in the root directory, or run it from the command line:
```cmd
start_app.bat
```

### Option 2: Manual Start

**Start the Backend:**
```bash
cd server
python app.py
```
The backend will run on `http://127.0.0.1:5000`.

**Start the Frontend:**
```bash
cd client
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Project Structure

*   `client/`: React frontend application.
*   `server/`: Flask backend and ML model files (`model.pkl`, `scaler.pkl`).
*   `start_app.bat`: Script to start both backend and frontend.
