import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, XCircle } from "lucide-react";
import { VibrationAlert } from "@/utils/vibrationUtils";

interface VibrationAlertsPanelProps {
  alerts: VibrationAlert[];
  className?: string;
}

const VibrationAlertsPanel = ({ alerts, className }: VibrationAlertsPanelProps) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'critical':
        return 'destructive' as const;
      case 'warning':
        return 'secondary' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertas de Vibração
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum alerta de vibração ativo</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getAlertVariant(alert.type)}>
                      {alert.type === 'critical' ? 'Crítico' : 
                       alert.type === 'warning' ? 'Alerta' : 'Info'}
                    </Badge>
                    {alert.axis && (
                      <Badge variant="outline" className="text-xs">
                        Eixo {alert.axis}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{alert.message}</p>
                  <p className="text-xs text-gray-500">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VibrationAlertsPanel;