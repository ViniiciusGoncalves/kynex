export interface VibrationReading {
  timestamp: Date;
  axisX: number;
  axisY: number;
  axisZ: number;
  frequency: number;
  amplitude: number;
  rms: number;
}

export interface VibrationAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: Date;
  axis?: 'X' | 'Y' | 'Z';
}

export interface VibrationStatistics {
  avgRMS: number;
  maxAmplitude: number;
  dominantFrequency: number;
  healthScore: number;
  predictedMaintenance: number; // days until maintenance
}

export const generateVibrationMockData = (): VibrationReading[] => {
  const data: VibrationReading[] = [];
  const now = new Date();
  
  for (let i = 47; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // 30 min intervals
    const baseFreq = 50 + Math.sin(i * 0.1) * 10;
    
    data.push({
      timestamp,
      axisX: 0.5 + Math.sin(i * 0.2) * 0.3 + (Math.random() * 0.2 - 0.1),
      axisY: 0.4 + Math.cos(i * 0.15) * 0.2 + (Math.random() * 0.15 - 0.075),
      axisZ: 0.3 + Math.sin(i * 0.25) * 0.25 + (Math.random() * 0.1 - 0.05),
      frequency: baseFreq + (Math.random() * 20 - 10),
      amplitude: 1.2 + Math.sin(i * 0.1) * 0.8 + (Math.random() * 0.3 - 0.15),
      rms: 0.8 + Math.sin(i * 0.12) * 0.4 + (Math.random() * 0.2 - 0.1)
    });
  }
  
  return data;
};

export const calculateVibrationStatistics = (data: VibrationReading[]): VibrationStatistics => {
  if (data.length === 0) {
    return {
      avgRMS: 0,
      maxAmplitude: 0,
      dominantFrequency: 0,
      healthScore: 100,
      predictedMaintenance: 90
    };
  }

  const avgRMS = data.reduce((sum, reading) => sum + reading.rms, 0) / data.length;
  const maxAmplitude = Math.max(...data.map(reading => reading.amplitude));
  const dominantFrequency = data.reduce((sum, reading) => sum + reading.frequency, 0) / data.length;
  
  // Health score based on RMS and amplitude levels
  const healthScore = Math.max(0, 100 - (avgRMS * 50) - (maxAmplitude * 20));
  const predictedMaintenance = Math.max(1, Math.round(healthScore * 0.9));

  return {
    avgRMS: Number(avgRMS.toFixed(3)),
    maxAmplitude: Number(maxAmplitude.toFixed(2)),
    dominantFrequency: Number(dominantFrequency.toFixed(1)),
    healthScore: Number(healthScore.toFixed(1)),
    predictedMaintenance
  };
};

export const generateVibrationAlerts = (data: VibrationReading[]): VibrationAlert[] => {
  const alerts: VibrationAlert[] = [];
  const latest = data[data.length - 1];
  
  if (!latest) return alerts;

  if (latest.rms > 1.2) {
    alerts.push({
      id: '1',
      type: 'critical',
      message: 'RMS de vibração acima do limite crítico',
      timestamp: latest.timestamp,
    });
  }

  if (latest.amplitude > 2.0) {
    alerts.push({
      id: '2',
      type: 'warning',
      message: 'Amplitude de vibração elevada detectada',
      timestamp: latest.timestamp,
    });
  }

  if (Math.max(latest.axisX, latest.axisY, latest.axisZ) > 0.8) {
    const maxAxis = latest.axisX > latest.axisY && latest.axisX > latest.axisZ ? 'X' : 
                   latest.axisY > latest.axisZ ? 'Y' : 'Z';
    alerts.push({
      id: '3',
      type: 'warning',
      message: `Vibração anormal no eixo ${maxAxis}`,
      timestamp: latest.timestamp,
      axis: maxAxis as 'X' | 'Y' | 'Z'
    });
  }

  if (latest.frequency > 80 || latest.frequency < 30) {
    alerts.push({
      id: '4',
      type: 'info',
      message: 'Frequência de vibração fora do padrão normal',
      timestamp: latest.timestamp,
    });
  }

  return alerts;
};

export const formatVibrationChartData = (data: VibrationReading[]) => {
  return data.map((reading) => ({
    time: reading.timestamp.toLocaleTimeString(),
    'Eixo X': Number(reading.axisX.toFixed(3)),
    'Eixo Y': Number(reading.axisY.toFixed(3)),
    'Eixo Z': Number(reading.axisZ.toFixed(3)),
    'RMS': Number(reading.rms.toFixed(3)),
    'Amplitude': Number(reading.amplitude.toFixed(2))
  }));
};