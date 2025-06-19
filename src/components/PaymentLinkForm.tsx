
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, Copy, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PaymentLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  orderRef: string;
  totalAmount: number;
  clientName: string;
}

export const PaymentLinkForm: React.FC<PaymentLinkFormProps> = ({
  isOpen,
  onClose,
  orderRef,
  totalAmount,
  clientName
}) => {
  const [partialPayment, setPartialPayment] = useState(false);
  const [advancePercentage, setAdvancePercentage] = useState([20]);
  const [dueDate, setDueDate] = useState<Date>();
  const [paymentTerms, setPaymentTerms] = useState('30');
  const [isCustomTerms, setIsCustomTerms] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string>('');

  const advanceAmount = (totalAmount * advancePercentage[0]) / 100;

  const quickTermsOptions = [15, 30, 45, 60, 75, 90];

  const handlePartialPaymentChange = (checked: boolean | "indeterminate") => {
    setPartialPayment(checked === true);
  };

  const handleQuickTermsSelect = (days: number) => {
    setPaymentTerms(days.toString());
    setIsCustomTerms(false);
    setDueDate(undefined);
  };

  const handleCustomTermsSelect = () => {
    setIsCustomTerms(true);
    setPaymentTerms('');
  };

  const handleGenerateLink = () => {
    const amount = partialPayment ? advanceAmount : totalAmount;
    const mockLink = `https://pay.xepelin.com/${orderRef}?amount=${amount}`;
    
    console.log('Generando enlace de pago...', {
      orderRef,
      totalAmount,
      partialPayment,
      advanceAmount: amount,
      dueDate,
      paymentTerms,
      isCustomTerms,
      clientName
    });
    
    setGeneratedLink(mockLink);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    // Aquí podrías agregar un toast de confirmación
    console.log('Enlace copiado al portapapeles');
  };

  const handleWhatsAppShare = () => {
    const amount = partialPayment ? advanceAmount : totalAmount;
    const message = `Hola, aquí tienes el enlace para realizar el pago de $${amount.toLocaleString()} correspondiente a ${orderRef}: ${generatedLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleClose = () => {
    setGeneratedLink('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Crear Enlace de Pago - {clientName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Folio */}
          <div>
            <Label htmlFor="folio" className="text-gray-700">Folio</Label>
            <Input 
              id="folio"
              value={orderRef}
              readOnly
              className="bg-gray-50 border-gray-300"
            />
          </div>

          {/* Monto total */}
          <div>
            <Label htmlFor="amount" className="text-gray-700">Monto total</Label>
            <Input 
              id="amount"
              value={`$${totalAmount.toLocaleString()}.00`}
              readOnly
              className="bg-gray-50 border-gray-300"
            />
          </div>

          {/* Pago parcial */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="partial"
              checked={partialPayment}
              onCheckedChange={handlePartialPaymentChange}
              className="border-gray-300"
            />
            <Label htmlFor="partial" className="text-blue-600 font-medium">
              Solicitar pago parcial (anticipo)
            </Label>
          </div>

          {/* Porcentaje del anticipo */}
          {partialPayment && (
            <div className="space-y-3">
              <Label className="text-gray-700">Porcentaje del anticipo</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={advancePercentage}
                  onValueChange={setAdvancePercentage}
                  max={100}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="text-lg font-semibold text-gray-900 min-w-[48px]">
                  {advancePercentage[0]}%
                </span>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-600 font-medium">
                  Monto a cobrar: <span className="text-blue-700">${advanceAmount.toLocaleString()}.00</span>
                </div>
              </div>
            </div>
          )}

          {/* Términos de pago */}
          <div className="space-y-3">
            <Label className="text-gray-700">Términos de pago</Label>
            
            {/* Opciones rápidas */}
            <div className="grid grid-cols-3 gap-2">
              {quickTermsOptions.map((days) => (
                <Button
                  key={days}
                  variant={paymentTerms === days.toString() && !isCustomTerms ? "default" : "outline"}
                  className={cn(
                    "text-sm",
                    paymentTerms === days.toString() && !isCustomTerms
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() => handleQuickTermsSelect(days)}
                >
                  {days} días
                </Button>
              ))}
            </div>

            {/* Opción personalizada */}
            <Button
              variant={isCustomTerms ? "default" : "outline"}
              className={cn(
                "w-full text-sm",
                isCustomTerms
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              )}
              onClick={handleCustomTermsSelect}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Personalizado (calendario)
            </Button>
          </div>

          {/* Fecha límite de pago - Solo si es personalizado */}
          {isCustomTerms && (
            <div>
              <Label className="text-gray-700">Fecha límite de pago</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-300",
                      !dueDate && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "dd-MM-yyyy") : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Botón generar enlace o enlace generado */}
          {!generatedLink ? (
            <Button 
              onClick={handleGenerateLink}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
              disabled={isCustomTerms && !dueDate}
            >
              Generar enlace de pago
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <Label className="text-green-700 font-medium">Enlace generado:</Label>
                <div className="mt-2 p-2 bg-white border border-green-300 rounded text-sm font-mono break-all">
                  {generatedLink}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleCopyLink}
                  variant="outline"
                  className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
                <Button 
                  onClick={handleWhatsAppShare}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
