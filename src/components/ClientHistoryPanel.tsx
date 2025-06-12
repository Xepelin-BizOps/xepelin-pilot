
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, MessageSquare } from 'lucide-react';

interface ClientHistoryPanelProps {
  client: any;
  onClose: () => void;
}

export const ClientHistoryPanel: React.FC<ClientHistoryPanelProps> = ({ client, onClose }) => {
  const clientHistory = [
    { id: 'COT-2024-001', type: 'Cotización', date: '2024-06-10', status: 'Pendiente', amount: 32000 },
    { id: 'ORD-2024-001', type: 'Orden', date: '2024-06-11', status: 'Facturado', amount: 45600 },
    { id: 'COT-2024-003', type: 'Cotización', date: '2024-06-12', status: 'En Revisión', amount: 18900 }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-96 bg-white h-full overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Historial del Cliente</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Client Summary */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">{client.name}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Cotizaciones</p>
                <p className="text-lg font-semibold text-gray-900">{client.quotes}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Órdenes Activas</p>
                <p className="text-lg font-semibold text-gray-900">{client.orders}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Pagado</p>
                <p className="text-lg font-semibold text-green-600">${client.totalPaid.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendiente</p>
                <p className="text-lg font-semibold text-orange-600">${client.totalPending.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Última Actividad</p>
              <p className="text-sm font-medium text-gray-900">{client.lastActivity}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-3">Acciones Rápidas</h5>
            <div className="space-y-2">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Crear Nueva Cotización
              </Button>
              <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-600 hover:bg-blue-50">
                <MessageSquare className="w-4 h-4 mr-2" />
                Enviar Recordatorio
              </Button>
              <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-600 hover:bg-gray-50">
                Editar Información de Contacto
              </Button>
            </div>
          </Card>

          {/* Transaction History */}
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Historial de Transacciones</h5>
            <div className="space-y-3">
              {clientHistory.map((item) => (
                <Card key={item.id} className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-blue-600">{item.id}</span>
                        <Badge 
                          variant="secondary" 
                          className={item.type === 'Orden' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                        >
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{item.date}</p>
                      <Badge 
                        variant="secondary"
                        className={
                          item.status === 'Facturado' ? 'bg-green-100 text-green-700' :
                          item.status === 'Pendiente' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${item.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
