import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import json

def segment_customers():
    """
    K-means Customer Segmentation
    4 clusters: Champions, Loyal, At-Risk, Lost
    """
    with open('../database/datasets/processed_data.json', 'r') as f:
        data = json.load(f)
    
    customers_df = pd.DataFrame(data['customers'])
    
    # RFM features
    customers_df['recency'] = customers_df['days_since_last_order']
    customers_df['frequency'] = customers_df['order_count']
    customers_df['monetary'] = customers_df['total_items'] * 15
    
    # Prepare and scale features
    X = customers_df[['recency', 'frequency', 'monetary']].fillna(0)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # K-means with 4 clusters
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    customers_df['segment'] = kmeans.fit_predict(X_scaled)
    
    # Calculate silhouette score
    silhouette = silhouette_score(X_scaled, customers_df['segment'])
    
    # Assign segment names based on characteristics
    segment_stats = customers_df.groupby('segment').agg({
        'recency': 'mean',
        'frequency': 'mean',
        'monetary': 'mean'
    })
    
    # Label segments (0=Champions, 1=Loyal, 2=At-Risk, 3=Lost)
    segment_names = {
        segment_stats['recency'].idxmin(): 'Champions',
        segment_stats['frequency'].idxmax(): 'Loyal',
        segment_stats['recency'].nlargest(2).index[0]: 'At-Risk',
        segment_stats['recency'].idxmax(): 'Lost'
    }
    
    customers_df['segment_name'] = customers_df['segment'].map(segment_names)
    
    # Segment distribution
    distribution = customers_df['segment_name'].value_counts().to_dict()
    percentages = (customers_df['segment_name'].value_counts(normalize=True) * 100).round(1).to_dict()
    
    return {
        'total_customers': len(customers_df),
        'segments': {
            name: {
                'count': int(distribution.get(name, 0)),
                'percentage': float(percentages.get(name, 0)),
                'avg_recency': round(segment_stats.loc[seg, 'recency'], 1),
                'avg_frequency': round(segment_stats.loc[seg, 'frequency'], 1),
                'avg_monetary': round(segment_stats.loc[seg, 'monetary'], 2)
            }
            for seg, name in segment_names.items()
        },
        'silhouette_score': round(silhouette, 2),
        'algorithm': 'K-means',
        'n_clusters': 4,
        'distance_metric': 'Euclidean'
    }

if __name__ == '__main__':
    result = segment_customers()
    print(json.dumps(result, indent=2))
