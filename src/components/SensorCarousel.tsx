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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Thermometer, Activity, Eye, Weight, Zap, ThermometerSnowflake, ThermometerSun, AlertCircle, TrendingUp, TrendingDown, ArrowRight, FileDown, Clock } from "lucide-react";

// --- INÍCIO: FUNÇÕES UTILITÁRIAS ---

// --- temperatureUtils ---
/**
 * Carrega dinamicamente o script da biblioteca jsPDF a partir de um CDN.
 * Retorna uma promessa que é resolvida quando o script é carregado com sucesso.
 * Evita adicionar o script múltiplas vezes.
 */
const loadJsPdfScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Se a biblioteca já está carregada no window, resolve imediatamente.
        if ((window as any).jspdf) {
            return resolve();
        }
        // Se a tag do script já existe no DOM, aguarda seu carregamento.
        const existingScript = document.getElementById('jspdf-script');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve());
            existingScript.addEventListener('error', () => reject(new Error("Falha ao carregar o script jsPDF.")));
            return;
        }
        // Cria e adiciona a tag do script ao head do documento.
        const script = document.createElement('script');
        script.id = 'jspdf-script';
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Falha ao carregar o script jsPDF."));
        document.head.appendChild(script);
    });
};

const exportToPDF = async (statistics: ApiStatistics) => {
    try {
        await loadJsPdfScript();
        // A biblioteca jsPDF anexa-se ao objeto 'window'. Acessamos o construtor a partir dele.
        const { jsPDF } = (window as any).jspdf;

        if (!jsPDF) {
            alert("A biblioteca de exportação de PDF não pôde ser inicializada.");
            console.error("jsPDF não encontrado no objeto window após a tentativa de carregamento.");
            return;
        }

        const doc = new jsPDF();
        doc.text("Relatório de Temperatura", 14, 16);
        doc.setFontSize(12);
        doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 24);
        
        doc.text(`- Temperatura Média: ${statistics.average.toFixed(1)}°C`, 14, 32);
        doc.text(`- Temperatura Máxima: ${statistics.maximum.toFixed(1)}°C`, 14, 40);
        doc.text(`- Temperatura Mínima: ${statistics.minimum.toFixed(1)}°C`, 14, 48);
        doc.text(`- Última Leitura: ${statistics.latest.toFixed(1)}°C`, 14, 56);
        
        doc.save("relatorio_temperatura.pdf");
    } catch (error) {
        console.error("Erro ao exportar para PDF:", error);
        alert("Ocorreu um erro ao gerar o PDF. Verifique o console para mais detalhes.");
    }
};

const exportToCSV = (data: { timestamp: Date; temperature: number; }[], statistics: ApiStatistics) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Timestamp,Temperatura (°C)\r\n";
  
  data.forEach(row => {
    csvContent += `${row.timestamp.toISOString()},${row.temperature}\r\n`;
  });

  csvContent += "\r\nEstatísticas\r\n";
  csvContent += `Média,${statistics.average.toFixed(1)}\r\n`;
  csvContent += `Máxima,${statistics.maximum.toFixed(1)}\r\n`;
  csvContent += `Mínima,${statistics.minimum.toFixed(1)}\r\n`;

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "dados_temperatura.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


