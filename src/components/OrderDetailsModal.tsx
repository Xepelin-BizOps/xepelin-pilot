
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Detalles de la Orden {order.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Información General */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Información General</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID de Orden</label>
                <p className="text-gray-900">{order.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Referencia de Cotización</label>
                <p className="text-gray-900">{order.quoteRef}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Cliente</label>
                <p className="text-gray-900">{order.client}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha</label>
                <p className="text-gray-900">{order.date}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información Financiera */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Información Financiera</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Monto Total</label>
                <p className="text-lg font-semibold text-gray-900">${order.amount?.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Pagado</label>
                <p className="text-lg font-semibold text-blue-600">${order.paid?.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Pendiente</label>
                <p className="text-lg font-semibold text-gray-600">${order.pending?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Estado y Configuración */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Estado y Configuración</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <div className="mt-1">
                  <Badge 
                    variant="secondary"
                    className={
                      order.status === 'Pagado' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-gray-200 text-gray-700 border-gray-300'
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">CFDI</label>
                <p className="text-gray-900">{order.hasCFDI ? 'Generado' : 'Pendiente'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Facturado</label>
                <p className="text-gray-900">{order.isInvoiced ? 'Sí' : 'No'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Link de Pago</label>
                <p className="text-gray-900">{order.paymentLink ? 'Activo' : 'No disponible'}</p>
              </div>
            </div>
          </div>

          {/* Complementos de Pago */}
          {order.paymentComplements && order.paymentComplements.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Complementos de Pago ({order.paymentComplements.length})
                </h3>
                <div className="space-y-2">
                  {order.paymentComplements.map((complement: any) => (
                    <div key={complement.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{complement.id}</p>
                        <p className="text-sm text-gray-600">{complement.date}</p>
                      </div>
                      <p className="font-semibold text-blue-600">${complement.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
