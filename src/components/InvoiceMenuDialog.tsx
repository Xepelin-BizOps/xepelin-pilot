
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvoiceMenuDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onInvoiceAction: (action: 'emit' | 'download' | 'view' | 'cancel') => void;
}

export const InvoiceMenuDialog: React.FC<InvoiceMenuDialogProps> = ({
  isOpen,
  onClose,
  order,
  onInvoiceAction
}) => {
  const { toast } = useToast();

  const handleAction = (action: 'emit' | 'download' | 'view' | 'cancel') => {
    switch (action) {
      case 'emit':
        onInvoiceAction('emit');
        break;
      case 'download':
        toast({
          title: "Descargando factura",
          description: `Se está descargando la factura de ${order.id}`,
        });
        console.log('Descargando factura para', order.id);
        break;
      case 'view':
        toast({
          title: "Abriendo factura",
          description: `Abriendo vista de la factura de ${order.id}`,
        });
        console.log('Viendo factura para', order.id);
        break;
      case 'cancel':
        toast({
          title: "Cancelando factura",
          description: `La factura de ${order.id} ha sido cancelada`,
          variant: "destructive",
        });
        console.log('Cancelando factura para', order.id);
        break;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Opciones de Factura - {order.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Cliente:</strong> {order.client}
            </p>
            <p className="text-sm text-blue-700">
              <strong>Monto:</strong> ${order.amount.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            {!order.isInvoiced ? (
              <Button 
                onClick={() => handleAction('emit')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                Emitir Factura
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => handleAction('view')}
                  variant="outline"
                  className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Factura
                </Button>
                
                <Button 
                  onClick={() => handleAction('download')}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
                
                <Button 
                  onClick={() => handleAction('cancel')}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50 justify-start"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar Factura
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