// --- vibrationUtils ---
interface VibrationReading { timestamp: Date; axisX: number; axisY: number; axisZ: number; frequency: number; amplitude: number; rms: number; }
const generateVibrationMockData = (): VibrationReading[] => Array.from({ length: 48 }, (_, i) => ({ timestamp: new Date(Date.now() - (47 - i) * 30000), axisX: 0.5 + Math.sin(i * 0.5) * 0.2 + (Math.random() - 0.5) * 0.1, axisY: 0.4 + Math.cos(i * 0.5) * 0.15 + (Math.random() - 0.5) * 0.1, axisZ: 0.3 + Math.sin(i * 0.7) * 0.1 + (Math.random() - 0.5) * 0.05, frequency: 50 + (Math.random() - 0.5) * 10, amplitude: 1.2 + (Math.random() - 0.5) * 0.5, rms: 0.8 + (Math.random() - 0.5) * 0.2 }));
const calculateVibrationStatistics = (data: VibrationReading[]) => ({ healthScore: 85 + (Math.random() * 10 - 5), peakFrequency: 51.2, spectralPurity: 92.1, crestFactor: 1.4 });
const generateVibrationAlerts = (data: VibrationReading[]) => [{ type: 'warning', message: 'Pico de vibração detectado no eixo X.', timestamp: new Date() }];
const formatVibrationChartData = (data: VibrationReading[]) => data.map(d => ({ time: d.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), rms: d.rms, axisX: d.axisX, axisY: d.axisY, axisZ: d.axisZ }));

// --- loadUtils ---
interface LoadReading { timestamp: Date; currentLoad: number; maxCapacity: number; loadPercentage: number; distributionFactor: number; }
const generateLoadMockData = (): LoadReading[] => Array.from({ length: 48 }, (_, i) => ({ timestamp: new Date(Date.now() - (47 - i) * 30000), currentLoad: 450 + Math.sin(i * 0.4) * 100, maxCapacity: 800, loadPercentage: (450 + Math.sin(i * 0.4) * 100) / 8, distributionFactor: 0.9 }));
const calculateLoadStatistics = (data: LoadReading[]) => ({ avgLoad: 455, maxLoad: 550, utilizationRate: 56.8, overloadEvents: 0, peakUsage: 68.75 });
const generateLoadAlerts = (data: LoadReading[]) => [];
const formatLoadChartData = (data: LoadReading[]) => data.map(d => ({ time: d.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), load: d.currentLoad }));

// --- currentUtils ---
interface CurrentReading { timestamp: Date; motorCurrent: number; totalCurrent: number; voltage: number; power: number; powerFactor: number; efficiency: number; }
const generateCurrentMockData = (): CurrentReading[] => Array.from({ length: 48 }, (_, i) => ({ timestamp: new Date(Date.now() - (47 - i) * 30000), motorCurrent: 8.5 + Math.cos(i * 0.6) * 1.5, totalCurrent: 9.8, voltage: 220, power: 1870, powerFactor: 0.88, efficiency: 91 }));
const calculateCurrentStatistics = (data: CurrentReading[]) => ({ avgCurrent: 8.5, maxCurrent: 10.1, avgPower: 1870, energyConsumption: 44.8, efficiency: 91 });
const generateCurrentAlerts = (data: CurrentReading[]) => [{ type: 'info', message: 'Corrente operando dentro do normal.', timestamp: new Date() }];
const formatCurrentChartData = (data: CurrentReading[]) => data.map(d => ({ time: d.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), current: d.motorCurrent, power: d.power }));

// --- FIM: FUNÇÕES UTILITÁRIAS ---


// --- INÍCIO: COMPONENTES INTERNOS ---

const TemperatureCard = ({ title, value, unit, icon, trend, className }: { title: string; value: number; unit: string; icon: 'normal' | 'cold' | 'hot'; trend?: 'up' | 'down' | 'stable'; className?: string; }) => {
  const getIcon = () => {
    switch (icon) {
      case 'cold': return <ThermometerSnowflake className="h-6 w-6 text-blue-500" />;
      case 'hot': return <ThermometerSun className="h-6 w-6 text-red-500" />;
      default: return <Thermometer className="h-6 w-6 text-gray-600" />;
    }
  };
  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${className}`}><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>{getIcon()}</CardHeader><CardContent><div className="text-2xl font-bold text-gray-900">{value.toFixed(1)}{unit}</div>{trend && (<p className={`text-xs mt-1 ${trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-blue-500' : 'text-gray-500'}`}>{trend === 'up' ? '↗ Aumentando' : trend === 'down' ? '↘ Diminuindo' : '→ Estável'}</p>)}</CardContent></Card>
  );
};

