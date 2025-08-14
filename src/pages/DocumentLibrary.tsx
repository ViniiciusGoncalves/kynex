import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Download, Eye, Upload, Search, FolderOpen } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: 'manual' | 'diagram' | 'procedure' | 'safety';
  category: string;
  size: string;
  uploadDate: string;
  downloadCount: number;
}

const DocumentLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Manual Técnico - Elevador Atlas 2000',
      type: 'manual',
      category: 'Manuais Técnicos',
      size: '2.5 MB',
      uploadDate: '2025-01-10',
      downloadCount: 45
    },
    {
      id: '2',
      name: 'Diagrama Elétrico - Sistema de Controle',
      type: 'diagram',
      category: 'Diagramas',
      size: '1.8 MB',
      uploadDate: '2025-01-08',
      downloadCount: 32
    },
    {
      id: '3',
      name: 'Procedimento de Emergência',
      type: 'procedure',
      category: 'Procedimentos',
      size: '850 KB',
      uploadDate: '2025-01-05',
      downloadCount: 67
    },
    {
      id: '4',
      name: 'Normas de Segurança NBR 16042',
      type: 'safety',
      category: 'Segurança',
      size: '3.2 MB',
      uploadDate: '2025-01-03',
      downloadCount: 28
    },
    {
      id: '5',
      name: 'Guia de Solução de Problemas',
      type: 'manual',
      category: 'Manuais Técnicos',
      size: '1.5 MB',
      uploadDate: '2025-01-01',
      downloadCount: 89
    }
  ];

  const categories = [
    { value: 'all', label: 'Todos os Documentos' },
    { value: 'manual', label: 'Manuais Técnicos' },
    { value: 'diagram', label: 'Diagramas' },
    { value: 'procedure', label: 'Procedimentos' },
    { value: 'safety', label: 'Segurança' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'manual':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'diagram':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'procedure':
        return <FileText className="h-5 w-5 text-yellow-500" />;
      case 'safety':
        return <FileText className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'manual':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Manual</Badge>;
      case 'diagram':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Diagrama</Badge>;
      case 'procedure':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Procedimento</Badge>;
      case 'safety':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Segurança</Badge>;
      default:
        return <Badge variant="outline">Documento</Badge>;
    }
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Biblioteca de Documentos
              </h1>
              <p className="text-gray-600 mt-1">
                Acesso centralizado a manuais, diagramas e procedimentos
              </p>
            </div>
          </div>
          
          <Button className="mt-4 lg:mt-0">
            <Upload className="w-4 h-4 mr-2" />
            Upload Documento
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Documentos</p>
                  <p className="text-2xl font-bold">{mockDocuments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Download className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Downloads Totais</p>
                  <p className="text-2xl font-bold">{mockDocuments.reduce((acc, doc) => acc + doc.downloadCount, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FileText className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Manuais Técnicos</p>
                  <p className="text-2xl font-bold">{mockDocuments.filter(d => d.type === 'manual').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Docs. Segurança</p>
                  <p className="text-2xl font-bold">{mockDocuments.filter(d => d.type === 'safety').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(document.type)}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold truncate">
                        {document.name}
                      </CardTitle>
                      <p className="text-xs text-gray-500 mt-1">
                        {document.category}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tamanho:</span>
                    <span className="font-medium">{document.size}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Upload:</span>
                    <span className="font-medium">{new Date(document.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Downloads:</span>
                    <span className="font-medium">{document.downloadCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {getTypeBadge(document.type)}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      Visualizar
                    </Button>
                    <Button variant="default" size="sm" className="flex-1">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentLibrary;