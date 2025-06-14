
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellRing } from "lucide-react";

interface Alert {
  id: number;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: Date;
  temperature: number;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel = ({ alerts }: AlertsPanelProps) => {
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <BellRing className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Bell className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alertas Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {alerts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Nenhum alerta registrado
            </p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getAlertColor(alert.type)}>
                      {alert.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Temperatura: {alert.temperature.toFixed(1)}°C
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

export default AlertsPanel;
