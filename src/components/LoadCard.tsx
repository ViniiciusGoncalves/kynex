import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Weight } from "lucide-react";

interface LoadCardProps {
  title: string;
  value: number;
  unit: string;
  icon?: 'weight' | 'normal';
  trend?: 'up' | 'down' | 'stable';
}

const LoadCard = ({ title, value, unit, icon = 'normal', trend = 'stable' }: LoadCardProps) => {
  const getIcon = () => {
    return <Weight className="h-4 w-4" />;
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            {value.toFixed(1)}{unit}
          </div>
          <div className={`flex items-center ${getTrendColor()}`}>
            {getTrendIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadCard;