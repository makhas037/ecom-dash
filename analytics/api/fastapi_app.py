from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml_simple import (
    load_data, 
    simple_forecast, 
    simple_churn, 
    simple_segments, 
    simple_demand, 
    simple_anomalies
)

# Create FastAPI app
app = FastAPI(
    title="FiberOps ML API",
    description="Machine Learning endpoints for sales forecasting, churn prediction, segmentation, demand prediction, and anomaly detection",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data once at startup
print("Loading Kaggle data...")
data = load_data()
if data:
    print(f"✅ Data loaded: {data['metadata']['total_sales']} transactions")
else:
    print("⚠️ No data loaded - ML endpoints will return errors")

@app.get("/")
def root():
    """Root endpoint - API status"""
    return {
        "message": "FiberOps ML API",
        "status": "active",
        "data_loaded": data is not None,
        "version": "1.0.0",
        "endpoints": {
            "forecast": "/ml/forecast",
            "churn": "/ml/churn",
            "segments": "/ml/segments",
            "demand": "/ml/demand",
            "anomalies": "/ml/anomalies"
        },
        "docs": "/docs"
    }

@app.get("/ml/forecast")
def get_forecast():
    """
    Sales Forecasting using ARIMA
    Returns 28-day revenue forecast
    """
    result = simple_forecast(data)
    return {
        **result,
        "endpoint": "/ml/forecast",
        "description": "ARIMA(5,1,2) sales forecasting model"
    }

@app.get("/ml/churn")
def get_churn():
    """
    Customer Churn Prediction using Logistic Regression
    Identifies at-risk customers based on RFM analysis
    """
    result = simple_churn(data)
    return {
        **result,
        "endpoint": "/ml/churn",
        "description": "Logistic Regression churn prediction with RFM features"
    }

@app.get("/ml/segments")
def get_segments():
    """
    Customer Segmentation using K-means
    Groups customers into Champions, Loyal, At-Risk, Lost
    """
    result = simple_segments(data)
    return {
        **result,
        "endpoint": "/ml/segments",
        "description": "K-means clustering with 4 customer segments"
    }

@app.get("/ml/demand")
def get_demand():
    """
    Demand Prediction using XGBoost
    Forecasts product demand for inventory optimization
    """
    result = simple_demand(data)
    return {
        **result,
        "endpoint": "/ml/demand",
        "description": "XGBoost regression for demand forecasting"
    }

@app.get("/ml/anomalies")
def get_anomalies():
    """
    Anomaly Detection using Isolation Forest
    Detects unusual transactions and potential fraud
    """
    result = simple_anomalies(data)
    return {
        **result,
        "endpoint": "/ml/anomalies",
        "description": "Isolation Forest for anomaly detection"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "data_loaded": data is not None,
        "transactions": data['metadata']['total_sales'] if data else 0
    }

# Run server
if __name__ == "__main__":
    import uvicorn
    print("\n🚀 Starting FiberOps ML API on port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001)
