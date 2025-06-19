
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, Download, Eye, X } from 'lucide-react';
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
            Descargar
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="hover:bg-gray-50 text-gray-700 cursor-pointer"
            onClick={() => onInvoiceClick(order)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Editar Factura
          </DropdownMenuItem>
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
