import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, Waves } from "lucide-react";

interface VibrationCardProps {
  title: string;
  value: number;
  unit: string;
  icon: 'activity' | 'frequency' | 'amplitude';
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

const VibrationCard = ({ title, value, unit, icon, trend, className }: VibrationCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'frequency':
        return <Waves className="h-6 w-6 text-blue-500" />;
      case 'amplitude':
        return <Zap className="h-6 w-6 text-orange-500" />;
      default:
        return <Activity className="h-6 w-6 text-green-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-red-500';
      case 'down':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {value.toFixed(3)}{unit}
        </div>
        {trend && (
          <p className={`text-xs ${getTrendColor()} mt-1`}>
            {trend === 'up' && '↗ Aumentando'}
            {trend === 'down' && '↘ Diminuindo'}
            {trend === 'stable' && '→ Estável'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default VibrationCard;