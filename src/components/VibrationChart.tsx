import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VibrationChartProps {
  data: any[];
  className?: string;
}

const VibrationChart = ({ data, className }: VibrationChartProps) => {
  return (
    <Card className={`lg:col-span-2 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Análise de Vibração Triaxial
        </CardTitle>
        <p className="text-sm text-gray-600">
          Monitoramento em tempo real dos eixos X, Y e Z
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              fontSize={12}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              fontSize={12}
              tick={{ fill: '#6b7280' }}
              domain={[0, 'dataMax + 0.2']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Eixo X" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="Eixo Y" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="Eixo Z" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="RMS" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VibrationChart;