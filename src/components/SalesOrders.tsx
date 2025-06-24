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
import { MoreHorizontal, FileText, Link, Send, BarChart3, Eye } from 'lucide-react';
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
      isInvoiced: true,
      paymentComplements: [
        { id: 'CP001', amount: 15600, date: '2024-06-15' },
        { id: 'CP002', amount: 10000, date: '2024-06-18' }
      ]
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
      isInvoiced: false
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
      isInvoiced: true,
      paymentComplements: [
        { id: 'CP003', amount: 15800, date: '2024-06-12' }
      ]
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
      isInvoiced: true,
      paymentComplements: []
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
      isInvoiced: true,
      paymentComplements: [
        { id: 'CP004', amount: 14250, date: '2024-06-10' },
        { id: 'CP005', amount: 14250, date: '2024-06-12' }
      ]
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
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-white">
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
                  className="w-64 border-gray-200"
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {selectedOrders.length > 0 && (
              <div className="p-6 border-b bg-blue-50">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleMassReminders}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Recordatorios ({selectedOrders.length})
                </Button>
              </div>
            )}

            <div className="bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 hover:bg-transparent">
                    <TableHead className="w-12 py-4">
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
                    </TableHead>
                    <TableHead className="py-4 text-gray-600 font-medium text-sm">ID</TableHead>
                    <TableHead className="py-4 text-gray-600 font-medium text-sm">Cliente</TableHead>
                    <TableHead className="py-4 text-gray-600 font-medium text-sm">Fecha</TableHead>
                    <TableHead className="py-4 text-gray-600 font-medium text-sm">Productos</TableHead>
                    <TableHead className="py-4 text-gray-600 font-medium text-sm">Monto</TableHead>
                    <TableHead className="py-4 text-gray-600 font-medium text-sm">Estado</TableHead>
                    <TableHead className="py-4 text-gray-600 font-medium text-sm">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, index) => (
                    <TableRow key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <TableCell className="py-4">
                        {order.pending > 0 && (
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => toggleOrderSelection(order.id)}
                          />
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-medium text-blue-600 text-sm">{order.id}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <button
                          onClick={() => handleClientClick(order.client)}
                          className="text-gray-900 hover:text-blue-600 transition-colors text-sm font-medium"
                        >
                          {order.client}
                        </button>
                      </TableCell>
                      <TableCell className="py-4 text-gray-700 text-sm">{order.date}</TableCell>
                      <TableCell className="py-4 text-gray-700 text-sm">
                        {Math.floor(Math.random() * 5) + 1} ítems
                      </TableCell>
                      <TableCell className="py-4 font-semibold text-gray-900 text-sm">
                        ${order.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge 
                          variant="secondary"
                          className={
                            order.status === 'Pagado' 
                              ? 'bg-green-50 text-green-700 border-green-200 font-medium text-xs px-2 py-1' :
                              order.status === 'Pendiente'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200 font-medium text-xs px-2 py-1' :
                              'bg-red-50 text-red-700 border-red-200 font-medium text-xs px-2 py-1'
                          }
                        >
                          {order.status === 'Pagado' ? 'Confirmada' : 
                           order.status === 'Pendiente' ? 'En Revisión' : 'Rechazada'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ver detalles</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                onClick={() => handleInvoiceClick(order)}
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Facturar</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          {order.pending > 0 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                  onClick={() => handlePaymentLinkClick(order)}
                                >
                                  <Link className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Link de pago</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                onClick={() => handleSendMessage(order)}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Enviar mensaje</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border border-gray-200 rounded-lg shadow-lg">
                              <DropdownMenuItem className="hover:bg-gray-50 text-gray-700 text-sm">Ver Detalles</DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-gray-50 text-gray-700 text-sm">Editar Contacto</DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-gray-50 text-gray-700 text-sm">Descargar PDF</DropdownMenuItem>
                              {!order.hasCFDI && (
                                <DropdownMenuItem className="hover:bg-gray-50 text-gray-700 text-sm">Generar CFDI</DropdownMenuItem>
                              )}
                              {!order.paymentLink && order.pending > 0 && (
                                <DropdownMenuItem className="hover:bg-gray-50 text-gray-700 text-sm">Crear Link de Pago</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
