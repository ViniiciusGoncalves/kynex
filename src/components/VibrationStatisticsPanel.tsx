import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Clock, Shield } from "lucide-react";
import { VibrationStatistics } from "@/utils/vibrationUtils";

interface VibrationStatisticsPanelProps {
  statistics: VibrationStatistics;
  period: string;
  className?: string;
}

const VibrationStatisticsPanel = ({ statistics, period, className }: VibrationStatisticsPanelProps) => {
  const getHealthBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, text: 'Excelente', color: 'text-green-600' };
    if (score >= 60) return { variant: 'secondary' as const, text: 'Bom', color: 'text-yellow-600' };
    if (score >= 40) return { variant: 'secondary' as const, text: 'Atenção', color: 'text-orange-600' };
    return { variant: 'destructive' as const, text: 'Crítico', color: 'text-red-600' };
  };

  const healthBadge = getHealthBadge(statistics.healthScore);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Estatísticas de Vibração
        </CardTitle>
        <p className="text-sm text-gray-600">{period}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-600">RMS Médio</div>
            <div className="text-lg font-bold text-gray-900">{statistics.avgRMS} g</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Amplitude Máxima</div>
            <div className="text-lg font-bold text-gray-900">{statistics.maxAmplitude} mm/s</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Freq. Dominante</div>
            <div className="text-lg font-bold text-gray-900">{statistics.dominantFrequency} Hz</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Saúde do Equipamento</div>
            <div className="flex items-center gap-2">
              <Badge variant={healthBadge.variant} className={healthBadge.color}>
                {healthBadge.text}
              </Badge>
              <span className="text-sm font-medium">{statistics.healthScore}%</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Saúde Geral</span>
            <span className="text-sm text-gray-500">{statistics.healthScore}%</span>
          </div>
          <Progress value={statistics.healthScore} className="h-2" />
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Manutenção Preditiva</span>
          </div>
          <p className="text-sm text-blue-700">
            Próxima manutenção recomendada em <strong>{statistics.predictedMaintenance} dias</strong>
          </p>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Status do Sistema</span>
          </div>
          <p className="text-sm text-green-700">
            Sistema operando dentro dos parâmetros normais
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VibrationStatisticsPanel;