import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score
import json

def predict_churn():
    """
    Logistic Regression Churn Prediction
    Returns at-risk customers
    """
    with open('../database/datasets/processed_data.json', 'r') as f:
        data = json.load(f)
    
    customers_df = pd.DataFrame(data['customers'])
    
    # Feature engineering: RFM
    customers_df['recency'] = customers_df['days_since_last_order']
    customers_df['frequency'] = customers_df['order_count']
    customers_df['monetary'] = customers_df['total_items'] * 15  # avg item price
    
    # Define churn: > 60 days inactive
    customers_df['churned'] = (customers_df['recency'] > 60).astype(int)
    
    # Prepare features
    X = customers_df[['recency', 'frequency', 'monetary']].fillna(0)
    y = customers_df['churned']
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Logistic Regression
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)
    
    # Predictions
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X)[:, 1]
    
    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    
    # Identify at-risk customers
    customers_df['churn_probability'] = y_proba
    at_risk = customers_df[customers_df['churn_probability'] > 0.5].sort_values('churn_probability', ascending=False)
    
    return {
        'total_customers': len(customers_df),
        'at_risk_count': len(at_risk),
        'churn_rate': round((len(at_risk) / len(customers_df)) * 100, 2),
        'model_accuracy': round(accuracy * 100, 2),
        'precision': round(precision * 100, 2),
        'recall': round(recall * 100, 2),
        'at_risk_customers': at_risk.head(50)[['customer_id', 'recency', 'frequency', 'churn_probability']].to_dict('records'),
        'features_used': ['Recency', 'Frequency', 'Monetary'],
        'threshold': 60
    }

if __name__ == '__main__':
    result = predict_churn()
    print(json.dumps(result, indent=2))
