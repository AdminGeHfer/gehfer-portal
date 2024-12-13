export class ProcessingMetrics {
  private startTime: number;
  private metrics: Record<string, any> = {};
  private memorySnapshots: number[] = [];

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
      this.memorySnapshots.push(used.heapUsed);
      
      this.trackMetric('memoryUsage', {
        heapTotal: Math.round(used.heapTotal / 1024 / 1024) + 'MB',
        heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB',
        external: Math.round(used.external / 1024 / 1024) + 'MB'
      });
    }
  }

  getMemoryStats() {
    if (this.memorySnapshots.length === 0) return null;

    return {
      peak: Math.max(...this.memorySnapshots) / 1024 / 1024,
      average: (this.memorySnapshots.reduce((a, b) => a + b, 0) / this.memorySnapshots.length) / 1024 / 1024,
      samples: this.memorySnapshots.length
    };
  }

  getExecutionTime(): number {
    return Date.now() - this.startTime;
  }

  getAllMetrics() {
    return {
      ...this.metrics,
      executionTime: this.getExecutionTime(),
      memoryStats: this.getMemoryStats()
    };
  }
}