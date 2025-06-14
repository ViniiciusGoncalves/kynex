
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";

interface ExportPanelProps {
  onExportPDF: () => void;
  onExportCSV: () => void;
  lastExport?: Date;
}

const ExportPanel = ({ onExportPDF, onExportCSV, lastExport }: ExportPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Exportar Relatórios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={onExportPDF}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Exportar PDF
            </Button>
            <Button 
              onClick={onExportCSV}
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50"
            >
              Exportar CSV
            </Button>
          </div>
          
          {lastExport && (
            <div className="pt-3 border-t">
              <p className="text-xs text-gray-500">
                Último export: {lastExport.toLocaleString()}
              </p>
            </div>
          )}
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Conteúdo do Relatório:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Estatísticas completas do período</li>
              <li>• Gráfico de temperaturas</li>
              <li>• Histórico de alertas</li>
              <li>• Análise de tendências</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportPanel;
