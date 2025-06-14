
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, ThermometerSnowflake, ThermometerSun } from "lucide-react";

interface TemperatureCardProps {
  title: string;
  value: number;
  unit: string;
  icon: 'normal' | 'cold' | 'hot';
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

const TemperatureCard = ({ title, value, unit, icon, trend, className }: TemperatureCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'cold':
        return <ThermometerSnowflake className="h-6 w-6 text-blue-500" />;
      case 'hot':
        return <ThermometerSun className="h-6 w-6 text-red-500" />;
      default:
        return <Thermometer className="h-6 w-6 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-red-500';
      case 'down':
        return 'text-blue-500';
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
          {value.toFixed(1)}{unit}
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

export default TemperatureCard;
