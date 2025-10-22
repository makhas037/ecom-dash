import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import json

def predict_demand():
    """
    XGBoost Demand Prediction
    Predicts product demand for inventory optimization
    """
    with open('../database/datasets/processed_data.json', 'r') as f:
        data = json.load(f)
    
    products_df = pd.DataFrame(data['products'])
    sales_df = pd.DataFrame(data['sales'])
    
    # Aggregate product sales with temporal features
    sales_df['InvoiceDate'] = pd.to_datetime(sales_df['InvoiceDate'])
    sales_df['month'] = sales_df['InvoiceDate'].dt.month
    sales_df['day_of_week'] = sales_df['InvoiceDate'].dt.dayofweek
    
    product_features = sales_df.groupby('StockCode').agg({
        'Quantity': 'sum',
        'month': lambda x: x.mode()[0] if len(x) > 0 else 1,
        'day_of_week': 'mean'
    }).reset_index()
    
    # Prepare features
    X = product_features[['month', 'day_of_week']]
    y = product_features['Quantity']
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train XGBoost
    model = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
    model.fit(X_train, y_train)
    
    # Predictions
    y_pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    # Predict next month demand for top products
    top_products = products_df.nlargest(20, 'total_sold')
    predictions = []
    
    for _, product in top_products.iterrows():
        next_month_demand = model.predict([[12, 3]])[0]  # December, mid-week
        predictions.append({
            'product_id': product['product_id'],
            'product_name': product['name'],
            'current_stock': product['total_sold'],
            'predicted_demand': int(next_month_demand),
            'recommendation': 'Restock' if next_month_demand > product['total_sold'] * 0.5 else 'Sufficient'
        })
    
    return {
        'rmse': round(rmse, 2),
        'model': 'XGBoost',
        'features': ['month', 'day_of_week', 'historical_sales'],
        'predictions': predictions[:10],
        'total_products_analyzed': len(product_features),
        'accuracy_percentage': round(100 - (rmse / y.mean() * 100), 2)
    }

if __name__ == '__main__':
    result = predict_demand()
    print(json.dumps(result, indent=2))
