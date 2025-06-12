import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PaymentLinkForm } from '@/components/PaymentLinkForm';
import { Plus, FileText, Link, Bell } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SalesOrdersProps {
  onClientClick: (client: any) => void;
}

export const SalesOrders: React.FC<SalesOrdersProps> = ({ onClientClick }) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showPaymentLinkForm, setShowPaymentLinkForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const orders = [
    {
      id: 'ORD-2024-001',
      quoteRef: 'COT-2024-002',
      client: 'Innovación Digital S.C.',
      date: '2024-06-11',
      amount: 45600,
      status: 'Facturado',
      paymentLink: 'https://pay.xepelin.com/ord-001',
      hasCFDI: true,
      paid: 25600,
      pending: 20000,
      isInvoiced: true
    },
    {
      id: 'ORD-2024-002',
      quoteRef: 'COT-2024-004',
      client: 'Tecnología Avanzada S.A.',
      date: '2024-06-12',
      amount: 32000,
      status: 'Pendiente Pago',
      paymentLink: 'https://pay.xepelin.com/ord-002',
      hasCFDI: false,
      paid: 0,
      pending: 32000,
      isInvoiced: false
    },
    {
      id: 'ORD-2024-003',
      quoteRef: 'COT-2024-001',
      client: 'Sistemas Corporativos',
      date: '2024-06-10',
      amount: 18900,
      status: 'Pagado',
      paymentLink: null,
      hasCFDI: true,
      paid: 18900,
      pending: 0,
      isInvoiced: true
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

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handlePaymentLinkClick = (order: any) => {
    setSelectedOrder(order);
    setShowPaymentLinkForm(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Órdenes de Venta</h3>
            <div className="flex space-x-2">
              <Input 
                placeholder="Buscar órdenes..." 
                className="w-64 bg-white border-gray-300 rounded-lg"
              />
              <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                Filtros
              </Button>
              {selectedOrders.length > 0 && (
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Bell className="w-4 h-4 mr-2" />
                  Enviar Recordatorios ({selectedOrders.length})
                </Button>
              )}
            </div>
          </div>

          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders(orders.filter(o => o.pending > 0).map(o => o.id));
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">ID Orden</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Ref. Cotización</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Monto Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Pagado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Pendiente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {order.pending > 0 && (
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                        />
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-blue-600">{order.id}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleClientClick(order.client)}
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {order.client}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{order.quoteRef}</td>
                    <td className="py-3 px-4 text-gray-600">{order.date}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">${order.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-green-600 font-medium">${order.paid.toLocaleString()}</td>
                    <td className="py-3 px-4 text-orange-600 font-medium">${order.pending.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="secondary"
                        className={
                          order.status === 'Pagado' ? 'bg-green-100 text-green-700' :
                          order.status === 'Facturado' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }
                      >
                        {order.status}
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
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{order.isInvoiced ? 'Editar Factura' : 'Facturar'}</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-green-300 text-green-600 hover:bg-green-50"
                              onClick={() => handlePaymentLinkClick(order)}
                            >
                              <Link className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Link de Pago</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        {order.pending > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Bell className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Recordatorio</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                              <Plus className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                            <DropdownMenuItem className="hover:bg-gray-50">Ver Detalles</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-gray-50">Editar Contacto</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-gray-50">Descargar PDF</DropdownMenuItem>
                            {!order.hasCFDI && (
                              <DropdownMenuItem className="hover:bg-gray-50">Generar CFDI</DropdownMenuItem>
                            )}
                            {!order.paymentLink && order.pending > 0 && (
                              <DropdownMenuItem className="hover:bg-gray-50">Crear Link de Pago</DropdownMenuItem>
                            )}
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

        {/* Payment Link Form */}
        {showPaymentLinkForm && selectedOrder && (
          <PaymentLinkForm
            isOpen={showPaymentLinkForm}
            onClose={() => setShowPaymentLinkForm(false)}
            orderRef={selectedOrder.id}
            totalAmount={selectedOrder.amount}
            clientName={selectedOrder.client}
          />
        )}
      </div>
    </TooltipProvider>
  );
};
