export class ProcessingMetrics {
  private startTime: number;
  private metrics: Record<string, any> = {};

  constructor() {
    this.startTime = Date.now();
  }

  trackMetric(name: string, value: any) {
    this.metrics[name] = value;
    console.log(`Metric - ${name}:`, value);
  }

  trackMemory() {
    if (typeof process !== 'undefined') {
      const used = process.memoryUsage();
      this.trackMetric('memoryUsage', {
        heapTotal: Math.round(used.heapTotal / 1024 / 1024) + 'MB',
        heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB'
      });
    }
  }

  getExecutionTime(): number {
    return Date.now() - this.startTime;
  }

  getAllMetrics() {
    return {
      ...this.metrics,
      executionTime: this.getExecutionTime()
    };
  }
}