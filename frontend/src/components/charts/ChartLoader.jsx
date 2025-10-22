import { lazy, Suspense } from 'react';

const chartComponents = {
  LineChart: lazy(() => import('./LineChart')),
  BarChart: lazy(() => import('./BarChart')),
  PieChart: lazy(() => import('./PieChart')),
  Heatmap: lazy(() => import('./Heatmap')),
  AreaChart: lazy(() => import('./AreaChart')),
  DonutChart: lazy(() => import('./DonutChart')),
  GaugeChart: lazy(() => import('./GaugeChart'))
};

const ChartLoader = ({ type, ...props }) => {
  const ChartComponent = chartComponents[type];
  
  if (!ChartComponent) {
    return <div>Invalid chart type</div>;
  }
  
  return (
    <Suspense 
      fallback={
        <div className="animate-pulse h-64 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-gray-500">Loading chart...</span>
        </div>
      }
    >
      <ChartComponent {...props} />
    </Suspense>
  );
};

export default ChartLoader;
