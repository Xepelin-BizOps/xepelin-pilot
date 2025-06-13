
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle } from 'lucide-react';

interface QuoteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quote: any;
  onConfirm: (shouldRegisterPayment: boolean) => void;
}

export const QuoteConfirmationDialog: React.FC<QuoteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  quote,
  onConfirm
}) => {
  const [registerPayment, setRegisterPayment] = useState(false);

  const handleConfirm = () => {
    onConfirm(registerPayment);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            Confirmar Cotización
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Detalles de la cotización</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p><strong>ID:</strong> {quote.id}</p>
              <p><strong>Cliente:</strong> {quote.client}</p>
              <p><strong>Monto:</strong> ${quote.amount.toLocaleString()}</p>
              <p><strong>Productos:</strong> {quote.products} items</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-700">
              ¿Estás seguro de que quieres confirmar esta cotización?
            </p>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="register-payment"
                checked={registerPayment}
                onCheckedChange={(checked) => setRegisterPayment(checked === true)}
              />
              <label 
                htmlFor="register-payment" 
                className="text-sm text-gray-700 cursor-pointer"
              >
                Registrar pago inmediatamente después de confirmar
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Confirmar Cotización
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
