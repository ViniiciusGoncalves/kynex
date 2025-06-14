
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLine } from "lucide-react";

interface StatisticsData {
  average: number;
  standardDeviation: number;
  minimum: number;
  maximum: number;
  readingsCount: number;
}

interface StatisticsPanelProps {
  statistics: StatisticsData;
  period: string;
}

const StatisticsPanel = ({ statistics, period }: StatisticsPanelProps) => {
  const formatValue = (value: number) => value.toFixed(2);

  const getVariabilityLevel = (stdDev: number) => {
    if (stdDev < 1) return { level: 'Baixa', color: 'text-green-600' };
    if (stdDev < 3) return { level: 'Moderada', color: 'text-yellow-600' };
    return { level: 'Alta', color: 'text-red-600' };
  };

  const variability = getVariabilityLevel(statistics.standardDeviation);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <ChartLine className="h-5 w-5" />
          Estatísticas - {period}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Temperatura Média</div>
              <div className="text-xl font-bold text-blue-800">
                {formatValue(statistics.average)}°C
              </div>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Desvio Padrão</div>
              <div className="text-xl font-bold text-purple-800">
                {formatValue(statistics.standardDeviation)}°C
              </div>
              <div className={`text-xs mt-1 ${variability.color}`}>
                Variabilidade: {variability.level}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-sm text-red-600 font-medium">Máxima</div>
              <div className="text-xl font-bold text-red-800">
                {formatValue(statistics.maximum)}°C
              </div>
            </div>
            
            <div className="p-3 bg-cyan-50 rounded-lg">
              <div className="text-sm text-cyan-600 font-medium">Mínima</div>
              <div className="text-xl font-bold text-cyan-800">
                {formatValue(statistics.minimum)}°C
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Total de Leituras</div>
          <div className="text-lg font-semibold text-gray-800">
            {statistics.readingsCount} registros
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsPanel;
