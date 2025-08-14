import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Thermometer, Activity, Eye } from "lucide-react";

// Temperature components
import TemperatureCard from "./TemperatureCard";
import TemperatureChart from "./TemperatureChart";
import AlertsPanel from "./AlertsPanel";
import StatisticsPanel from "./StatisticsPanel";

// Vibration components
import VibrationCard from "./VibrationCard";
import VibrationChart from "./VibrationChart";
import VibrationAlertsPanel from "./VibrationAlertsPanel";
import VibrationStatisticsPanel from "./VibrationStatisticsPanel";

import { 
  TemperatureReading,
  calculateStatistics, 
  generateAlerts, 
  formatChartData,
  exportToPDF,
  exportToCSV
} from "@/utils/temperatureUtils";

import {
  VibrationReading,
  generateVibrationMockData,
  calculateVibrationStatistics,
  generateVibrationAlerts,
  formatVibrationChartData
} from "@/utils/vibrationUtils";
import ExportPanel from './ExportPanel';

interface SensorCarouselProps {
  temperatureData: TemperatureReading[];
  currentTemp: number;
  minThreshold: number;
  maxThreshold: number;
}

const SensorCarousel = ({ temperatureData, currentTemp, minThreshold, maxThreshold }: SensorCarouselProps) => {
  const [vibrationData, setVibrationData] = useState<VibrationReading[]>([]);
  const [currentVibration, setCurrentVibration] = useState({ axisX: 0, axisY: 0, axisZ: 0, rms: 0 });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  

  useEffect(() => {
    // Initialize vibration data
    const initialVibrationData = generateVibrationMockData();
    setVibrationData(initialVibrationData);
    const latest = initialVibrationData[initialVibrationData.length - 1];
    if (latest) {
      setCurrentVibration({
        axisX: latest.axisX,
        axisY: latest.axisY,
        axisZ: latest.axisZ,
        rms: latest.rms
      });
    }

    // Simulate real-time updates for vibration
    const interval = setInterval(() => {
      const newReading: VibrationReading = {
        timestamp: new Date(),
        axisX: 0.5 + Math.sin(Date.now() * 0.001) * 0.3 + (Math.random() * 0.2 - 0.1),
        axisY: 0.4 + Math.cos(Date.now() * 0.0015) * 0.2 + (Math.random() * 0.15 - 0.075),
        axisZ: 0.3 + Math.sin(Date.now() * 0.0025) * 0.25 + (Math.random() * 0.1 - 0.05),
        frequency: 50 + Math.sin(Date.now() * 0.001) * 10 + (Math.random() * 20 - 10),
        amplitude: 1.2 + Math.sin(Date.now() * 0.001) * 0.8 + (Math.random() * 0.3 - 0.15),
        rms: 0.8 + Math.sin(Date.now() * 0.0012) * 0.4 + (Math.random() * 0.2 - 0.1)
      };

      setVibrationData(prev => [...prev.slice(-47), newReading]);
      setCurrentVibration({
        axisX: newReading.axisX,
        axisY: newReading.axisY,
        axisZ: newReading.axisZ,
        rms: newReading.rms
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Temperature calculations
  const temperatureStatistics = calculateStatistics(temperatureData);
  const temperatureAlerts = generateAlerts(temperatureData, minThreshold, maxThreshold);
  const temperatureChartData = formatChartData(temperatureData);

  // Vibration calculations
  const vibrationStatistics = calculateVibrationStatistics(vibrationData);
  const vibrationAlerts = generateVibrationAlerts(vibrationData);
  const vibrationChartData = formatVibrationChartData(vibrationData);

  const getCurrentTempTrend = () => {
    if (temperatureData.length < 2) return 'stable';
    const recent = temperatureData.slice(-3);
    const trend = recent[recent.length - 1].temperature - recent[0].temperature;
    if (trend > 0.5) return 'up';
    if (trend < -0.5) return 'down';
    return 'stable';
  };

  const getVibrationTrend = (current: number, data: VibrationReading[], accessor: keyof VibrationReading) => {
    if (data.length < 2) return 'stable';
    const recent = data.slice(-3);
    const trend = (recent[recent.length - 1][accessor] as number) - (recent[0][accessor] as number);
    if (trend > 0.1) return 'up';
    if (trend < -0.1) return 'down';
    return 'stable';
  };

  const statistics = calculateStatistics(temperatureData);

  const handleExportPDF = () => {
    exportToPDF(statistics);
  };

  const handleExportCSV = () => {
    exportToCSV(temperatureData, statistics);
  };

  const sensors = [
    {
      id: 'temperature',
      name: 'Sensor de Temperatura',
      icon: <Thermometer className="h-5 w-5" />,
      status: currentTemp > maxThreshold || currentTemp < minThreshold ? 'alert' : 'normal',
      content: (
        <div className="space-y-6">
          {/* Temperature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <TemperatureCard
              title="Temperatura Atual"
              value={currentTemp}
              unit="°C"
              icon={currentTemp > 30 ? 'hot' : currentTemp < 15 ? 'cold' : 'normal'}
              trend={getCurrentTempTrend()}
            />
            <TemperatureCard
              title="Temperatura Média"
              value={temperatureStatistics.average}
              unit="°C"
              icon="normal"
            />
            <TemperatureCard
              title="Máxima (24h)"
              value={temperatureStatistics.maximum}
              unit="°C"
              icon="hot"
            />
            <TemperatureCard
              title="Mínima (24h)"
              value={temperatureStatistics.minimum}
              unit="°C"
              icon="cold"
            />
          </div>

          {/* Chart and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TemperatureChart
              data={temperatureChartData}
              minThreshold={minThreshold}
              maxThreshold={maxThreshold}
            />
            <AlertsPanel alerts={temperatureAlerts} />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatisticsPanel
              statistics={temperatureStatistics}
              period="Últimas 24 horas"
            />
            <ExportPanel
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
            lastExport={lastUpdate}/>
          </div>
        </div>
      )
    },
    {
      id: 'vibration',
      name: 'Análise de Vibração',
      icon: <Activity className="h-5 w-5" />,
      status: vibrationStatistics.healthScore < 60 ? 'alert' : 'normal',
      content: (
        <div className="space-y-6">
          {/* Vibration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <VibrationCard
              title="RMS Atual"
              value={currentVibration.rms}
              unit=" g"
              icon="activity"
              trend={getVibrationTrend(currentVibration.rms, vibrationData, 'rms')}
            />
            <VibrationCard
              title="Vibração Eixo X"
              value={currentVibration.axisX}
              unit=" g"
              icon="activity"
              trend={getVibrationTrend(currentVibration.axisX, vibrationData, 'axisX')}
            />
            <VibrationCard
              title="Vibração Eixo Y"
              value={currentVibration.axisY}
              unit=" g"
              icon="activity"
              trend={getVibrationTrend(currentVibration.axisY, vibrationData, 'axisY')}
            />
            <VibrationCard
              title="Vibração Eixo Z"
              value={currentVibration.axisZ}
              unit=" g"
              icon="activity"
              trend={getVibrationTrend(currentVibration.axisZ, vibrationData, 'axisZ')}
            />
          </div>

          {/* Chart and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <VibrationChart data={vibrationChartData} />
            <VibrationAlertsPanel alerts={vibrationAlerts} />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VibrationStatisticsPanel
              statistics={vibrationStatistics}
              period="Últimas 24 horas"
            />
            <ExportPanel
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
            lastExport={lastUpdate}/>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Eye className="h-6 w-6" />
            Painel de Monitoramento Multi-Sensor
          </CardTitle>
          <p className="text-gray-600">
            Sistema integrado de monitoramento de temperatura e análise de vibração
          </p>
        </CardHeader>
        <CardContent>
          <Carousel className="w-full">
            <CarouselContent>
              {sensors.map((sensor) => (
                <CarouselItem key={sensor.id}>
                  <div className="space-y-4">
                    {/* Sensor Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {sensor.icon}
                        <h3 className="text-lg font-semibold text-gray-800">
                          {sensor.name}
                        </h3>
                      </div>
                      <Badge variant={sensor.status === 'alert' ? 'destructive' : 'default'}>
                        {sensor.status === 'alert' ? 'Atenção' : 'Normal'}
                      </Badge>
                    </div>
                    
                    {/* Sensor Content */}
                    {sensor.content}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
    </div>
  );
};

export default SensorCarousel;