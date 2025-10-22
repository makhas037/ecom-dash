import pandas as pd
import json
from datetime import datetime
import os

# Configuration
DATASET_PATH = "E:/BI PROJECT/ecom-dash/database/datasets/data.csv"
OUTPUT_JSON = "E:/BI PROJECT/ecom-dash/database/datasets/processed_data.json"

def load_and_process_data():
    """Load Kaggle dataset and transform for SalesRadar"""
    print("📥 Loading Kaggle E-Commerce Dataset...")
    
    # Load data
    df = pd.read_csv(DATASET_PATH, encoding='ISO-8859-1')
    
    print(f"✅ Loaded {len(df)} records")
    
    # Clean data
    df = df.dropna(subset=['CustomerID', 'InvoiceNo'])
    df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
    
    # Create sales summary
    sales_summary = df.groupby('InvoiceNo').agg({
        'InvoiceDate': 'first',
        'CustomerID': 'first',
        'Country': 'first',
        'Quantity': 'sum',
        'UnitPrice': 'mean'
    }).reset_index()
    
    sales_summary['total_amount'] = sales_summary['Quantity'] * sales_summary['UnitPrice']
    sales_summary['profit'] = sales_summary['total_amount'] * 0.3  # 30% profit margin
    
    # Create customers data
    customers = df.groupby('CustomerID').agg({
        'Country': 'first',
        'InvoiceDate': ['min', 'max', 'count'],
        'Quantity': 'sum'
    }).reset_index()
    
    customers.columns = ['customer_id', 'country', 'first_purchase', 'last_purchase', 'order_count', 'total_items']
    customers['days_since_last_order'] = (datetime.now() - pd.to_datetime(customers['last_purchase'])).dt.days
    
    # Create products data
    products = df.groupby('StockCode').agg({
        'Description': 'first',
        'UnitPrice': 'mean',
        'Quantity': 'sum'
    }).reset_index()
    
    products.columns = ['product_id', 'name', 'price', 'total_sold']
    
    # Prepare JSON output
    output = {
        'sales': sales_summary.to_dict('records'),
        'customers': customers.to_dict('records'),
        'products': products.head(100).to_dict('records'),
        'metadata': {
            'total_sales': len(sales_summary),
            'total_customers': len(customers),
            'total_products': len(products),
            'date_range': {
                'start': df['InvoiceDate'].min().isoformat(),
                'end': df['InvoiceDate'].max().isoformat()
            }
        }
    }
    
    # Save to JSON
    with open(OUTPUT_JSON, 'w') as f:
        json.dump(output, f, indent=2, default=str)
    
    print(f"✅ Processed data saved to {OUTPUT_JSON}")
    print(f"📊 Statistics:")
    print(f"   - Total Sales: {len(sales_summary)}")
    print(f"   - Total Customers: {len(customers)}")
    print(f"   - Total Products: {len(products)}")
    print(f"   - Date Range: {output['metadata']['date_range']['start']} to {output['metadata']['date_range']['end']}")
    
    return output

if __name__ == "__main__":
    data = load_and_process_data()
