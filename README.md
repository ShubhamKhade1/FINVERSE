# FINVERSE - AI-Driven Personal Finance Platform

## Overview
FINVERSE is a complete, AI-driven personal finance application featuring a FastAPI backend, a pure SQLite database (utilizing WAL mode and JSON1 extension), and a static HTML/JS frontend. It incorporates multiple machine learning modules for financial intelligence and an AI financial copilot.

## Key Features
*   **Zero-Config Architecture**: Employs a single-file SQLite database (`finverse.db`) without the need for external database servers like PostgreSQL or MySQL.
*   **Security & Authentication**: JWT-based OAuth2 authentication.
*   **Financial Intelligence ML Modules**:
    *   **Financial News Sentiment**: NLP sentiment analysis (FinBERT) on financial news.
    *   **Behavioral Credit Scoring**: XGBoost regression model with SHAP explainability.
    *   **Fraud Detection**: Real-time anomaly detection using Isolation Forest.
    *   **Spending Forecasting**: Time-series forecasting (LSTM) for future spending predictions.
    *   **Smart Investment Suggestions**: Rule-based & clustering engine using K-Means.
*   **AI Financial Copilot**: A RAG-Lite system that provides intelligent financial answers based on user transaction history, credit scores, and forecasts while maintaining strict privacy (no raw PII sent to LLM).

## Tech Stack
*   **Backend**: Python, FastAPI
*   **Database**: SQLite (WAL mode, JSON1 extension)
*   **Machine Learning**: Transformers (Hugging Face), XGBoost, scikit-learn, TensorFlow/Keras
*   **Frontend**: Static HTML, Vanilla JavaScript, Chart.js

## Project Structure
```text
.
├── app/
│   ├── api/          # FastAPI Endpoints
│   ├── core/         # Configuration & Security
│   ├── models.py     # Database Models
│   ├── database.py   # DB Connection & Setup
│   ├── services/     # Business Logic 
│   └── ml/           # Model Files & ML Pipelines
├── init_db.py        # Database Initialization Script
└── main.js           # Frontend Logic
```

## Setup & Run Local Development

### 1. Prerequisites
Ensure you have Python 3.9+ installed.

### 2. Installation
Clone the repository and install the backend dependencies:
```bash
git clone <repository-url>
cd eve

# Create and activate a virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install required packages
pip install fastapi uvicorn sqlalchemy passlib python-jose pydantic transformers xgboost scikit-learn tensorflow
```

### 3. Initialize Database
Create the `finverse.db` SQLite database and required tables:
```bash
python init_db.py
```

### 4. Run the Application
Start the FastAPI server (assuming your main FastAPI instance is in `app/main.py`):
```bash
uvicorn app.main:app --reload
```
The API documentation will be available at `http://127.0.0.1:8000/docs`.
