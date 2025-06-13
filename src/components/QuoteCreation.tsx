import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { QuoteCreationForm } from '@/components/QuoteCreationForm';
import { MoreHorizontal, Plus, Send } from 'lucide-react';

interface QuoteCreationProps {
  onClientClick: (client: any) => void;
  showCreationForm: boolean;
  onToggleCreation: (show: boolean) => void;
  onOpenReminderPanel: () => void;
}

export const QuoteCreation: React.FC<QuoteCreationProps> = ({ 
  onClientClick, 
  showCreationForm, 
  onToggleCreation,
  onOpenReminderPanel 
}) => {
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);

  const quotes = [
    {
      id: 'COT-2024-001',
      client: 'Sistemas Corporativos',
      date: '2024-06-10',
      amount: 18900,
      status: 'Enviada',
      validUntil: '2024-06-24',
      items: 3
    },
    {
      id: 'COT-2024-002',
      client: 'Innovación Digital S.C.',
      date: '2024-06-11',
      amount: 45600,
      status: 'Aprobada',
      validUntil: '2024-06-25',
      items: 5
    },
    {
      id: 'COT-2024-003',
      client: 'Desarrollo Móvil Plus',
      date: '2024-06-11',
      amount: 28500,
      status: 'Pendiente',
      validUntil: '2024-06-25',
      items: 4
    },
    {
      id: 'COT-2024-004',
      client: 'Tecnología Avanzada S.A.',
      date: '2024-06-12',
      amount: 32000,
      status: 'Enviada',
      validUntil: '2024-06-26',
      items: 6
    },
    {
      id: 'COT-2024-005',
      client: 'Soluciones Web Pro',
      date: '2024-06-12',
      amount: 22100,
      status: 'Rechazada',
      validUntil: '2024-06-26',
      items: 3
    },
    {
      id: 'COT-2024-006',
      client: 'Tecnología Avanzada S.A.',
      date: '2024-06-13',
      amount: 15000,
      status: 'Pendiente',
      validUntil: '2024-06-27',
      items: 2
    }
  ];

  const handleClientClick = (clientName: string) => {
    onClientClick({
      name: clientName,
      quotes: 5,
      orders: 3,
      totalPaid: 125000,
      totalPending: 32000,
      lastActivity: '2024-06-12'
    });
  };

  const toggleQuoteSelection = (quoteId: string) => {
    setSelectedQuotes(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  const handleFollowUp = () => {
    onOpenReminderPanel();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Cotizaciones</h3>
          <div className="flex space-x-2">
            <Input 
              placeholder="Buscar cotizaciones..." 
              className="w-64 bg-white border-gray-400 rounded-lg focus:border-blue-500"
            />
            <Button 
              onClick={() => onToggleCreation(!showCreationForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cotización
            </Button>
          </div>
        </div>

        {selectedQuotes.length > 0 && (
          <div className="mb-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleFollowUp}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Seguimiento ({selectedQuotes.length})
            </Button>
          </div>
        )}

        <div className="overflow-hidden border border-gray-300 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 w-12">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-400"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedQuotes(quotes.map(q => q.id));
                      } else {
                        setSelectedQuotes([]);
                      }
                    }}
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">ID Cotización</th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">Monto</th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">Items</th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">Válida Hasta</th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {quotes.map((quote) => (
                <tr key={quote.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-400"
                      checked={selectedQuotes.includes(quote.id)}
                      onChange={() => toggleQuoteSelection(quote.id)}
                    />
                  </td>
                  <td className="py-3 px-4 font-medium text-blue-600">{quote.id}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleClientClick(quote.client)}
                      className="text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {quote.client}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{quote.date}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">${quote.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-700">{quote.items}</td>
                  <td className="py-3 px-4 text-gray-700">{quote.validUntil}</td>
                  <td className="py-3 px-4">
                    <Badge 
                      variant="secondary"
                      className={
                        quote.status === 'Aprobada' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        quote.status === 'Enviada' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                        quote.status === 'Pendiente' ? 'bg-gray-200 text-gray-700 border-gray-300' :
                        'bg-red-100 text-red-800 border-red-200'
                      }
                    >
                      {quote.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline" className="border-gray-400 text-gray-600 hover:bg-gray-50">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white border border-gray-300 rounded-lg shadow-lg">
                        <DropdownMenuItem className="hover:bg-gray-50 text-gray-700">Ver Detalles</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-50 text-gray-700">Duplicar</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-50 text-gray-700">Convertir a Orden</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-50 text-gray-700">Descargar PDF</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-50 text-gray-700">Enviar por Email</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quote Creation Form */}
      {showCreationForm && (
        <QuoteCreationForm onClose={() => onToggleCreation(false)} />
      )}
    </div>
  );
};
