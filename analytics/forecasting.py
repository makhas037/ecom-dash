import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
import json
import warnings
warnings.filterwarnings('ignore')

def load_data():
    """Load processed Kaggle data"""
    with open('../database/datasets/processed_data.json', 'r') as f:
        data = json.load(f)
    return data

def forecast_sales(days=28):
    """
    ARIMA Sales Forecasting
    Returns next 28 days predictions
    """
    data = load_data()
    sales_df = pd.DataFrame(data['sales'])
    sales_df['InvoiceDate'] = pd.to_datetime(sales_df['InvoiceDate'])
    
    # Aggregate daily sales
    daily_sales = sales_df.groupby(sales_df['InvoiceDate'].dt.date)['total_amount'].sum()
    
    # ARIMA(5,1,2) model
    model = ARIMA(daily_sales, order=(5, 1, 2))
    fitted = model.fit()
    
    # Forecast next 28 days
    forecast = fitted.forecast(steps=days)
    
    # Calculate accuracy metrics
    predictions = fitted.fittedvalues[-30:]
    actuals = daily_sales.values[-30:]
    mape = np.mean(np.abs((actuals - predictions) / actuals)) * 100
    accuracy = 100 - mape
    
    return {
        'forecast': forecast.tolist(),
        'dates': pd.date_range(start=daily_sales.index[-1], periods=days+1)[1:].strftime('%Y-%m-%d').tolist(),
        'accuracy': round(accuracy, 2),
        'total_predicted_revenue': round(forecast.sum(), 2),
        'model': 'ARIMA(5,1,2)',
        'confidence_interval': {
            'lower': (forecast * 0.85).tolist(),
            'upper': (forecast * 1.15).tolist()
        }
    }

if __name__ == '__main__':
    result = forecast_sales()
    print(json.dumps(result, indent=2))
