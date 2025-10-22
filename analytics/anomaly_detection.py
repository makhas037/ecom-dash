import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import json

def detect_anomalies():
    """
    Isolation Forest Anomaly Detection
    Detects unusual transactions and fraud patterns
    """
    with open('../database/datasets/processed_data.json', 'r') as f:
        data = json.load(f)
    
    sales_df = pd.DataFrame(data['sales'])
    
    # Features for anomaly detection
    X = sales_df[['Quantity', 'total_amount']].fillna(0)
    
    # Isolation Forest
    iso_forest = IsolationForest(contamination=0.05, random_state=42)
    sales_df['anomaly'] = iso_forest.fit_predict(X)
    sales_df['anomaly_score'] = iso_forest.score_samples(X)
    
    # Identify anomalies (-1 = anomaly, 1 = normal)
    anomalies = sales_df[sales_df['anomaly'] == -1].copy()
    anomalies = anomalies.sort_values('anomaly_score')
    
    return {
        'total_transactions': len(sales_df),
        'anomalies_detected': len(anomalies),
        'contamination_rate': 0.05,
        'percentage_anomalies': round((len(anomalies) / len(sales_df)) * 100, 2),
        'top_anomalies': anomalies.head(20)[['InvoiceNo', 'Quantity', 'total_amount', 'anomaly_score']].to_dict('records'),
        'model': 'Isolation Forest',
        'use_cases': ['Fraud detection', 'Data quality', 'Unusual patterns'],
        'avg_anomaly_value': round(anomalies['total_amount'].mean(), 2),
        'avg_normal_value': round(sales_df[sales_df['anomaly'] == 1]['total_amount'].mean(), 2)
    }

if __name__ == '__main__':
    result = detect_anomalies()
    print(json.dumps(result, indent=2))
