import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Plus, Search, Calendar, User, Wrench } from "lucide-react";

interface MaintenanceRecord {
  id: string;
  date: string;
  technician: string;
  type: 'preventiva' | 'corretiva' | 'emergencial';
  description: string;
  partsReplaced: string[];
  timeSpent: number; // hours
  cost: number;
  status: 'concluída' | 'pendente' | 'em_andamento';
}

const MaintenanceHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newRecord, setNewRecord] = useState({
    technician: '',
    type: 'preventiva' as const,
    description: '',
    partsReplaced: '',
    timeSpent: 0,
    cost: 0
  });

  const mockRecords: MaintenanceRecord[] = [
    {
      id: '1',
      date: '2025-01-10',
      technician: 'João Silva',
      type: 'preventiva',
      description: 'Lubrificação dos cabos e inspeção geral',
      partsReplaced: ['Óleo lubrificante', 'Filtro de ar'],
      timeSpent: 3,
      cost: 450.00,
      status: 'concluída'
    },
    {
      id: '2',
      date: '2025-01-05',
      technician: 'Maria Santos',
      type: 'corretiva',
      description: 'Substituição do motor da porta',
      partsReplaced: ['Motor da porta', 'Relé de controle'],
      timeSpent: 5,
      cost: 1200.00,
      status: 'concluída'
    },
    {
      id: '3',
      date: '2025-01-14',
      technician: 'Carlos Oliveira',
      type: 'emergencial',
      description: 'Reparo urgente no sistema de frenagem',
      partsReplaced: ['Pastilhas de freio', 'Cabo de aço'],
      timeSpent: 8,
      cost: 2100.00,
      status: 'em_andamento'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluída':
        return <Badge variant="default">Concluída</Badge>;
      case 'em_andamento':
        return <Badge variant="secondary">Em Andamento</Badge>;
      case 'pendente':
        return <Badge variant="destructive">Pendente</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'preventiva':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Preventiva</Badge>;
      case 'corretiva':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Corretiva</Badge>;
      case 'emergencial':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Emergencial</Badge>;
      default:
        return <Badge variant="outline">Indefinido</Badge>;
    }
  };

  const filteredRecords = mockRecords.filter(record =>
    record.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <History className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Histórico de Manutenção
              </h1>
              <p className="text-gray-600 mt-1">
                Registro detalhado de todas as intervenções realizadas
              </p>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 lg:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Nova Manutenção
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Nova Manutenção</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="technician">Técnico Responsável</Label>
                  <Input 
                    id="technician"
                    value={newRecord.technician}
                    onChange={(e) => setNewRecord({...newRecord, technician: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description"
                    value={newRecord.description}
                    onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="parts">Peças Substituídas</Label>
                  <Input 
                    id="parts"
                    placeholder="Separadas por vírgula"
                    value={newRecord.partsReplaced}
                    onChange={(e) => setNewRecord({...newRecord, partsReplaced: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time">Tempo (horas)</Label>
                    <Input 
                      id="time"
                      type="number"
                      value={newRecord.timeSpent}
                      onChange={(e) => setNewRecord({...newRecord, timeSpent: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost">Custo (R$)</Label>
                    <Input 
                      id="cost"
                      type="number"
                      value={newRecord.cost}
                      onChange={(e) => setNewRecord({...newRecord, cost: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <Button className="w-full">Salvar Registro</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por técnico ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Manutenções</p>
                  <p className="text-2xl font-bold">{mockRecords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Técnicos Ativos</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Wrench className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Horas Trabalhadas</p>
                  <p className="text-2xl font-bold">{mockRecords.reduce((acc, r) => acc + r.timeSpent, 0)}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <span className="text-red-600 font-bold text-sm">R$</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Custo Total</p>
                  <p className="text-2xl font-bold">
                    R$ {mockRecords.reduce((acc, r) => acc + r.cost, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registros de Manutenção</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tempo</TableHead>
                  <TableHead>Custo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.technician}</TableCell>
                    <TableCell>{getTypeBadge(record.type)}</TableCell>
                    <TableCell className="max-w-xs truncate">{record.description}</TableCell>
                    <TableCell>{record.timeSpent}h</TableCell>
                    <TableCell>R$ {record.cost.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceHistory;