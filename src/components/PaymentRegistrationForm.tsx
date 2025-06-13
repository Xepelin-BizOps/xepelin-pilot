
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PaymentRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  orderRef: string;
  totalAmount: number;
  clientName: string;
  onPaymentRegistered: () => void;
}

export const PaymentRegistrationForm: React.FC<PaymentRegistrationFormProps> = ({
  isOpen,
  onClose,
  orderRef,
  totalAmount,
  clientName,
  onPaymentRegistered
}) => {
  const [amount, setAmount] = useState(totalAmount.toString());
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bank, setBank] = useState('Cuenta Xepelin');
  const [date, setDate] = useState<Date>(new Date());
  const [reference, setReference] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    console.log('Registrando pago:', {
      orderRef,
      amount,
      paymentMethod,
      bank,
      date,
      reference
    });

    toast({
      title: "Pago registrado",
      description: `El pago de $${amount} ha sido registrado exitosamente`,
    });

    onPaymentRegistered();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Registrar Pago - {orderRef}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Cliente:</strong> {clientName}
            </p>
            <p className="text-sm text-blue-700">
              <strong>Monto Total:</strong> ${totalAmount.toLocaleString()}
            </p>
          </div>

          <div>
            <Label htmlFor="amount" className="text-gray-700">Monto del pago *</Label>
            <Input 
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-gray-300"
              placeholder="0.00"
            />
          </div>

          <div>
            <Label className="text-gray-700">Método de pago *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Seleccionar método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="tarjeta-debito">Tarjeta de Débito</SelectItem>
                <SelectItem value="tarjeta-credito">Tarjeta de Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-700">Banco *</Label>
            <Select value={bank} onValueChange={setBank}>
              <SelectTrigger className="border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cuenta Xepelin">Cuenta Xepelin</SelectItem>
                <SelectItem value="BBVA">BBVA</SelectItem>
                <SelectItem value="Banorte">Banorte</SelectItem>
                <SelectItem value="Santander">Santander</SelectItem>
                <SelectItem value="HSBC">HSBC</SelectItem>
                <SelectItem value="Banamex">Banamex</SelectItem>
                <SelectItem value="Scotiabank">Scotiabank</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-700">Fecha del pago *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-300",
                    !date && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd-MM-yyyy") : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="reference" className="text-gray-700">Referencia (opcional)</Label>
            <Input 
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="border-gray-300"
              placeholder="Número de referencia o concepto"
            />
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
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!amount || !paymentMethod || !date}
            >
              Registrar Pago
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
