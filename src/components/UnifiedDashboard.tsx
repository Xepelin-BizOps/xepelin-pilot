import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const UnifiedDashboard = () => {
  const [dateFilter, setDateFilter] = useState('30days');

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
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
  );
};
