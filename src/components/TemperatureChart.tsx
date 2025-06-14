
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TemperatureData {
  time: string;
  temperature: number;
  timestamp: Date;
}

interface TemperatureChartProps {
  data: TemperatureData[];
  minThreshold: number;
  maxThreshold: number;
}

const TemperatureChart = ({ data, minThreshold, maxThreshold }: TemperatureChartProps) => {
  const formatTooltip = (value: any, name: string) => {
    if (name === 'temperature') {
      return [`${value.toFixed(1)}°C`, 'Temperatura'];
    }
    return [value, name];
  };

  const formatLabel = (label: string) => {
    return `Horário: ${label}`;
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Temperatura ao Longo do Tempo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="time" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                domain={['dataMin - 2', 'dataMax + 2']}
                tickFormatter={(value) => `${value}°C`}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={formatLabel}
                contentStyle={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <ReferenceLine 
                y={maxThreshold} 
                stroke="#ef4444" 
                strokeDasharray="5 5"
                label={{ value: `Máx: ${maxThreshold}°C`, position: "right" }}
              />
              <ReferenceLine 
                y={minThreshold} 
                stroke="#3b82f6" 
                strokeDasharray="5 5"
                label={{ value: `Mín: ${minThreshold}°C`, position: "right" }}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: '#059669' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureChart;
