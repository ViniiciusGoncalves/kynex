
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TemperatureCard from "@/components/TemperatureCard";
import TemperatureChart from "@/components/TemperatureChart";
import AlertsPanel from "@/components/AlertsPanel";
import StatisticsPanel from "@/components/StatisticsPanel";
import ExportPanel from "@/components/ExportPanel";
import { 
  generateMockData, 
  calculateStatistics, 
  generateAlerts, 
  formatChartData,
  exportToCSV,
  exportToPDF,
  TemperatureReading
} from "@/utils/temperatureUtils";

const Index = () => {
  const [temperatureData, setTemperatureData] = useState<TemperatureReading[]>([]);
  const [currentTemp, setCurrentTemp] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const MIN_THRESHOLD = 5;
  const MAX_THRESHOLD = 40;

  useEffect(() => {
    // Inicializar dados
    const initialData = generateMockData();
    setTemperatureData(initialData);
    setCurrentTemp(initialData[initialData.length - 1]?.temperature || 0);

    // Simular atualizações em tempo real
    const interval = setInterval(() => {
      const newReading: TemperatureReading = {
        timestamp: new Date(),
        temperature: 20 + (Math.sin(Date.now() * 0.001) * 5) + (Math.random() * 4 - 2)
      };

      setTemperatureData(prev => [...prev.slice(-47), newReading]);
      setCurrentTemp(newReading.temperature);
      setLastUpdate(new Date());
      
      // Simular ocasionais desconexões
      setIsOnline(Math.random() > 0.05);
    }, 30000); // Atualizar a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const statistics = calculateStatistics(temperatureData);
  const alerts = generateAlerts(temperatureData, MIN_THRESHOLD, MAX_THRESHOLD);
  const chartData = formatChartData(temperatureData);

  const getCurrentTempTrend = () => {
    if (temperatureData.length < 2) return 'stable';
    const recent = temperatureData.slice(-3);
    const trend = recent[recent.length - 1].temperature - recent[0].temperature;
    if (trend > 0.5) return 'up';
    if (trend < -0.5) return 'down';
    return 'stable';
  };

  const getStatusColor = () => {
    if (!isOnline) return 'bg-gray-500';
    if (currentTemp > MAX_THRESHOLD || currentTemp < MIN_THRESHOLD) return 'bg-red-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (currentTemp > MAX_THRESHOLD) return 'Temperatura Alta';
    if (currentTemp < MIN_THRESHOLD) return 'Temperatura Baixa';
    return 'Normal';
  };

  const handleExportPDF = () => {
    exportToPDF(statistics);
  };

  const handleExportCSV = () => {
    exportToCSV(temperatureData, statistics);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Monitoramento de Temperatura
            </h1>
            <p className="text-gray-600 mt-1">
              Sistema de Monitoramento do Poço do Elevador
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
              <Badge variant={isOnline ? "default" : "secondary"}>
                {getStatusText()}
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              Última atualização: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Temperature Cards */}
          <TemperatureCard
            title="Temperatura Atual"
            value={currentTemp}
            unit="°C"
            icon={currentTemp > 30 ? 'hot' : currentTemp < 15 ? 'cold' : 'normal'}
            trend={getCurrentTempTrend()}
            className="lg:col-span-1"
          />
          
          <TemperatureCard
            title="Temperatura Média"
            value={statistics.average}
            unit="°C"
            icon="normal"
            className="lg:col-span-1"
          />
          
          <TemperatureCard
            title="Máxima (24h)"
            value={statistics.maximum}
            unit="°C"
            icon="hot"
            className="lg:col-span-1"
          />
          
          <TemperatureCard
            title="Mínima (24h)"
            value={statistics.minimum}
            unit="°C"
            icon="cold"
            className="lg:col-span-1"
          />
        </div>

        {/* Chart and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TemperatureChart
            data={chartData}
            minThreshold={MIN_THRESHOLD}
            maxThreshold={MAX_THRESHOLD}
          />
          
          <AlertsPanel alerts={alerts} />
        </div>

        {/* Statistics and Export */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatisticsPanel
            statistics={statistics}
            period="Últimas 24 horas"
          />
          
          <ExportPanel
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
            lastExport={lastUpdate}
          />
        </div>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-600">Limites Configurados</div>
                <div className="text-gray-800">
                  Mín: {MIN_THRESHOLD}°C | Máx: {MAX_THRESHOLD}°C
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Frequência de Leitura</div>
                <div className="text-gray-800">A cada 30 segundos</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Localização</div>
                <div className="text-gray-800">Poço do Elevador - Edifício Principal</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
