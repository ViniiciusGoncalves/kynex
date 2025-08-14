export interface CurrentReading {
  timestamp: Date;
  motorCurrent: number; // A
  totalCurrent: number; // A
  voltage: number; // V
  power: number; // W
  powerFactor: number;
  efficiency: number; // %
}

export interface CurrentAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: Date;
}

export interface CurrentStatistics {
  avgCurrent: number;
  maxCurrent: number;
  avgPower: number;
  energyConsumption: number;
  efficiency: number;
}

export const generateCurrentMockData = (): CurrentReading[] => {
  const data: CurrentReading[] = [];
  const now = new Date();
  
  for (let i = 47; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000);
    const motorCurrent = 8 + Math.sin(i * 0.15) * 3 + (Math.random() * 2 - 1);
    const voltage = 220 + (Math.random() * 10 - 5);
    const power = motorCurrent * voltage * 0.85; // Considering power factor
    
    data.push({
      timestamp,
      motorCurrent: Number(motorCurrent.toFixed(2)),
      totalCurrent: Number((motorCurrent * 1.15).toFixed(2)),
      voltage: Number(voltage.toFixed(1)),
      power: Number(power.toFixed(0)),
      powerFactor: Number((0.85 + Math.random() * 0.1).toFixed(2)),
      efficiency: Number((85 + Math.random() * 10).toFixed(1))
    });
  }
  
  return data;
};

export const calculateCurrentStatistics = (data: CurrentReading[]): CurrentStatistics => {
  if (data.length === 0) {
    return {
      avgCurrent: 0,
      maxCurrent: 0,
      avgPower: 0,
      energyConsumption: 0,
      efficiency: 0
    };
  }

  const avgCurrent = data.reduce((sum, reading) => sum + reading.motorCurrent, 0) / data.length;
  const maxCurrent = Math.max(...data.map(reading => reading.motorCurrent));
  const avgPower = data.reduce((sum, reading) => sum + reading.power, 0) / data.length;
  const energyConsumption = avgPower * 24 / 1000; // kWh per day
  const efficiency = data.reduce((sum, reading) => sum + reading.efficiency, 0) / data.length;

  return {
    avgCurrent: Number(avgCurrent.toFixed(2)),
    maxCurrent: Number(maxCurrent.toFixed(2)),
    avgPower: Number(avgPower.toFixed(0)),
    energyConsumption: Number(energyConsumption.toFixed(2)),
    efficiency: Number(efficiency.toFixed(1))
  };
};

export const generateCurrentAlerts = (data: CurrentReading[]): CurrentAlert[] => {
  const alerts: CurrentAlert[] = [];
  const latest = data[data.length - 1];
  
  if (!latest) return alerts;

  if (latest.motorCurrent > 12) {
    alerts.push({
      id: '1',
      type: 'critical',
      message: 'Corrente do motor acima do limite',
      timestamp: latest.timestamp,
    });
  }

  if (latest.efficiency < 80) {
    alerts.push({
      id: '2',
      type: 'warning',
      message: 'Eficiência energética baixa',
      timestamp: latest.timestamp,
    });
  }

  if (latest.powerFactor < 0.8) {
    alerts.push({
      id: '3',
      type: 'info',
      message: 'Fator de potência baixo',
      timestamp: latest.timestamp,
    });
  }

  return alerts;
};

export const formatCurrentChartData = (data: CurrentReading[]) => {
  return data.map((reading) => ({
    time: reading.timestamp.toLocaleTimeString(),
    'Corrente Motor': reading.motorCurrent,
    'Corrente Total': reading.totalCurrent,
    'Potência': reading.power / 100, // Scale for better visualization
    'Eficiência': reading.efficiency
  }));
};