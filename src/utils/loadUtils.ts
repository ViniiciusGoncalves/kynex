export interface LoadReading {
  timestamp: Date;
  currentLoad: number; // kg
  maxCapacity: number; // kg
  loadPercentage: number; // %
  distributionFactor: number; // balance factor
}

export interface LoadAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: Date;
}

export interface LoadStatistics {
  avgLoad: number;
  maxLoad: number;
  peakUsage: number;
  utilizationRate: number;
  overloadEvents: number;
}

export const generateLoadMockData = (): LoadReading[] => {
  const data: LoadReading[] = [];
  const now = new Date();
  const maxCapacity = 800; // kg
  
  for (let i = 47; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000);
    const baseLoad = 200 + Math.sin(i * 0.1) * 150 + (Math.random() * 100 - 50);
    const currentLoad = Math.max(0, Math.min(maxCapacity, baseLoad));
    
    data.push({
      timestamp,
      currentLoad: Number(currentLoad.toFixed(1)),
      maxCapacity,
      loadPercentage: Number(((currentLoad / maxCapacity) * 100).toFixed(1)),
      distributionFactor: Number((0.8 + Math.random() * 0.4).toFixed(2))
    });
  }
  
  return data;
};

export const calculateLoadStatistics = (data: LoadReading[]): LoadStatistics => {
  if (data.length === 0) {
    return {
      avgLoad: 0,
      maxLoad: 0,
      peakUsage: 0,
      utilizationRate: 0,
      overloadEvents: 0
    };
  }

  const avgLoad = data.reduce((sum, reading) => sum + reading.currentLoad, 0) / data.length;
  const maxLoad = Math.max(...data.map(reading => reading.currentLoad));
  const peakUsage = Math.max(...data.map(reading => reading.loadPercentage));
  const utilizationRate = data.reduce((sum, reading) => sum + reading.loadPercentage, 0) / data.length;
  const overloadEvents = data.filter(reading => reading.loadPercentage > 90).length;

  return {
    avgLoad: Number(avgLoad.toFixed(1)),
    maxLoad: Number(maxLoad.toFixed(1)),
    peakUsage: Number(peakUsage.toFixed(1)),
    utilizationRate: Number(utilizationRate.toFixed(1)),
    overloadEvents
  };
};

export const generateLoadAlerts = (data: LoadReading[]): LoadAlert[] => {
  const alerts: LoadAlert[] = [];
  const latest = data[data.length - 1];
  
  if (!latest) return alerts;

  if (latest.loadPercentage > 95) {
    alerts.push({
      id: '1',
      type: 'critical',
      message: 'Carga próxima ao limite máximo',
      timestamp: latest.timestamp,
    });
  }

  if (latest.loadPercentage > 85) {
    alerts.push({
      id: '2',
      type: 'warning',
      message: 'Carga elevada detectada',
      timestamp: latest.timestamp,
    });
  }

  if (latest.distributionFactor < 0.7) {
    alerts.push({
      id: '3',
      type: 'warning',
      message: 'Distribuição de carga desbalanceada',
      timestamp: latest.timestamp,
    });
  }

  return alerts;
};

export const formatLoadChartData = (data: LoadReading[]) => {
  return data.map((reading) => ({
    time: reading.timestamp.toLocaleTimeString(),
    'Carga Atual': reading.currentLoad,
    'Percentual': reading.loadPercentage,
    'Distribuição': reading.distributionFactor * 100
  }));
};