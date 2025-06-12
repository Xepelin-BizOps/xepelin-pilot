import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { QuoteCreationForm } from '@/components/QuoteCreationForm';
import { PaymentLinkForm } from '@/components/PaymentLinkForm';
import { Plus, FileText, Link, Bell } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface QuoteCreationProps {
  onClientClick: (client: any) => void;
  showCreationForm: boolean;
  onToggleCreation: (show: boolean) => void;
}

export const QuoteCreation: React.FC<QuoteCreationProps> = ({ onClientClick, showCreationForm, onToggleCreation }) => {
  const [showPaymentLinkForm, setShowPaymentLinkForm] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  const quotes = [
    {
      id: 'COT-2024-001',
      client: 'Tecnología Avanzada S.A.',
      date: '2024-06-10',
      amount: 32000,
      status: 'Pendiente',
      products: 3,
      isInvoiced: false
    },
    {
      id: 'COT-2024-002', 
      client: 'Innovación Digital S.C.',
      date: '2024-06-11',
      amount: 45600,
      status: 'Convertida',
      products: 5,
      isInvoiced: true
    },
    {
      id: 'COT-2024-003',
      client: 'Sistemas Corporativos',
      date: '2024-06-12', 
      amount: 18900,
      status: 'En Revisión',
      products: 2,
      isInvoiced: false
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

  const handlePaymentLinkClick = (quote: any) => {
    setSelectedQuote(quote);
    setShowPaymentLinkForm(true);
  };

  if (showCreationForm) {
    return <QuoteCreationForm onClose={() => onToggleCreation(false)} />;
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Quotes List */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cotizaciones Recientes</h3>
            <div className="flex space-x-2">
              <Input 
                placeholder="Buscar cotizaciones..." 
                className="w-64 bg-white border-gray-300 rounded-lg"
              />
              <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                Filtros
              </Button>
              <Button 
                onClick={() => onToggleCreation(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cotización
              </Button>
            </div>
          </div>

          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Productos</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Monto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-blue-600">{quote.id}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleClientClick(quote.client)}
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {quote.client}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{quote.date}</td>
                    <td className="py-3 px-4 text-gray-600">{quote.products} items</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">${quote.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={quote.status === 'Convertida' ? 'default' : 'secondary'}
                        className={quote.status === 'Convertida' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}
                      >
                        {quote.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                          Ver
                        </Button>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{quote.isInvoiced ? 'Editar Factura' : 'Facturar'}</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              onClick={() => handlePaymentLinkClick(quote)}
                            >
                              <Link className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Link de Pago</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              <Bell className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Recordatorio</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        {quote.status === 'Pendiente' && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Confirmar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Payment Link Form */}
        {showPaymentLinkForm && selectedQuote && (
          <PaymentLinkForm
            isOpen={showPaymentLinkForm}
            onClose={() => setShowPaymentLinkForm(false)}
            orderRef={selectedQuote.id}
            totalAmount={selectedQuote.amount}
          />
        )}
      </div>
    </TooltipProvider>
  );
};
