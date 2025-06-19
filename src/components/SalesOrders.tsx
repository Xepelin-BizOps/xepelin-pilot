
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PaymentLinkForm } from '@/components/PaymentLinkForm';
import { InvoiceForm } from '@/components/InvoiceForm';
import { InvoiceDropdown } from '@/components/InvoiceDropdown';
import { MessageSelectionPanel } from '@/components/MessageSelectionPanel';
import { MoreHorizontal, FileText, Link, Send, BarChart3 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface SalesOrdersProps {
  onClientClick: (client: any) => void;
  onShowReminderPanel: () => void;
}

export const SalesOrders: React.FC<SalesOrdersProps> = ({ onClientClick, onShowReminderPanel }) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showPaymentLinkForm, setShowPaymentLinkForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showMessagePanel, setShowMessagePanel] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { toast } = useToast();

  const orders = [
    {
      id: 'ORD-2024-001',
      quoteRef: 'COT-2024-002',
      client: 'Innovación Digital S.C.',
      date: '2024-06-11',
      amount: 45600,
      status: 'Pendiente',
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
      status: 'Pendiente',
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
    },
    {
      id: 'ORD-2024-004',
      quoteRef: 'COT-2024-005',
      client: 'Distribuidora Central',
      date: '2024-06-09',
      amount: 15800,
      status: 'Pagado',
      paymentLink: null,
      hasCFDI: true,
      paid: 15800,
      pending: 0,
      isInvoiced: true
    },
    {
      id: 'ORD-2024-005',
      quoteRef: 'COT-2024-006',
      client: 'Tecnología Avanzada S.A.',
      date: '2024-06-13',
      amount: 15000,
      status: 'Pendiente',
      paymentLink: 'https://pay.xepelin.com/ord-005',
      hasCFDI: false,
      paid: 0,
      pending: 15000,
      isInvoiced: false
    },
    {
      id: 'ORD-2024-006',
      quoteRef: 'COT-2024-004',
      client: 'Comercial Hernández S.A.',
      date: '2024-06-08',
      amount: 28500,
      status: 'Pagado',
      paymentLink: null,
      hasCFDI: true,
      paid: 28500,
      pending: 0,
      isInvoiced: true
    },
    {
      id: 'ORD-2024-007',
      quoteRef: 'COT-2024-006',
      client: 'Oficinas Modernas',
      date: '2024-06-13',
      amount: 22100,
      status: 'Pendiente',
      paymentLink: 'https://pay.xepelin.com/ord-007',
      hasCFDI: true,
      paid: 12000,
      pending: 10100,
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

  const handleInvoiceClick = (order: any) => {
    setSelectedOrder(order);
    setShowInvoiceForm(true);
  };

  const handleSendMessage = (order: any) => {
    // Filter orders for the same client
    const clientOrders = orders.filter(o => o.client === order.client);
    setSelectedOrder({ ...order, clientOrders });
    setShowMessagePanel(true);
  };

  const handleIndividualReminder = (order: any) => {
    console.log('Enviando recordatorio individual para:', order);
    
    // Verificar si el cliente tiene múltiples órdenes pendientes
    const clientPendingOrders = orders.filter(o => 
      o.client === order.client && o.pending > 0
    );

    if (clientPendingOrders.length > 1) {
      // Agrupar todas las órdenes pendientes del cliente
      const totalPending = clientPendingOrders.reduce((sum, o) => sum + o.pending, 0);
      const orderIds = clientPendingOrders.map(o => o.id).join(', ');
      
      toast({
        title: "Recordatorio Agrupado Enviado",
        description: `Se envió un recordatorio consolidado a ${order.client} por ${clientPendingOrders.length} órdenes pendientes (${orderIds}) con un total de $${totalPending.toLocaleString()}.`,
        duration: 5000,
      });
    } else {
      // Enviar recordatorio individual
      toast({
        title: "Recordatorio Enviado",
        description: `Se envió un recordatorio a ${order.client} por la orden ${order.id} con monto pendiente de $${order.pending.toLocaleString()}.`,
        duration: 4000,
      });
    }
  };

  const handleMassReminders = () => {
    console.log('Enviando recordatorios masivos para órdenes:', selectedOrders);
    
    // Agrupar órdenes por cliente
    const ordersByClient = selectedOrders.reduce((acc, orderId) => {
      const order = orders.find(o => o.id === orderId);
      if (order && order.pending > 0) {
        if (!acc[order.client]) {
          acc[order.client] = [];
        }
        acc[order.client].push(order);
      }
      return acc;
    }, {} as Record<string, any[]>);

    const clientCount = Object.keys(ordersByClient).length;
    let totalOrders = 0;
    
    // Contar total de órdenes y enviar recordatorios agrupados por cliente
    Object.entries(ordersByClient).forEach(([client, clientOrders]) => {
      totalOrders += clientOrders.length;
      const totalPending = clientOrders.reduce((sum, order) => sum + order.pending, 0);
      console.log(`Recordatorio agrupado para ${client}: ${clientOrders.length} órdenes, $${totalPending.toLocaleString()}`);
    });

    toast({
      title: `Recordatorios Masivos Enviados`,
      description: `Se enviaron ${clientCount} recordatorios agrupados por cliente, cubriendo ${totalOrders} órdenes pendientes.`,
      duration: 5000,
    });

    // Limpiar selección
    setSelectedOrders([]);
  };

  const handleReportsClick = () => {
    console.log('Navegando a reportes...');
    // TODO: Implement navigation to reports section
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Órdenes de Venta</h3>
              <div className="flex space-x-2">
                <Button 
                  onClick={onShowReminderPanel}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Enviar Recordatorios
                </Button>
                <Button 
                  onClick={handleReportsClick}
                  variant="outline"
                  className="border-blue-400 text-blue-600 hover:bg-blue-50"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Reportes
                </Button>
                <Input 
                  placeholder="Buscar órdenes..." 
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {selectedOrders.length > 0 && (
              <div className="p-6 border-b">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleMassReminders}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Recordatorios ({selectedOrders.length})
                </Button>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-400"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders(orders.filter(o => o.pending > 0).map(o => o.id));
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>ID Orden</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Ref. Cotización</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto Total</TableHead>
                  <TableHead>Pagado</TableHead>
                  <TableHead>Pendiente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order.pending > 0 && (
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-400"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-blue-600">{order.id}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleClientClick(order.client)}
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {order.client}
                      </button>
                    </TableCell>
                    <TableCell className="text-gray-700">{order.quoteRef}</TableCell>
                    <TableCell className="text-gray-700">{order.date}</TableCell>
                    <TableCell className="font-semibold text-gray-900">${order.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-600 font-medium">${order.paid.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-600 font-medium">${order.pending.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={
                          order.status === 'Pagado' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-gray-200 text-gray-700 border-gray-300'
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InvoiceDropdown 
                              order={order} 
                              onInvoiceClick={handleInvoiceClick}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{order.isInvoiced ? 'Opciones de Factura' : 'Facturar'}</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        {order.pending > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-blue-400 text-blue-600 hover:bg-blue-50"
                                onClick={() => handlePaymentLinkClick(order)}
                              >
                                <Link className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Link de Pago</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleSendMessage(order)}
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
                            <Button size="sm" variant="outline" className="border-gray-400 text-gray-600 hover:bg-gray-50">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white border border-gray-300 rounded-lg shadow-lg">
                            <DropdownMenuItem className="hover:bg-gray-50 text-gray-700">Ver Detalles</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-gray-50 text-gray-700">Editar Contacto</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-gray-50 text-gray-700">Descargar PDF</DropdownMenuItem>
                            {!order.hasCFDI && (
                              <DropdownMenuItem className="hover:bg-gray-50 text-gray-700">Generar CFDI</DropdownMenuItem>
                            )}
                            {!order.paymentLink && order.pending > 0 && (
                              <DropdownMenuItem className="hover:bg-gray-50 text-gray-700">Crear Link de Pago</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {showPaymentLinkForm && selectedOrder && (
          <PaymentLinkForm
            isOpen={showPaymentLinkForm}
            onClose={() => setShowPaymentLinkForm(false)}
            orderRef={selectedOrder.id}
            totalAmount={selectedOrder.amount}
            clientName={selectedOrder.client}
          />
        )}

        {showInvoiceForm && selectedOrder && (
          <InvoiceForm
            isOpen={showInvoiceForm}
            onClose={() => setShowInvoiceForm(false)}
            orderRef={selectedOrder.id}
            totalAmount={selectedOrder.amount}
            clientName={selectedOrder.client}
            orderDate={selectedOrder.date}
          />
        )}

        {showMessagePanel && selectedOrder && (
          <MessageSelectionPanel
            isOpen={showMessagePanel}
            onClose={() => setShowMessagePanel(false)}
            clientName={selectedOrder.client}
            type="order"
            items={selectedOrder.clientOrders || [selectedOrder]}
          />
        )}
      </div>
    </TooltipProvider>
  );
};
