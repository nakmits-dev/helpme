import { getCLS, getFID, getLCP, getTTFB, getFCP } from 'web-vitals';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private readonly maxMetricsPerType = 10;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initWebVitals();
    }
  }

  private initWebVitals() {
    getCLS(this.handleMetric);
    getFID(this.handleMetric);
    getLCP(this.handleMetric);
    getTTFB(this.handleMetric);
    getFCP(this.handleMetric);
  }

  private handleMetric = (metric: PerformanceMetric) => {
    const metrics = this.metrics.get(metric.name) || [];
    metrics.push(metric);
    
    if (metrics.length > this.maxMetricsPerType) {
      metrics.shift();
    }
    
    this.metrics.set(metric.name, metrics);

    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${metric.name}:`, {
        value: `${metric.value.toFixed(2)}ms`,
        rating: metric.rating
      });
    }
  };

  getMetrics(metricName?: string) {
    if (metricName) {
      return this.metrics.get(metricName) || [];
    }
    return Object.fromEntries(this.metrics);
  }

  getLatestMetric(metricName: string) {
    const metrics = this.metrics.get(metricName);
    return metrics ? metrics[metrics.length - 1] : null;
  }

  clearMetrics() {
    this.metrics.clear();
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const duration = performance.now() - start;
      if (process.env.NODE_ENV === 'development') {
        console.log(`Async Operation - ${name}: ${duration.toFixed(2)}ms`);
      }
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();