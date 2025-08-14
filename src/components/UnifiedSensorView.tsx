import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grid3X3, Maximize2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UnifiedSensorViewProps {
  temperatureData: any[];
  vibrationData: any[];
  loadData: any[];
  currentData: any[];
  onDetailView: (sensor: string) => void;
}

const UnifiedSensorView = ({ 
  temperatureData, 
  vibrationData, 
  loadData, 
  currentData,
  onDetailView 
}: UnifiedSensorViewProps) => {
  const sensors = [
    {
      id: 'temperature',
      name: 'Temperatura',
      data: temperatureData,
      color: '#8884d8',
      unit: '°C',
      dataKey: 'Temperatura',
      status: 'normal'
    },
    {
      id: 'vibration',
      name: 'Vibração RMS',
      data: vibrationData,
      color: '#82ca9d',
      unit: 'g',
      dataKey: 'RMS',
      status: 'normal'
    },
    {
      id: 'load',
      name: 'Carga',
      data: loadData,
      color: '#ffc658',
      unit: 'kg',
      dataKey: 'Carga Atual',
      status: 'normal'
    },
    {
      id: 'current',
      name: 'Corrente',
      data: currentData,
      color: '#ff7300',
      unit: 'A',
      dataKey: 'Corrente Motor',
      status: 'normal'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            <CardTitle className="text-lg font-semibold text-gray-800">
              Visão Geral - Todos os Sensores
            </CardTitle>
          </div>
          <Badge variant="outline">
            4 Sensores Ativos
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sensors.map((sensor) => (
            <div key={sensor.id} className="relative">
              <Card className="h-64">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {sensor.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDetailView(sensor.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Maximize2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={sensor.data.slice(-20)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={sensor.dataKey}
                        stroke={sensor.color}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedSensorView;