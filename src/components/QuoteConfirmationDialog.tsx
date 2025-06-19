
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, CreditCard, Banknote, Smartphone, Building2 } from 'lucide-react';

interface QuoteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quote: any;
  onConfirm?: (updatedQuote: any) => void;
}

export const QuoteConfirmationDialog: React.FC<QuoteConfirmationDialogProps> = ({ 
  isOpen, 
  onClose, 
  quote,
  onConfirm
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentTerms, setPaymentTerms] = useState('30');
  const [paymentLinkGenerated, setPaymentLinkGenerated] = useState(false);
  const [paymentRegistered, setPaymentRegistered] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [xepelinAccount, setXepelinAccount] = useState('');
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const { toast } = useToast();

  // Check if quote is already invoiced
  const isAlreadyInvoiced = quote?.isInvoiced || false;

  const getTotalSteps = () => {
    if (alreadyPaid && isAlreadyInvoiced) return 3; // Steps 1, 2, and final
    if (alreadyPaid || isAlreadyInvoiced) return 4; // Skip one step
    return 5; // All steps
  };

  const getStepNumber = (step: number) => {
    if (alreadyPaid && step > 2) return step - 1; // Skip step 3 when already paid
    return step;
  };

  const handleNextStep = () => {
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps) {
      let nextStep = currentStep + 1;
      
      // Skip step 3 if already paid (since payment is already registered)
      if (alreadyPaid && nextStep === 3) {
        nextStep = 4;
      }
      
      // Skip step 4 if already invoiced
      if (isAlreadyInvoiced && nextStep === 4) {
        nextStep = 5;
      }
      
      setCurrentStep(nextStep);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      let prevStep = currentStep - 1;
      
      // Skip step 4 if already invoiced (going backwards)
      if (isAlreadyInvoiced && prevStep === 4) {
        prevStep = 3;
      }
      
      // Skip step 3 if already paid (going backwards)
      if (alreadyPaid && prevStep === 3) {
        prevStep = 2;
      }
      
      setCurrentStep(prevStep);
    }
  };

  const handleGeneratePaymentLink = () => {
    setPaymentLinkGenerated(true);
    toast({
      title: "Link de pago generado",
      description: "El link de pago ha sido creado exitosamente",
    });
  };

  const handleGenerateInvoice = () => {
    setInvoiceGenerated(true);
    toast({
      title: "Factura generada",
      description: "La factura ha sido creada exitosamente",
    });
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleFinish = () => {
    const updatedQuote = {
      ...quote,
      status: 'Confirmada',
      paymentTerms,
      paymentLinkGenerated,
      paymentRegistered: alreadyPaid || paymentRegistered,
      paymentMethod,
      bankAccount,
      xepelinAccount,
      invoiceGenerated: isAlreadyInvoiced || invoiceGenerated,
      alreadyPaid
    };

    if (onConfirm) {
      onConfirm(updatedQuote);
    }

    toast({
      title: "Proceso completado",
      description: "La cotización ha sido confirmada exitosamente",
    });
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Definir Términos de Pago</h3>
            <div className="space-y-3">
              <Label htmlFor="paymentTerms">Plazo de pago (días)</Label>
              <RadioGroup
                value={paymentTerms}
                onValueChange={setPaymentTerms}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="15" id="15" />
                  <Label htmlFor="15">15 días</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30" id="30" />
                  <Label htmlFor="30">30 días</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="45" id="45" />
                  <Label htmlFor="45">45 días</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60" id="60" />
                  <Label htmlFor="60">60 días</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Personalizado</Label>
                </div>
              </RadioGroup>
              {paymentTerms === 'custom' && (
                <Input
                  placeholder="Días personalizados"
                  type="number"
                  className="mt-2"
                />
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Estado del pago</Label>
              <RadioGroup
                value={alreadyPaid ? "paid" : "pending"}
                onValueChange={(value) => {
                  const isPaid = value === "paid";
                  setAlreadyPaid(isPaid);
                  if (isPaid) {
                    setPaymentRegistered(true);
                  } else {
                    setPaymentRegistered(false);
                    setPaymentMethod('');
                    setBankAccount('');
                    setXepelinAccount('');
                  }
                }}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="payment-pending" />
                  <Label htmlFor="payment-pending">Pendiente de pago</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="payment-paid" />
                  <Label htmlFor="payment-paid">Ya se pagó - Registrar pago</Label>
                </div>
              </RadioGroup>

              {alreadyPaid && (
                <div className="space-y-3 border-t pt-3">
                  <Label>Método de pago</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transfer" id="transfer-step1" />
                      <Building2 className="w-4 h-4" />
                      <Label htmlFor="transfer-step1">Transferencia bancaria</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash-step1" />
                      <Banknote className="w-4 h-4" />
                      <Label htmlFor="cash-step1">Efectivo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card-step1" />
                      <CreditCard className="w-4 h-4" />
                      <Label htmlFor="card-step1">Tarjeta</Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'transfer' && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="bankAccountStep1">Cuenta bancaria del cliente</Label>
                        <Input
                          id="bankAccountStep1"
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          placeholder="Número de cuenta o banco"
                        />
                      </div>
                      <div>
                        <Label htmlFor="xepelinAccountStep1">Cuenta Xepelin destino</Label>
                        <Select value={xepelinAccount} onValueChange={setXepelinAccount}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cuenta Xepelin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="xepelin-main">Xepelin - Cuenta Principal</SelectItem>
                            <SelectItem value="xepelin-secondary">Xepelin - Cuenta Secundaria</SelectItem>
                            <SelectItem value="xepelin-usd">Xepelin - USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isAlreadyInvoiced && (
                <>
                  <Separator />
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 text-green-800">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">Ya está facturado</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Esta cotización ya cuenta con factura emitida.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generar Link de Pago</h3>
            <div className="space-y-3">
              {alreadyPaid ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">Pago ya registrado</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Se omite la generación del link de pago porque ya se registró el pago.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600">
                    Genera un link de pago para facilitar el proceso de cobro al cliente.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Cliente:</strong> {quote?.client}</p>
                    <p><strong>Monto:</strong> ${quote?.amount?.toLocaleString()}</p>
                    <p><strong>Plazo:</strong> {paymentTerms} días</p>
                  </div>
                  {!paymentLinkGenerated ? (
                    <Button onClick={handleGeneratePaymentLink} className="w-full">
                      Generar Link de Pago
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Link de pago generado exitosamente</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 4:
        if (isAlreadyInvoiced) {
          // Skip to final step if already invoiced
          return renderStepContent.call(this, { currentStep: 5 });
        }
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Facturación</h3>
            <div className="space-y-3">
              <Label>¿Se debe generar factura?</Label>
              <RadioGroup
                value={invoiceGenerated ? "generated" : "pending"}
                onValueChange={(value) => setInvoiceGenerated(value === "generated")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="invoice-pending" />
                  <Label htmlFor="invoice-pending">Generar factura</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="generated" id="invoice-generated" />
                  <Label htmlFor="invoice-generated">Ya está facturado</Label>
                </div>
              </RadioGroup>

              {!invoiceGenerated && (
                <Button onClick={handleGenerateInvoice} className="w-full mt-3">
                  Generar Factura
                </Button>
              )}

              {invoiceGenerated && (
                <div className="flex items-center space-x-2 text-green-600 mt-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Factura completada</span>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Proceso Completado</h3>
            <div className="space-y-3">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 text-green-800 mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Cotización confirmada exitosamente</span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <p>• Términos de pago: {paymentTerms} días</p>
                  <p>• Link de pago: {alreadyPaid ? 'No requerido (ya pagado)' : paymentLinkGenerated ? 'Generado' : 'No generado'}</p>
                  <p>• Pago: {alreadyPaid || paymentRegistered ? `Registrado (${paymentMethod})` : 'Pendiente'}</p>
                  <p>• Factura: {isAlreadyInvoiced || invoiceGenerated ? 'Completada' : 'Pendiente'}</p>
                </div>
              </div>
              <Button onClick={handleFinish} className="w-full">
                Finalizar Proceso
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepNames = () => {
    const baseSteps = ['Términos de Pago', 'Link de Pago'];
    
    if (!alreadyPaid) {
      // Only add invoice step if not already invoiced
      if (!isAlreadyInvoiced) {
        baseSteps.push('Facturación');
      }
    } else {
      // If already paid, only add invoice step if not already invoiced
      if (!isAlreadyInvoiced) {
        baseSteps.push('Facturación');
      }
    }
    
    baseSteps.push('Completado');
    return baseSteps;
  };

  const steps = getStepNames();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirmar Cotización - {quote?.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= getStepNumber(currentStep)
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={`w-12 h-0.5 mx-2 ${
                      index + 1 < getStepNumber(currentStep) ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <Card className="p-6">
            {renderStepContent()}
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
            >
              Anterior
            </Button>
            
            {currentStep < getTotalSteps() && (
              <Button 
                onClick={handleNextStep}
                disabled={
                  (currentStep === 1 && alreadyPaid && !paymentMethod) ||
                  (currentStep === 2 && !alreadyPaid && !paymentLinkGenerated) ||
                  (currentStep === 4 && !invoiceGenerated && !paymentRegistered && !alreadyPaid)
                }
              >
                Siguiente
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