const TemperatureChart = ({ data, minThreshold, maxThreshold }: { data: ApiChartData[]; minThreshold: number; maxThreshold: number; }) => (
  <Card className="col-span-2"><CardHeader><CardTitle className="text-lg font-semibold text-gray-800">Temperatura ao Longo do Tempo</CardTitle></CardHeader><CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" /><YAxis domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(value) => `${value}°C`} /><Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)}°C`, 'Temperatura']} /><ReferenceLine y={maxThreshold} label={`Máx: ${maxThreshold}°C`} stroke="red" strokeDasharray="3 3" /><ReferenceLine y={minThreshold} label={`Mín: ${minThreshold}°C`} stroke="blue" strokeDasharray="3 3" /><Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer></div></CardContent></Card>
);

const AlertsPanel = ({ alerts }: { alerts: {id: number; type: string; message: string; timestamp: Date; temperature: number }[] }) => (
    <Card><CardHeader><CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800"><AlertCircle className="h-5 w-5 text-yellow-500" />Alertas Recentes</CardTitle></CardHeader><CardContent><ul className="space-y-3">{alerts.length > 0 ? alerts.map((alert) => (<li key={alert.id} className="flex items-start gap-3"><div className={`mt-1 h-2 w-2 rounded-full ${alert.type === 'hot' ? 'bg-red-500' : 'bg-blue-400'}`}></div><div><p className="text-sm font-medium text-gray-700">{alert.message}</p><p className="text-xs text-gray-500">{alert.timestamp.toLocaleTimeString()}</p></div></li>)) : (<p className="text-sm text-gray-500">Nenhum alerta nas últimas 24 horas.</p>)}</ul></CardContent></Card>
);

const StatisticsPanel = ({ statistics, period }: { statistics: ApiStatistics; period: string; }) => (
    <Card><CardHeader><CardTitle>Estatísticas ({period})</CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="flex justify-between items-center"><span className="text-gray-600">Média</span><span className="font-bold text-lg">{statistics.average.toFixed(1)}°C</span></div><div className="flex justify-between items-center"><span className="text-gray-600">Máxima</span><span className="font-bold text-lg text-red-500">{statistics.maximum.toFixed(1)}°C</span></div><div className="flex justify-between items-center"><span className="text-gray-600">Mínima</span><span className="font-bold text-lg text-blue-500">{statistics.minimum.toFixed(1)}°C</span></div></div></CardContent></Card>
);

const VibrationCard = ({ title, value, unit }: { title: string; value: number; unit: string; icon: string; trend?: 'up' | 'down' | 'stable'; }) => (
    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle><Activity/></CardHeader><CardContent><div className="text-2xl font-bold">{value.toFixed(2)}{unit}</div></CardContent></Card>
);

const VibrationChart = ({ data }: { data: any[] }) => (<Card className="col-span-2"><CardHeader><CardTitle>Vibração RMS</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={data}><CartesianGrid/><XAxis dataKey="time"/><YAxis/><Tooltip/><Line type="monotone" dataKey="rms" stroke="#82ca9d" /></LineChart></ResponsiveContainer></CardContent></Card>);
const VibrationAlertsPanel = ({ alerts }: { alerts: any[] }) => (<Card><CardHeader><CardTitle>Alertas de Vibração</CardTitle></CardHeader><CardContent>{alerts.map((a,i)=><p key={i}>{a.message}</p>)}</CardContent></Card>);
const VibrationStatisticsPanel = ({ statistics }: { statistics: any; period: string }) => (<Card><CardHeader><CardTitle>Estatísticas de Vibração</CardTitle></CardHeader><CardContent><p>Pontuação de Saúde: {statistics.healthScore.toFixed(1)}</p></CardContent></Card>);

