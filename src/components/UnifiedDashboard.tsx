import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCatalog } from '@/components/ProductCatalog';
import { ClientsList } from '@/components/ClientsList';
import { Users, FileSpreadsheet, X } from 'lucide-react';

export const UnifiedDashboard = () => {
  const [dateFilter, setDateFilter] = useState('30days');
  const [showClientsList, setShowClientsList] = useState(false);
  const [showProductCatalog, setShowProductCatalog] = useState(false);

  const kpis = [
    { label: 'Total Cotizado', value: '$2,450,000', subtext: 'MXN', change: '+12%' },
    { label: 'Total Vendido', value: '$1,850,000', subtext: 'MXN', change: '+8%' },
    { label: 'Por Cobrar', value: '$650,000', subtext: 'MXN', change: '-5%' },
    { label: 'Tasa Conversión', value: '75.5%', subtext: 'Cotiz → Venta', change: '+3%' },
    { label: 'Clientes Activos', value: '43', subtext: 'Este período', change: '+2' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Panel de Control</h2>
        <div className="flex items-center space-x-3">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40 bg-white border-gray-300 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              <SelectItem value="7days">Últimos 7 días</SelectItem>
              <SelectItem value="30days">Últimos 30 días</SelectItem>
              <SelectItem value="thismonth">Este mes</SelectItem>
              <SelectItem value="90days">Últimos 90 días</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl">
          {kpis.map((kpi, index) => (
            <Card key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-medium">{kpi.label}</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    kpi.change.includes('+') ? 'bg-blue-50 text-blue-600' : 
                    kpi.change.includes('-') ? 'bg-gray-100 text-gray-600' : 
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {kpi.change}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{kpi.subtext}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          className="bg-white border-gray-300"
          onClick={() => setShowClientsList(!showClientsList)}
        >
          <Users className="h-4 w-4 mr-2" />
          Clientes
        </Button>
        <Button 
          variant="outline" 
          className="bg-white border-gray-300"
          onClick={() => setShowProductCatalog(!showProductCatalog)}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Catálogo de Productos
        </Button>
      </div>

      {/* Clients List */}
      {showClientsList && (
        <div className="mt-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Lista de Clientes</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowClientsList(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ClientsList />
        </div>
      )}

      {/* Product Catalog */}
      {showProductCatalog && (
        <div className="mt-6">
          <ProductCatalog />
        </div>
      )}
    </div>
  );
};
