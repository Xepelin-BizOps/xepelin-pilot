
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { FileText, Download, Eye, X, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvoiceDropdownProps {
  order: any;
  onInvoiceClick: (order: any) => void;
}

export const InvoiceDropdown: React.FC<InvoiceDropdownProps> = ({ order, onInvoiceClick }) => {
  const { toast } = useToast();

  const handleViewInvoice = () => {
    console.log('Ver factura:', order.id);
    toast({
      title: "Visualizando factura",
      description: "Abriendo vista previa de la factura",
    });
  };

  const handleDownloadInvoice = () => {
    console.log('Descargar factura:', order.id);
    toast({
      title: "Descargando factura",
      description: "El archivo PDF se está descargando",
    });
  };

  const handleCancelInvoice = () => {
    console.log('Cancelar factura:', order.id);
    toast({
      title: "Factura cancelada",
      description: "La factura ha sido cancelada",
      variant: "destructive",
    });
  };

  const handleViewPaymentComplement = (complement: any) => {
    console.log('Ver complemento de pago:', complement.id);
    toast({
      title: "Visualizando complemento",
      description: `Abriendo complemento de pago ${complement.id}`,
    });
  };

  const handleDownloadPaymentComplement = (complement: any) => {
    console.log('Descargar complemento de pago:', complement.id);
    toast({
      title: "Descargando complemento",
      description: `El complemento de pago ${complement.id} se está descargando`,
    });
  };

  if (order.isInvoiced) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText className="w-4 h-4 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border border-gray-300 rounded-lg shadow-lg">
          <DropdownMenuItem 
            className="hover:bg-gray-50 text-gray-700 cursor-pointer"
            onClick={handleViewInvoice}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Factura
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="hover:bg-gray-50 text-gray-700 cursor-pointer"
            onClick={handleDownloadInvoice}
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Factura
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="hover:bg-gray-50 text-gray-700 cursor-pointer"
            onClick={() => onInvoiceClick(order)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Editar Factura
          </DropdownMenuItem>
          
          {order.paymentComplements && order.paymentComplements.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Complementos de Pago ({order.paymentComplements.length})
              </div>
              {order.paymentComplements.map((complement: any) => (
                <div key={complement.id} className="border-l-2 border-blue-200 ml-2">
                  <div className="px-2 py-1 text-xs text-gray-600">
                    {complement.id} - ${complement.amount.toLocaleString()} ({complement.date})
                  </div>
                  <div className="flex">
                    <DropdownMenuItem 
                      className="flex-1 hover:bg-blue-50 text-blue-600 cursor-pointer text-xs py-1"
                      onClick={() => handleViewPaymentComplement(complement)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex-1 hover:bg-blue-50 text-blue-600 cursor-pointer text-xs py-1"
                      onClick={() => handleDownloadPaymentComplement(complement)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Descargar
                    </DropdownMenuItem>
                  </div>
                </div>
              ))}
            </>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="hover:bg-red-50 text-red-600 cursor-pointer"
            onClick={handleCancelInvoice}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar Factura
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      size="sm" 
      variant="outline" 
      className="border-blue-400 text-blue-600 hover:bg-blue-50"
      onClick={() => onInvoiceClick(order)}
    >
      <FileText className="w-4 h-4" />
    </Button>
  );
};
