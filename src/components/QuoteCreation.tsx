import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QuoteCreationForm } from '@/components/QuoteCreationForm';
import { PaymentLinkForm } from '@/components/PaymentLinkForm';
import { InvoiceForm } from '@/components/InvoiceForm';
import { MessageSelectionPanel } from '@/components/MessageSelectionPanel';
import { QuoteConfirmationDialog } from '@/components/QuoteConfirmationDialog';
import { Plus, FileText, Link, Send, MoreHorizontal, Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface QuoteCreationProps {
  onClientClick: (client: any) => void;
  showCreationForm: boolean;
  onToggleCreation: (show: boolean) => void;
}

export const QuoteCreation: React.FC<QuoteCreationProps> = ({ onClientClick, showCreationForm, onToggleCreation }) => {
  const [showPaymentLinkForm, setShowPaymentLinkForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showMessagePanel, setShowMessagePanel] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [showQuoteDetails, setShowQuoteDetails] = useState(false);
  const [editingQuote, setEditingQuote] = useState<any>(null);
  const { toast } = useToast();

  const [quotes, setQuotes] = useState([
    {
      id: 'COT-2024-001',
      client: 'Tecnología Avanzada S.A.',
      date: '2024-06-10',
      amount: 32000,
      status: 'En Revisión',
      products: 3,
      isInvoiced: false,
      items: [
        { id: 1, name: 'Laptop HP ProBook', quantity: 2, price: 15000, sku: 'PROD-HP-001' },
        { id: 2, name: 'Mouse inalámbrico', quantity: 1, price: 500, sku: 'PROD-MS-001' },
        { id: 3, name: 'Teclado mecánico', quantity: 1, price: 1500, sku: 'PROD-KB-001' }
      ]
    },
    {
      id: 'COT-2024-002', 
      client: 'Innovación Digital S.C.',
      date: '2024-06-11',
      amount: 45600,
      status: 'Confirmada',
      products: 5,
      isInvoiced: true,
      items: [
        { id: 4, name: 'Monitor 4K', quantity: 3, price: 12000, sku: 'PROD-MON-001' },
        { id: 5, name: 'Webcam HD', quantity: 2, price: 2800, sku: 'PROD-WEB-001' },
        { id: 6, name: 'Auriculares profesionales', quantity: 2, price: 4000, sku: 'PROD-AUD-001' }
      ]
    },
    {
      id: 'COT-2024-003',
      client: 'Sistemas Corporativos',
      date: '2024-06-12', 
      amount: 18900,
      status: 'Rechazada',
      products: 2,
      isInvoiced: false,
      items: [
        { id: 7, name: 'Impresora láser', quantity: 1, price: 8900, sku: 'PROD-PRT-001' },
        { id: 8, name: 'Papel de impresión', quantity: 10, price: 1000, sku: 'PROD-PPR-001' }
      ]
    },
    {
      id: 'COT-2024-004',
      client: 'Comercial Hernández S.A.',
      date: '2024-06-08',
      amount: 28500,
      status: 'Confirmada',
      products: 4,
      isInvoiced: true,
      items: [
        { id: 9, name: 'Servidor Dell PowerEdge', quantity: 1, price: 25000, sku: 'PROD-SRV-001' },
        { id: 10, name: 'Cable de red Cat6', quantity: 10, price: 350, sku: 'PROD-CBL-001' }
      ]
    },
    {
      id: 'COT-2024-005',
      client: 'Distribuidora Central',
      date: '2024-06-09',
      amount: 15800,
      status: 'Confirmada',
      products: 3,
      isInvoiced: true,
      items: [
        { id: 11, name: 'Router empresarial', quantity: 2, price: 6500, sku: 'PROD-RTR-001' },
        { id: 12, name: 'Switch 24 puertos', quantity: 1, price: 2800, sku: 'PROD-SWT-001' }
      ]
    },
    {
      id: 'COT-2024-006',
      client: 'Oficinas Modernas',
      date: '2024-06-13',
      amount: 22100,
      status: 'En Revisión',
      products: 6,
      isInvoiced: false,
      items: [
        { id: 13, name: 'Proyector 4K', quantity: 1, price: 18000, sku: 'PROD-PRJ-001' },
        { id: 14, name: 'Pantalla de proyección', quantity: 1, price: 4100, sku: 'PROD-SCR-001' }
      ]
    }
  ]);

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

  const handleInvoiceClick = (quote: any) => {
    setSelectedQuote(quote);
    setShowInvoiceForm(true);
  };

  const handleViewDetails = (quote: any) => {
    setSelectedQuote(quote);
    setShowQuoteDetails(true);
  };

  const handleConfirmQuote = (quote: any) => {
    setSelectedQuote(quote);
    setShowConfirmationDialog(true);
  };

  const handleQuoteConfirmed = (updatedQuote: any) => {
    setQuotes(prevQuotes => 
      prevQuotes.map(q => 
        q.id === updatedQuote.id 
          ? updatedQuote
          : q
      )
    );
    
    console.log('Cotización confirmada con todos los detalles:', updatedQuote);
    setShowConfirmationDialog(false);
  };

  const handleDeleteQuote = (quote: any) => {
    setQuotes(prevQuotes => prevQuotes.filter(q => q.id !== quote.id));
    
    console.log('Eliminando cotización:', quote.id);
    toast({
      title: "Cotización eliminada",
      description: `La cotización ${quote.id} ha sido eliminada`,
      variant: "destructive",
    });
  };

  const handleEditQuote = (quote: any) => {
    setEditingQuote(quote);
    onToggleCreation(true);
    
    console.log('Editando cotización:', quote.id);
    toast({
      title: "Editando cotización",
      description: `Abriendo editor para ${quote.id}`,
    });
  };

  const handleDuplicateQuote = (quote: any) => {
    const duplicatedQuote = {
      ...quote,
      id: `COT-2024-${String(quotes.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'En Revisión',
      isInvoiced: false
    };
    
    setQuotes(prevQuotes => [...prevQuotes, duplicatedQuote]);
    
    console.log('Duplicando cotización:', quote.id);
    toast({
      title: "Cotización duplicada",
      description: `Se ha creado una copia como ${duplicatedQuote.id}`,
    });
  };

  const handleSaveQuote = (quoteData: any) => {
    if (editingQuote) {
      // Actualizar cotización existente
      setQuotes(prevQuotes => 
        prevQuotes.map(q => 
          q.id === editingQuote.id ? quoteData : q
        )
      );
      setEditingQuote(null);
      toast({
        title: "Cotización actualizada",
        description: `La cotización ${quoteData.id} ha sido actualizada exitosamente`,
      });
    } else {
      // Agregar nueva cotización
      setQuotes(prevQuotes => [...prevQuotes, quoteData]);
      toast({
        title: "Cotización creada",
        description: `La cotización ${quoteData.id} ha sido creada exitosamente`,
      });
    }
  };

  const handleSendMessage = (quote: any) => {
    // Filter quotes for the same client
    const clientQuotes = quotes.filter(q => q.client === quote.client);
    setSelectedQuote({ ...quote, clientQuotes });
    setShowMessagePanel(true);
  };

  if (showCreationForm) {
    return (
      <QuoteCreationForm 
        onClose={() => {
          onToggleCreation(false);
          setEditingQuote(null);
        }} 
        editingQuote={editingQuote}
        onSaveQuote={handleSaveQuote}
      />
    );
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
                        variant={quote.status === 'Confirmada' ? 'default' : quote.status === 'Rechazada' ? 'destructive' : 'secondary'}
                        className={
                          quote.status === 'Confirmada' 
                            ? 'bg-green-100 text-green-700' 
                            : quote.status === 'Rechazada'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {quote.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleViewDetails(quote)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver Detalles</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleInvoiceClick(quote)}
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
                              onClick={() => handleSendMessage(quote)}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enviar Mensaje</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                            {quote.status === 'En Revisión' && (
                              <DropdownMenuItem 
                                className="hover:bg-gray-50"
                                onClick={() => handleConfirmQuote(quote)}
                              >
                                Confirmar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="hover:bg-gray-50"
                              onClick={() => handleEditQuote(quote)}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="hover:bg-gray-50"
                              onClick={() => handleDuplicateQuote(quote)}
                            >
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="hover:bg-gray-50 text-red-600"
                              onClick={() => handleDeleteQuote(quote)}
                            >
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quote Details Dialog */}
        {showQuoteDetails && selectedQuote && (
          <Dialog open={showQuoteDetails} onOpenChange={setShowQuoteDetails}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Detalles de Cotización - {selectedQuote.id}</DialogTitle>
                  <img 
                    src="/lovable-uploads/7342f7cc-57b7-42f2-aea6-b1c823657abb.png" 
                    alt="Radtek Logo" 
                    className="h-12"
                  />
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cliente:</label>
                    <p className="text-gray-900">{selectedQuote.client}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fecha:</label>
                    <p className="text-gray-900">{selectedQuote.date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Estado:</label>
                    <Badge 
                      variant={selectedQuote.status === 'Confirmada' ? 'default' : selectedQuote.status === 'Rechazada' ? 'destructive' : 'secondary'}
                      className={
                        selectedQuote.status === 'Confirmada' 
                          ? 'bg-green-100 text-green-700' 
                          : selectedQuote.status === 'Rechazada'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }
                    >
                      {selectedQuote.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Total de Productos:</label>
                    <p className="text-gray-900">{selectedQuote.products} items</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Productos:</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Producto</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Cantidad</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Precio Unit.</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedQuote.items?.map((item: any, index: number) => (
                          <tr key={index} className="border-t">
                            <td className="py-2 px-3 text-sm">{item.name}</td>
                            <td className="py-2 px-3 text-sm">{item.quantity}</td>
                            <td className="py-2 px-3 text-sm">${item.price.toLocaleString()}</td>
                            <td className="py-2 px-3 text-sm font-medium">${(item.quantity * item.price).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-blue-600">${selectedQuote.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Payment Link Form */}
        {showPaymentLinkForm && selectedQuote && (
          <PaymentLinkForm
            isOpen={showPaymentLinkForm}
            onClose={() => setShowPaymentLinkForm(false)}
            orderRef={selectedQuote.id}
            totalAmount={selectedQuote.amount}
            clientName={selectedQuote.client}
          />
        )}

        {showInvoiceForm && selectedQuote && (
          <InvoiceForm
            isOpen={showInvoiceForm}
            onClose={() => setShowInvoiceForm(false)}
            orderRef={selectedQuote.id}
            totalAmount={selectedQuote.amount}
            clientName={selectedQuote.client}
            orderDate={selectedQuote.date}
          />
        )}

        {/* Message Selection Panel */}
        {showMessagePanel && selectedQuote && (
          <MessageSelectionPanel
            isOpen={showMessagePanel}
            onClose={() => setShowMessagePanel(false)}
            clientName={selectedQuote.client}
            type="quote"
            items={selectedQuote.clientQuotes || [selectedQuote]}
          />
        )}

        {/* Quote Confirmation Dialog */}
        {showConfirmationDialog && selectedQuote && (
          <QuoteConfirmationDialog
            isOpen={showConfirmationDialog}
            onClose={() => setShowConfirmationDialog(false)}
            quote={selectedQuote}
            onConfirm={handleQuoteConfirmed}
          />
        )}
      </div>
    </TooltipProvider>
  );
};
