
export interface TemperatureReading {
  timestamp: Date;
  temperature: number;
  sensorId?: string;
}

export interface TemperatureStatistics {
  average: number;
  standardDeviation: number;
  minimum: number;
  maximum: number;
  readingsCount: number;
}

export interface Alert {
  id: number;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: Date;
  temperature: number;
}

export const calculateStatistics = (readings: TemperatureReading[]): TemperatureStatistics => {
  if (readings.length === 0) {
    return {
      average: 0,
      standardDeviation: 0,
      minimum: 0,
      maximum: 0,
      readingsCount: 0
    };
  }

  const temperatures = readings.map(r => r.temperature);
  const sum = temperatures.reduce((a, b) => a + b, 0);
  const average = sum / temperatures.length;
  
  const squaredDiffs = temperatures.map(temp => Math.pow(temp - average, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / temperatures.length;
  const standardDeviation = Math.sqrt(variance);

  return {
    average,
    standardDeviation,
    minimum: Math.min(...temperatures),
    maximum: Math.max(...temperatures),
    readingsCount: readings.length
  };
};

export const generateAlerts = (
  readings: TemperatureReading[],
  minThreshold: number,
  maxThreshold: number
): Alert[] => {
  const alerts: Alert[] = [];
  let alertId = 1;

  readings.forEach(reading => {
    if (reading.temperature > maxThreshold) {
      alerts.push({
        id: alertId++,
        type: 'critical',
        message: `Temperatura crítica detectada: ${reading.temperature.toFixed(1)}°C (acima de ${maxThreshold}°C)`,
        timestamp: reading.timestamp,
        temperature: reading.temperature
      });
    } else if (reading.temperature < minThreshold) {
      alerts.push({
        id: alertId++,
        type: 'warning',
        message: `Temperatura baixa detectada: ${reading.temperature.toFixed(1)}°C (abaixo de ${minThreshold}°C)`,
        timestamp: reading.timestamp,
        temperature: reading.temperature
      });
    }
  });

  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
};

export const generateMockData = (): TemperatureReading[] => {
  const now = new Date();
  const readings: TemperatureReading[] = [];
  
  for (let i = 47; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // 30 minutos
    const baseTemp = 22;
    const variation = (Math.sin(i * 0.1) * 3) + (Math.random() * 4 - 2);
    const temperature = baseTemp + variation;
    
    readings.push({
      timestamp,
      temperature: Math.max(5, Math.min(45, temperature)) // Limita entre 5 e 45°C
    });
  }
  
  return readings;
};

export const formatChartData = (readings: TemperatureReading[]) => {
  return readings.map(reading => ({
    time: reading.timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    temperature: reading.temperature,
    timestamp: reading.timestamp
  }));
};

export const exportToCSV = (readings: TemperatureReading[], statistics: TemperatureStatistics) => {
  const csvContent = [
    ['Timestamp', 'Temperatura (°C)'],
    ...readings.map(r => [
      r.timestamp.toLocaleString('pt-BR'),
      r.temperature.toFixed(2)
    ]),
    [],
    ['Estatísticas'],
    ['Média', statistics.average.toFixed(2)],
    ['Desvio Padrão', statistics.standardDeviation.toFixed(2)],
    ['Mínima', statistics.minimum.toFixed(2)],
    ['Máxima', statistics.maximum.toFixed(2)],
    ['Total de Leituras', statistics.readingsCount.toString()]
  ];

  const csvString = csvContent.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `temperatura_elevador_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (statistics: TemperatureStatistics) => {
  // Simulação de exportação PDF
  const content = `
RELATÓRIO DE MONITORAMENTO DE TEMPERATURA - POÇO DO ELEVADOR
Data: ${new Date().toLocaleString('pt-BR')}

ESTATÍSTICAS DO PERÍODO:
- Temperatura Média: ${statistics.average.toFixed(2)}°C
- Desvio Padrão: ${statistics.standardDeviation.toFixed(2)}°C
- Temperatura Mínima: ${statistics.minimum.toFixed(2)}°C
- Temperatura Máxima: ${statistics.maximum.toFixed(2)}°C
- Total de Leituras: ${statistics.readingsCount}

ANÁLISE:
- Variabilidade: ${statistics.standardDeviation < 1 ? 'Baixa' : statistics.standardDeviation < 3 ? 'Moderada' : 'Alta'}
- Estabilidade Térmica: ${statistics.standardDeviation < 2 ? 'Boa' : 'Necessita atenção'}
  `;

  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `relatorio_temperatura_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
