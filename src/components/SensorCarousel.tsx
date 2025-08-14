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
import { Thermometer, Activity, Eye, Weight, Zap } from "lucide-react";

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

import {
  LoadReading,
  generateLoadMockData,
  calculateLoadStatistics,
  generateLoadAlerts,
  formatLoadChartData
} from "@/utils/loadUtils";

import {
  CurrentReading,
  generateCurrentMockData,
  calculateCurrentStatistics,
  generateCurrentAlerts,
  formatCurrentChartData
} from "@/utils/currentUtils";

import ExportPanel from './ExportPanel';
import LoadCard from './LoadCard';
import LoadChart from './LoadChart';
import CurrentCard from './CurrentCard';
import CurrentChart from './CurrentChart';
import UnifiedSensorView from './UnifiedSensorView';

interface SensorCarouselProps {
  temperatureData: TemperatureReading[];
  currentTemp: number;
  minThreshold: number;
  maxThreshold: number;
}

const SensorCarousel = ({ temperatureData, currentTemp, minThreshold, maxThreshold }: SensorCarouselProps) => {
  const [vibrationData, setVibrationData] = useState<VibrationReading[]>([]);
  const [currentVibration, setCurrentVibration] = useState({ axisX: 0, axisY: 0, axisZ: 0, rms: 0 });
  const [loadData, setLoadData] = useState<LoadReading[]>([]);
  const [currentLoad, setCurrentLoad] = useState({ currentLoad: 0, loadPercentage: 0 });
  const [currentData, setCurrentData] = useState<CurrentReading[]>([]);
  const [currentCurrent, setCurrentCurrent] = useState({ motorCurrent: 0, power: 0 });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'unified' | 'detailed'>('unified');
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  

  useEffect(() => {
    // Initialize all sensor data
    const initialVibrationData = generateVibrationMockData();
    const initialLoadData = generateLoadMockData();
    const initialCurrentData = generateCurrentMockData();
    
    setVibrationData(initialVibrationData);
    setLoadData(initialLoadData);
    setCurrentData(initialCurrentData);
    
    const latestVibration = initialVibrationData[initialVibrationData.length - 1];
    const latestLoad = initialLoadData[initialLoadData.length - 1];
    const latestCurrent = initialCurrentData[initialCurrentData.length - 1];
    
    if (latestVibration) {
      setCurrentVibration({
        axisX: latestVibration.axisX,
        axisY: latestVibration.axisY,
        axisZ: latestVibration.axisZ,
        rms: latestVibration.rms
      });
    }
    
    if (latestLoad) {
      setCurrentLoad({
        currentLoad: latestLoad.currentLoad,
        loadPercentage: latestLoad.loadPercentage
      });
    }
    
    if (latestCurrent) {
      setCurrentCurrent({
        motorCurrent: latestCurrent.motorCurrent,
        power: latestCurrent.power
      });
    }

    // Simulate real-time updates for all sensors
    const interval = setInterval(() => {
      const newVibrationReading: VibrationReading = {
        timestamp: new Date(),
        axisX: 0.5 + Math.sin(Date.now() * 0.001) * 0.3 + (Math.random() * 0.2 - 0.1),
        axisY: 0.4 + Math.cos(Date.now() * 0.0015) * 0.2 + (Math.random() * 0.15 - 0.075),
        axisZ: 0.3 + Math.sin(Date.now() * 0.0025) * 0.25 + (Math.random() * 0.1 - 0.05),
        frequency: 50 + Math.sin(Date.now() * 0.001) * 10 + (Math.random() * 20 - 10),
        amplitude: 1.2 + Math.sin(Date.now() * 0.001) * 0.8 + (Math.random() * 0.3 - 0.15),
        rms: 0.8 + Math.sin(Date.now() * 0.0012) * 0.4 + (Math.random() * 0.2 - 0.1)
      };

      const baseLoad = 200 + Math.sin(Date.now() * 0.001) * 150 + (Math.random() * 100 - 50);
      const currentLoadValue = Math.max(0, Math.min(800, baseLoad));
      const newLoadReading: LoadReading = {
        timestamp: new Date(),
        currentLoad: Number(currentLoadValue.toFixed(1)),
        maxCapacity: 800,
        loadPercentage: Number(((currentLoadValue / 800) * 100).toFixed(1)),
        distributionFactor: Number((0.8 + Math.random() * 0.4).toFixed(2))
      };

      const motorCurrent = 8 + Math.sin(Date.now() * 0.0015) * 3 + (Math.random() * 2 - 1);
      const voltage = 220 + (Math.random() * 10 - 5);
      const power = motorCurrent * voltage * 0.85;
      const newCurrentReading: CurrentReading = {
        timestamp: new Date(),
        motorCurrent: Number(motorCurrent.toFixed(2)),
        totalCurrent: Number((motorCurrent * 1.15).toFixed(2)),
        voltage: Number(voltage.toFixed(1)),
        power: Number(power.toFixed(0)),
        powerFactor: Number((0.85 + Math.random() * 0.1).toFixed(2)),
        efficiency: Number((85 + Math.random() * 10).toFixed(1))
      };

      setVibrationData(prev => [...prev.slice(-47), newVibrationReading]);
      setLoadData(prev => [...prev.slice(-47), newLoadReading]);
      setCurrentData(prev => [...prev.slice(-47), newCurrentReading]);
      
      setCurrentVibration({
        axisX: newVibrationReading.axisX,
        axisY: newVibrationReading.axisY,
        axisZ: newVibrationReading.axisZ,
        rms: newVibrationReading.rms
      });
      
      setCurrentLoad({
        currentLoad: newLoadReading.currentLoad,
        loadPercentage: newLoadReading.loadPercentage
      });
      
      setCurrentCurrent({
        motorCurrent: newCurrentReading.motorCurrent,
        power: newCurrentReading.power
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // All sensor calculations
  const temperatureStatistics = calculateStatistics(temperatureData);
  const temperatureAlerts = generateAlerts(temperatureData, minThreshold, maxThreshold);
  const temperatureChartData = formatChartData(temperatureData);

  const vibrationStatistics = calculateVibrationStatistics(vibrationData);
  const vibrationAlerts = generateVibrationAlerts(vibrationData);
  const vibrationChartData = formatVibrationChartData(vibrationData);

  const loadStatistics = calculateLoadStatistics(loadData);
  const loadAlerts = generateLoadAlerts(loadData);
  const loadChartData = formatLoadChartData(loadData);

  const currentStatistics = calculateCurrentStatistics(currentData);
  const currentAlerts = generateCurrentAlerts(currentData);
  const currentChartData = formatCurrentChartData(currentData);

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

  const handleDetailView = (sensorId: string) => {
    setSelectedSensor(sensorId);
    setViewMode('detailed');
  };

  const handleBackToUnified = () => {
    setViewMode('unified');
    setSelectedSensor(null);
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
    },
    {
      id: 'load',
      name: 'Sensor de Carga',
      icon: <Weight className="h-5 w-5" />,
      status: currentLoad.loadPercentage > 90 ? 'alert' : 'normal',
      content: (
        <div className="space-y-6">
          {/* Load Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <LoadCard
              title="Carga Atual"
              value={currentLoad.currentLoad}
              unit=" kg"
              icon="weight"
            />
            <LoadCard
              title="Percentual"
              value={currentLoad.loadPercentage}
              unit="%"
              icon="weight"
            />
            <LoadCard
              title="Carga Máxima"
              value={loadStatistics.maxLoad}
              unit=" kg"
              icon="weight"
            />
            <LoadCard
              title="Utilização Média"
              value={loadStatistics.utilizationRate}
              unit="%"
              icon="weight"
            />
          </div>

          {/* Chart and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LoadChart data={loadChartData} />
            <AlertsPanel alerts={loadAlerts.map((alert, index) => ({
              id: index + 1,
              type: alert.type,
              message: alert.message,
              timestamp: alert.timestamp,
              temperature: 0
            }))} />
          </div>

          {/* Statistics and Export */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Carga</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Carga Média:</span>
                    <span className="font-medium">{loadStatistics.avgLoad} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pico de Utilização:</span>
                    <span className="font-medium">{loadStatistics.peakUsage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eventos de Sobrecarga:</span>
                    <span className="font-medium">{loadStatistics.overloadEvents}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <ExportPanel
              onExportPDF={handleExportPDF}
              onExportCSV={handleExportCSV}
              lastExport={lastUpdate}
            />
          </div>
        </div>
      )
    },
    {
      id: 'current',
      name: 'Sensor de Corrente',
      icon: <Zap className="h-5 w-5" />,
      status: currentCurrent.motorCurrent > 12 ? 'alert' : 'normal',
      content: (
        <div className="space-y-6">
          {/* Current Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <CurrentCard
              title="Corrente Motor"
              value={currentCurrent.motorCurrent}
              unit=" A"
              icon="zap"
            />
            <CurrentCard
              title="Potência"
              value={currentCurrent.power}
              unit=" W"
              icon="zap"
            />
            <CurrentCard
              title="Corrente Média"
              value={currentStatistics.avgCurrent}
              unit=" A"
              icon="zap"
            />
            <CurrentCard
              title="Eficiência"
              value={currentStatistics.efficiency}
              unit="%"
              icon="zap"
            />
          </div>

          {/* Chart and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CurrentChart data={currentChartData} />
            <AlertsPanel alerts={currentAlerts.map((alert, index) => ({
              id: index + 1,
              type: alert.type,
              message: alert.message,
              timestamp: alert.timestamp,
              temperature: 0
            }))} />
          </div>

          {/* Statistics and Export */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Corrente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Corrente Máxima:</span>
                    <span className="font-medium">{currentStatistics.maxCurrent} A</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potência Média:</span>
                    <span className="font-medium">{currentStatistics.avgPower} W</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consumo Diário:</span>
                    <span className="font-medium">{currentStatistics.energyConsumption} kWh</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <ExportPanel
              onExportPDF={handleExportPDF}
              onExportCSV={handleExportCSV}
              lastExport={lastUpdate}
            />
          </div>
        </div>
      )
    }
  ];

  // Show unified view if in unified mode
  if (viewMode === 'unified') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6" />
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Painel de Monitoramento Multi-Sensor
                  </CardTitle>
                  <p className="text-gray-600">
                    Sistema integrado de monitoramento completo
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setViewMode('detailed')}
              >
                Ver Detalhes Individuais
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <UnifiedSensorView
              temperatureData={temperatureChartData}
              vibrationData={vibrationChartData}
              loadData={loadChartData}
              currentData={currentChartData}
              onDetailView={handleDetailView}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show detailed view
  const selectedSensorData = selectedSensor 
    ? sensors.find(s => s.id === selectedSensor)
    : sensors[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-6 w-6" />
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {selectedSensorData?.name || 'Sensor Detalhado'}
                </CardTitle>
                <p className="text-gray-600">
                  Análise detalhada do sensor selecionado
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleBackToUnified}
            >
              Voltar à Visão Geral
            </Button>
          </div>
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