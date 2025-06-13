
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CreditCard, Banknote, Link, FileText, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface QuoteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quote: any;
  onConfirm: (quote: any) => void;
}

export const QuoteConfirmationDialog: React.FC<QuoteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  quote,
  onConfirm
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentData, setPaymentData] = useState({
    paymentTerms: '30',
    dueDate: undefined as Date | undefined,
    partialPayment: false,
    advancePercentage: 20,
    paymentReceived: false,
    paymentMethod: '',
    bankAccount: '',
    xepelinAccount: '',
    paymentAmount: 0,
    paymentDate: undefined as Date | undefined,
    paymentNotes: '',
    shouldInvoice: true,
    isInvoiced: false
  });
  const [generatedPaymentLink, setGeneratedPaymentLink] = useState('');
  const { toast } = useToast();

  const totalAmount = quote?.amount || 0;
  const advanceAmount = (totalAmount * paymentData.advancePercentage) / 100;

  const handleStepNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGeneratePaymentLink = () => {
    const amount = paymentData.partialPayment ? advanceAmount : totalAmount;
    const mockLink = `https://pay.xepelin.com/${quote.id}?amount=${amount}`;
    setGeneratedPaymentLink(mockLink);
    
    toast({
      title: "Enlace de pago generado",
      description: "El enlace de pago ha sido creado exitosamente",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedPaymentLink);
    toast({
      title: "Enlace copiado",
      description: "El enlace de pago ha sido copiado al portapapeles",
    });
  };

  const handleConfirmQuote = () => {
    const updatedQuote = {
      ...quote,
      status: 'Confirmada',
      paymentData,
      generatedPaymentLink,
      isInvoiced: paymentData.isInvoiced
    };
    
    onConfirm(updatedQuote);
    toast({
      title: "Cotización confirmada",
      description: `La cotización ${quote.id} ha sido procesada exitosamente`,
    });
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Paso 1: Configurar Términos de Pago</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Términos de pago</Label>
          <Select value={paymentData.paymentTerms} onValueChange={(value) => 
            setPaymentData(prev => ({ ...prev, paymentTerms: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 días</SelectItem>
              <SelectItem value="15">15 días</SelectItem>
              <SelectItem value="30">30 días</SelectItem>
              <SelectItem value="60">60 días</SelectItem>
              <SelectItem value="90">90 días</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Fecha límite de pago</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !paymentData.dueDate && "text-gray-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {paymentData.dueDate ? format(paymentData.dueDate, "dd-MM-yyyy") : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={paymentData.dueDate}
                onSelect={(date) => setPaymentData(prev => ({ ...prev, dueDate: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="partial"
          checked={paymentData.partialPayment}
          onCheckedChange={(checked) => 
            setPaymentData(prev => ({ ...prev, partialPayment: checked === true }))
          }
        />
        <Label htmlFor="partial" className="text-blue-600 font-medium">
          Solicitar pago parcial (anticipo)
        </Label>
      </div>

      {paymentData.partialPayment && (
        <div className="space-y-2">
          <Label>Porcentaje del anticipo: {paymentData.advancePercentage}%</Label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={paymentData.advancePercentage}
            onChange={(e) => setPaymentData(prev => ({ ...prev, advancePercentage: parseInt(e.target.value) }))}
            className="w-full"
          />
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-blue-600 font-medium">
              Monto del anticipo: <span className="text-blue-700">${advanceAmount.toLocaleString()}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Paso 2: Generar Link de Pago</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-gray-600">Cliente:</Label>
            <p className="font-semibold">{quote.client}</p>
          </div>
          <div>
            <Label className="text-gray-600">Cotización:</Label>
            <p className="font-semibold">{quote.id}</p>
          </div>
          <div>
            <Label className="text-gray-600">Monto total:</Label>
            <p className="font-semibold">${totalAmount.toLocaleString()}</p>
          </div>
          <div>
            <Label className="text-gray-600">Monto a cobrar:</Label>
            <p className="font-semibold text-blue-600">
              ${(paymentData.partialPayment ? advanceAmount : totalAmount).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {!generatedPaymentLink ? (
        <Button 
          onClick={handleGeneratePaymentLink}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Link className="w-4 h-4 mr-2" />
          Generar enlace de pago
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Label className="text-green-700 font-medium">Enlace generado:</Label>
            <div className="mt-2 p-2 bg-white border border-green-300 rounded text-sm font-mono break-all">
              {generatedPaymentLink}
            </div>
          </div>
          <Button onClick={handleCopyLink} variant="outline" className="w-full">
            Copiar enlace
          </Button>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Paso 3: Registrar Pago</h3>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="payment-received"
          checked={paymentData.paymentReceived}
          onCheckedChange={(checked) => 
            setPaymentData(prev => ({ ...prev, paymentReceived: checked === true }))
          }
        />
        <Label htmlFor="payment-received" className="font-medium">
          El pago ya fue recibido
        </Label>
      </div>

      {paymentData.paymentReceived && (
        <div className="space-y-4 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Método de pago</Label>
              <Select value={paymentData.paymentMethod} onValueChange={(value) => 
                setPaymentData(prev => ({ ...prev, paymentMethod: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">
                    <div className="flex items-center">
                      <Banknote className="w-4 h-4 mr-2" />
                      Transferencia bancaria
                    </div>
                  </SelectItem>
                  <SelectItem value="cash">
                    <div className="flex items-center">
                      <Banknote className="w-4 h-4 mr-2" />
                      Efectivo
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Tarjeta
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Monto recibido</Label>
              <Input
                type="number"
                value={paymentData.paymentAmount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, paymentAmount: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label>Fecha de pago</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !paymentData.paymentDate && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {paymentData.paymentDate ? format(paymentData.paymentDate, "dd-MM-yyyy") : "Fecha de pago"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={paymentData.paymentDate}
                    onSelect={(date) => setPaymentData(prev => ({ ...prev, paymentDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {paymentData.paymentMethod === 'transfer' && (
              <div>
                <Label>Cuenta bancaria destino</Label>
                <Select value={paymentData.bankAccount} onValueChange={(value) => 
                  setPaymentData(prev => ({ ...prev, bankAccount: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bbva-123">BBVA - ****123</SelectItem>
                    <SelectItem value="santander-456">Santander - ****456</SelectItem>
                    <SelectItem value="banamex-789">Banamex - ****789</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div>
            <Label>Cuenta Xepelin</Label>
            <Select value={paymentData.xepelinAccount} onValueChange={(value) => 
              setPaymentData(prev => ({ ...prev, xepelinAccount: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cuenta Xepelin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xepelin-main">Xepelin Principal</SelectItem>
                <SelectItem value="xepelin-secondary">Xepelin Secundaria</SelectItem>
                <SelectItem value="xepelin-usd">Xepelin USD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Notas del pago</Label>
            <Textarea
              value={paymentData.paymentNotes}
              onChange={(e) => setPaymentData(prev => ({ ...prev, paymentNotes: e.target.value }))}
              placeholder="Notas adicionales sobre el pago..."
              className="min-h-20"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Paso 4: Facturación</h3>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="should-invoice"
          checked={paymentData.shouldInvoice}
          onCheckedChange={(checked) => 
            setPaymentData(prev => ({ ...prev, shouldInvoice: checked === true }))
          }
        />
        <Label htmlFor="should-invoice" className="font-medium">
          Generar factura para esta cotización
        </Label>
      </div>

      {paymentData.shouldInvoice && (
        <div className="space-y-4 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is-invoiced"
              checked={paymentData.isInvoiced}
              onCheckedChange={(checked) => 
                setPaymentData(prev => ({ ...prev, isInvoiced: checked === true }))
              }
            />
            <Label htmlFor="is-invoiced">
              Ya está facturado
            </Label>
          </div>

          {!paymentData.isInvoiced && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center text-blue-600">
                <FileText className="w-5 h-5 mr-2" />
                <span className="font-medium">Se generará la factura después de confirmar</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                La factura se creará automáticamente una vez confirmada la cotización
              </p>
            </div>
          )}

          {paymentData.isInvoiced && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Factura ya generada</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Esta cotización ya cuenta con su factura correspondiente
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Resumen de la confirmación:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Cotización:</span>
            <span className="font-medium">{quote.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Cliente:</span>
            <span className="font-medium">{quote.client}</span>
          </div>
          <div className="flex justify-between">
            <span>Monto total:</span>
            <span className="font-medium">${totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Términos de pago:</span>
            <span className="font-medium">{paymentData.paymentTerms} días</span>
          </div>
          {paymentData.partialPayment && (
            <div className="flex justify-between">
              <span>Anticipo ({paymentData.advancePercentage}%):</span>
              <span className="font-medium">${advanceAmount.toLocaleString()}</span>
            </div>
          )}
          {paymentData.paymentReceived && (
            <div className="flex justify-between">
              <span>Pago recibido:</span>
              <span className="font-medium text-green-600">${paymentData.paymentAmount.toLocaleString()}</span>
            </div>
          )}
          {paymentData.shouldInvoice && (
            <div className="flex justify-between">
              <span>Facturación:</span>
              <span className="font-medium">
                {paymentData.isInvoiced ? 'Ya facturado' : 'Se facturará'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirmar Cotización - {quote?.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                )}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={cn(
                    "w-12 h-0.5 mx-2",
                    step < currentStep ? "bg-blue-600" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleStepBack}
              disabled={currentStep === 1}
            >
              Anterior
            </Button>
            
            {currentStep < 4 ? (
              <Button onClick={handleStepNext}>
                Siguiente
              </Button>
            ) : (
              <Button 
                onClick={handleConfirmQuote}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar Cotización
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
