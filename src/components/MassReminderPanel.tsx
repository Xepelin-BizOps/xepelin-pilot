
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, MessageSquare } from 'lucide-react';

interface MassReminderPanelProps {
  onClose: () => void;
}

export const MassReminderPanel: React.FC<MassReminderPanelProps> = ({ onClose }) => {
  const [selectedChannel, setSelectedChannel] = useState('whatsapp');
  const [selectedOrders, setSelectedOrders] = useState<string[]>(['ORD-2024-001', 'ORD-2024-002']);
  const [message, setMessage] = useState('Estimado cliente, le recordamos que tiene un pago pendiente. Puede realizar el pago a través del siguiente enlace: [LINK_PAGO]');

  const unpaidOrders = [
    {
      id: 'ORD-2024-001',
      client: 'Innovación Digital S.C.',
      amount: 20000,
      dueDate: '2024-06-15',
      contact: '+52 55 1234 5678'
    },
    {
      id: 'ORD-2024-002', 
      client: 'Tecnología Avanzada S.A.',
      amount: 32000,
      dueDate: '2024-06-18',
      contact: 'contacto@tecavanzada.com'
    },
    {
      id: 'ORD-2024-004',
      client: 'Sistemas Integrados',
      amount: 15000,
      dueDate: '2024-06-20',
      contact: '+52 55 9876 5432'
    }
  ];

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectedOrdersData = unpaidOrders.filter(order => selectedOrders.includes(order.id));
  const totalAmount = selectedOrdersData.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Envío Masivo de Recordatorios</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Channel Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Canal de Comunicación</label>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-full bg-white border-gray-300 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                <SelectItem value="whatsapp">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                    WhatsApp
                  </div>
                </SelectItem>
                <SelectItem value="email">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                    Email
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Órdenes Pendientes de Pago ({unpaidOrders.length})
            </label>
            <Card className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {unpaidOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <input 
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{order.client}</p>
                            <p className="text-sm text-gray-600">{order.id}</p>
                            <p className="text-xs text-gray-500">Vence: {order.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${order.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{order.contact}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Message Template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
            <Textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-24 bg-white border-gray-300 rounded-lg"
              placeholder="Personaliza tu mensaje..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Usa [LINK_PAGO] para incluir el enlace de pago automáticamente
            </p>
          </div>

          {/* Summary */}
          <Card className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Resumen del Envío</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Órdenes seleccionadas:</p>
                <p className="font-semibold text-gray-900">{selectedOrders.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Monto total:</p>
                <p className="font-semibold text-gray-900">${totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Canal:</p>
                <p className="font-semibold text-gray-900">
                  {selectedChannel === 'whatsapp' ? 'WhatsApp' : 'Email'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Destinatarios:</p>
                <p className="font-semibold text-gray-900">{selectedOrders.length} clientes</p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={selectedOrders.length === 0}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Enviar Recordatorios ({selectedOrders.length})
            </Button>
            <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-600 hover:bg-gray-50">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