const ExportPanel = ({ onExportPDF, onExportCSV, lastExport }: { onExportPDF: () => void; onExportCSV: () => void; lastExport: Date; }) => (
    <Card><CardHeader><CardTitle>Exportar Dados</CardTitle></CardHeader><CardContent><div className="flex flex-col gap-4"><Button onClick={onExportPDF} variant="outline"><FileDown className="mr-2 h-4 w-4" />Exportar para PDF</Button><Button onClick={onExportCSV} variant="outline"><FileDown className="mr-2 h-4 w-4" />Exportar para CSV</Button></div><p className="text-xs text-gray-500 mt-4 flex items-center gap-1"><Clock className="h-3 w-3" />Última atualização: {lastExport.toLocaleTimeString()}</p></CardContent></Card>
);

const UnifiedSensorView = ({ onDetailView, temperatureData, vibrationData, loadData, currentData }: { onDetailView: (id: string) => void; temperatureData: any[]; vibrationData: any[]; loadData: any[]; currentData: any[];}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card onClick={() => onDetailView('temperature')} className="cursor-pointer hover:bg-gray-50 transition-all">
            <CardHeader><CardTitle className="text-base">Temperatura</CardTitle></CardHeader>
            <CardContent className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={temperatureData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card onClick={() => onDetailView('vibration')} className="cursor-pointer hover:bg-gray-50 transition-all">
            <CardHeader><CardTitle className="text-base">Vibração</CardTitle></CardHeader>
            <CardContent className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vibrationData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <Line type="monotone" dataKey="rms" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card onClick={() => onDetailView('load')} className="cursor-pointer hover:bg-gray-50 transition-all">
            <CardHeader><CardTitle className="text-base">Carga</CardTitle></CardHeader>
            <CardContent className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={loadData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <Line type="monotone" dataKey="load" stroke="#f97316" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card onClick={() => onDetailView('current')} className="cursor-pointer hover:bg-gray-50 transition-all">
            <CardHeader><CardTitle className="text-base">Corrente</CardTitle></CardHeader>
            <CardContent className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <Line type="monotone" dataKey="current" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
);


// --- FIM: COMPONENTES INTERNOS ---

// --- INTERFACES DA API ---
interface ApiChartData { time: string; temperature: number; timestamp: string; }
interface ApiStatistics { average: number; maximum: number; minimum: number; latest: number; }
interface ApiAlert { type: 'hot' | 'cold' | string; message: string; }
interface SensorCarouselProps { minThreshold: number; maxThreshold: number; }

const SensorCarousel = ({ minThreshold, maxThreshold }: SensorCarouselProps) => {
  // Estados para Temperatura (API)
  const [temperatureChartData, setTemperatureChartData] = useState<ApiChartData[]>([]);
  const [temperatureStatistics, setTemperatureStatistics] = useState<ApiStatistics>({ average: 0, maximum: 0, minimum: 0, latest: 0 });
  const [temperatureAlerts, setTemperatureAlerts] = useState<ApiAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para outros sensores (MOCK)
  const [vibrationData, setVibrationData] = useState<VibrationReading[]>([]);
  const [currentVibration, setCurrentVibration] = useState({ axisX: 0, axisY: 0, axisZ: 0, rms: 0 });
  const [loadData, setLoadData] = useState<LoadReading[]>([]);
  const [currentData, setCurrentData] = useState<CurrentReading[]>([]);

  // Estados de UI
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'unified' | 'detailed'>('unified');
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  
  // Efeito para buscar dados da API de Temperatura
  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/dados-temperatura');
        if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            setTemperatureChartData(data.chartData || []);
            setTemperatureStatistics(data.statistics || { average: 0, maximum: 0, minimum: 0, latest: 0 });
            setTemperatureAlerts(data.alerts || []);
            setError(null);
        } else {
            const text = await response.text();
            throw new Error(`A resposta não é um JSON válido. Resposta: ${text}`);
        }
      } catch (e) {
        if (e instanceof Error) {
            console.error("Falha ao buscar dados de temperatura:", e.message);
            setError("Não foi possível carregar os dados de temperatura.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemperatureData();
    const intervalId = setInterval(fetchTemperatureData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Efeito para gerar dados MOCK para outros sensores
  useEffect(() => {
    setVibrationData(generateVibrationMockData());
    setLoadData(generateLoadMockData());
    setCurrentData(generateCurrentMockData());
  }, []);

  // Cálculos para dados MOCK
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
    if (temperatureChartData.length < 2) return 'stable';
    const recent = temperatureChartData.slice(-3);
    const trend = recent[recent.length - 1].temperature - recent[0].temperature;
    if (trend > 0.5) return 'up';
    if (trend < -0.5) return 'down';
    return 'stable';
  };
  
  const handleExportPDF = () => exportToPDF(temperatureStatistics); 
  const handleExportCSV = () => {
     const formattedDataForCSV = temperatureChartData.map(d => ({ timestamp: new Date(d.timestamp), temperature: d.temperature }));
     exportToCSV(formattedDataForCSV, temperatureStatistics);
  };
  const handleDetailView = (sensorId: string) => { setSelectedSensor(sensorId); setViewMode('detailed'); };
  const handleBackToUnified = () => { setViewMode('unified'); setSelectedSensor(null); };

  const sensors = [
    {
      id: 'temperature',
      name: 'Sensor de Temperatura',
      icon: <Thermometer className="h-5 w-5" />,
      status: temperatureStatistics.latest > maxThreshold || temperatureStatistics.latest < minThreshold ? 'alert' : 'normal',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <TemperatureCard title="Temperatura Atual" value={temperatureStatistics.latest} unit="°C" icon={temperatureStatistics.latest > 30 ? 'hot' : temperatureStatistics.latest < 15 ? 'cold' : 'normal'} trend={getCurrentTempTrend()} />
            <TemperatureCard title="Temperatura Média" value={temperatureStatistics.average} unit="°C" icon="normal" />
            <TemperatureCard title="Máxima (24h)" value={temperatureStatistics.maximum} unit="°C" icon="hot" />
            <TemperatureCard title="Mínima (24h)" value={temperatureStatistics.minimum} unit="°C" icon="cold" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TemperatureChart data={temperatureChartData} minThreshold={minThreshold} maxThreshold={maxThreshold} />
            <AlertsPanel alerts={temperatureAlerts.map((alert, index) => ({ id: index + 1, type: alert.type, message: alert.message, timestamp: new Date(), temperature: temperatureStatistics.latest }))} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatisticsPanel statistics={temperatureStatistics} period="Últimas 24 horas" />
            <ExportPanel onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} lastExport={lastUpdate}/>
          </div>
        </div>
      )
    },
    {
      id: 'vibration',
      name: 'Análise de Vibração',
      icon: <Activity className="h-5 w-5" />,
      status: (vibrationStatistics.healthScore as number) < 60 ? 'alert' : 'normal',
      content: (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <VibrationCard title="RMS Atual" value={currentVibration.rms} unit=" g" icon="activity" />
                <VibrationCard title="Vibração Eixo X" value={currentVibration.axisX} unit=" g" icon="activity" />
                <VibrationCard title="Vibração Eixo Y" value={currentVibration.axisY} unit=" g" icon="activity" />
                <VibrationCard title="Vibração Eixo Z" value={currentVibration.axisZ} unit=" g" icon="activity" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <VibrationChart data={vibrationChartData} />
                <VibrationAlertsPanel alerts={vibrationAlerts} />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VibrationStatisticsPanel statistics={vibrationStatistics} period="Últimas 24 horas" />
                <ExportPanel onExportPDF={() => {}} onExportCSV={() => {}} lastExport={lastUpdate}/>
            </div>
        </div>
      )
    },
    {
        id: 'load',
        name: 'Sensor de Carga',
        icon: <Weight className="h-5 w-5" />,
        status: 'normal',
        content: <div>Dados do Sensor de Carga Aqui</div>
    },
    {
        id: 'current',
        name: 'Sensor de Corrente',
        icon: <Zap className="h-5 w-5" />,
        status: 'normal',
        content: <div>Dados do Sensor de Corrente Aqui</div>
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
