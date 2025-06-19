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
import { CheckCircle2, CreditCard, Banknote, Smartphone, Building2, Copy, MessageSquare, Mail } from 'lucide-react';
import { InvoiceForm } from '@/components/InvoiceForm';

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
  const [customTerms, setCustomTerms] = useState('');
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [xepelinAccount, setXepelinAccount] = useState('');
  const [paymentLinkGenerated, setPaymentLinkGenerated] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [partialPayment, setPartialPayment] = useState(false);
  const [partialAmount, setPartialAmount] = useState('');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const { toast } = useToast();

  // Check if quote is already invoiced
  const isAlreadyInvoiced = quote?.isInvoiced || false;

  // Calculate partial payment amount and remaining balance
  const partialAmountNumber = parseFloat(partialAmount) || 0;
  const totalAmount = quote?.amount || 0;
  const remainingBalance = totalAmount - partialAmountNumber;

  const getStepTitle = (step: number) => {
    const titles = [
      'Términos de Pago',
      'Registrar Pago',
      'Link de Pago', 
      'Facturación',
      'Orden de Venta'
    ];
    return titles[step - 1];
  };

  const getTotalSteps = () => {
    let steps = 1; // Términos de Pago (siempre)
    
    if (alreadyPaid) {
      steps += 1; // Registrar Pago
    } else {
      steps += 1; // Link de Pago
    }
    
    if (!isAlreadyInvoiced) {
      steps += 1; // Facturación (opcional)
    }
    
    steps += 1; // Orden de Venta (siempre)
    
    return steps;
  };

  const getNextStepNumber = () => {
    if (currentStep === 1) {
      return alreadyPaid ? 2 : 3; // Si ya pagó -> Registrar Pago, si no -> Link de Pago
    } else if (currentStep === 2 && alreadyPaid) {
      return isAlreadyInvoiced ? 5 : 4; // Después de Registrar Pago -> Facturación o Orden de Venta
    } else if (currentStep === 3 && !alreadyPaid) {
      return isAlreadyInvoiced ? 5 : 4; // Después de Link de Pago -> Facturación o Orden de Venta
    } else if (currentStep === 4) {
      return 5; // Después de Facturación -> Orden de Venta
    }
    return currentStep + 1;
  };

  const handleNextStep = () => {
    const nextStep = getNextStepNumber();
    setCurrentStep(nextStep);
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(1);
    } else if (currentStep === 4) {
      setCurrentStep(alreadyPaid ? 2 : 3);
    } else if (currentStep === 5) {
      setCurrentStep(isAlreadyInvoiced ? (alreadyPaid ? 2 : 3) : 4);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGeneratePaymentLink = () => {
    const amount = partialPayment ? partialAmountNumber : quote?.amount;
    const link = `https://pay.xepelin.com/quote-${quote?.id}-${Date.now()}`;
    setPaymentLink(link);
    setPaymentLinkGenerated(true);
    toast({
      title: "Link de pago generado",
      description: `Link creado para ${partialPayment ? 'pago parcial de' : ''} $${amount?.toLocaleString()}`,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    toast({
      title: "Link copiado",
      description: "El link de pago ha sido copiado al portapapeles",
    });
  };

  const handleSendWhatsApp = () => {
    const message = `Hola, te comparto el link de pago para tu cotización: ${paymentLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendEmail = () => {
    const subject = `Link de pago - Cotización ${quote?.id}`;
    const body = `Estimado cliente,\n\nTe comparto el link de pago para tu cotización:\n${paymentLink}\n\nSaludos.`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleInvoiceFormClose = () => {
    setShowInvoiceForm(false);
    // Assume invoice was generated when form is closed after being opened
    setInvoiceGenerated(true);
    toast({
      title: "Factura generada",
      description: "La factura se ha generado exitosamente",
    });
    handleNextStep();
  };

  const handleSkipInvoicing = () => {
    toast({
      title: "Facturación omitida",
      description: "Se continuará sin generar factura",
    });
    handleNextStep();
  };

  const handleCreateSalesOrder = () => {
    const updatedQuote = {
      ...quote,
      status: 'Confirmada',
      paymentTerms: paymentTerms === 'custom' ? customTerms : paymentTerms,
      paymentLinkGenerated,
      paymentRegistered: alreadyPaid,
      paymentMethod,
      bankAccount,
      xepelinAccount,
      alreadyPaid,
      invoiceGenerated: isAlreadyInvoiced || invoiceGenerated,
      salesOrderCreated: true
    };

    if (onConfirm) {
      onConfirm(updatedQuote);
    }

    toast({
      title: "Proceso completado",
      description: "Cotización confirmada y Orden de Venta creada exitosamente",
    });
    onClose();
  };

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 1:
        return paymentTerms && (paymentTerms !== 'custom' || customTerms);
      case 2:
        return alreadyPaid && paymentMethod && (paymentMethod !== 'transfer' || (bankAccount && xepelinAccount));
      case 3:
        return !alreadyPaid && paymentLinkGenerated;
      case 4:
        return true; // Facturación es opcional
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Términos de Pago
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Paso 1: Definir Términos de Pago</h3>
            <div className="space-y-3">
              <Label htmlFor="paymentTerms">Plazo de pago (días)</Label>
              <RadioGroup value={paymentTerms} onValueChange={setPaymentTerms}>
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
                  value={customTerms}
                  onChange={(e) => setCustomTerms(e.target.value)}
                />
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Estado del pago</Label>
              <RadioGroup
                value={alreadyPaid ? "paid" : "pending"}
                onValueChange={(value) => setAlreadyPaid(value === "paid")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="payment-pending" />
                  <Label htmlFor="payment-pending">Pendiente de pago</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="payment-paid" />
                  <Label htmlFor="payment-paid">Ya se pagó</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2: // Registrar Pago
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Paso 2: Registrar el Pago</h3>
            <div className="space-y-3">
              <Label>Método de pago utilizado</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Building2 className="w-4 h-4" />
                  <Label htmlFor="transfer">Transferencia bancaria</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Banknote className="w-4 h-4" />
                  <Label htmlFor="cash">Efectivo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <CreditCard className="w-4 h-4" />
                  <Label htmlFor="card">Tarjeta</Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'transfer' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="bankAccount">Cuenta bancaria del cliente</Label>
                    <Input
                      id="bankAccount"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      placeholder="Número de cuenta o banco"
                    />
                  </div>
                  <div>
                    <Label htmlFor="xepelinAccount">Cuenta Xepelin destino</Label>
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
          </div>
        );

      case 3: // Generar Link de Pago
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Paso 3: Generar Link de Pago</h3>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Cliente:</strong> {quote?.client}</p>
                <p><strong>Monto total:</strong> ${totalAmount?.toLocaleString()}</p>
                <p><strong>Plazo:</strong> {paymentTerms === 'custom' ? customTerms : paymentTerms} días</p>
              </div>

              <div className="space-y-3">
                <Label>Tipo de pago</Label>
                <RadioGroup
                  value={partialPayment ? "partial" : "full"}
                  onValueChange={(value) => setPartialPayment(value === "partial")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full-payment" />
                    <Label htmlFor="full-payment">Pago completo - ${totalAmount?.toLocaleString()}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="partial" id="partial-payment" />
                    <Label htmlFor="partial-payment">Pago parcial</Label>
                  </div>
                </RadioGroup>

                {partialPayment && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="partialAmount">Monto del pago parcial</Label>
                      <Input
                        id="partialAmount"
                        type="number"
                        value={partialAmount}
                        onChange={(e) => setPartialAmount(e.target.value)}
                        placeholder="Ingresa el monto"
                        max={totalAmount}
                      />
                    </div>
                    
                    {partialAmountNumber > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Monto a pagar ahora:</span>
                            <span className="font-semibold text-blue-800">${partialAmountNumber.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Saldo pendiente:</span>
                            <span className="font-semibold text-blue-800">${remainingBalance.toLocaleString()}</span>
                          </div>
                          <div className="border-t border-blue-200 pt-2 mt-2">
                            <div className="flex justify-between">
                              <span className="text-blue-700 font-medium">Total de la cotización:</span>
                              <span className="font-bold text-blue-900">${totalAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {partialAmountNumber > totalAmount && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-red-700 text-sm">
                          El monto parcial no puede ser mayor al monto total de la cotización.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!paymentLinkGenerated ? (
                <Button 
                  onClick={handleGeneratePaymentLink} 
                  className="w-full"
                  disabled={partialPayment && (partialAmountNumber <= 0 || partialAmountNumber > totalAmount)}
                >
                  Generar Link de Pago
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Link de pago generado exitosamente</span>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg break-all text-sm">
                    {paymentLink}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={handleCopyLink} variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                    <Button onClick={handleSendWhatsApp} variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button onClick={handleSendEmail} variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4: // Facturación (Opcional)
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Paso 4: Facturación (Opcional)</h3>
            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-semibold mb-2">¿Deseas generar la factura ahora?</p>
                <p className="text-sm text-blue-700">
                  Puedes generar la factura ahora o omitir este paso. La cotización se confirmará de cualquier manera.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Cliente:</strong> {quote?.client}</p>
                <p><strong>Monto:</strong> ${quote?.amount?.toLocaleString()}</p>
                <p><strong>Cotización:</strong> {quote?.id}</p>
              </div>
              
              {!invoiceGenerated ? (
                <div className="flex space-x-3">
                  <Button onClick={() => setShowInvoiceForm(true)} className="flex-1">
                    Generar Factura
                  </Button>
                  <Button onClick={handleSkipInvoicing} variant="outline" className="flex-1">
                    Omitir Facturación
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Factura generada exitosamente</span>
                </div>
              )}
            </div>
          </div>
        );

      case 5: // Crear Orden de Venta
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Paso 5: Crear Orden de Venta</h3>
            <div className="space-y-3">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 text-green-800 mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Proceso completado</span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <p>• Términos de pago: {paymentTerms === 'custom' ? customTerms : paymentTerms} días</p>
                  <p>• Pago: {alreadyPaid ? `Registrado (${paymentMethod})` : paymentLinkGenerated ? 'Link generado' : 'Pendiente'}</p>
                  <p>• Factura: {isAlreadyInvoiced || invoiceGenerated ? 'Generada' : 'Omitida'}</p>
                  <p>• Orden de Venta: Lista para crear</p>
                </div>
              </div>
              <Button onClick={handleCreateSalesOrder} className="w-full">
                Crear Orden de Venta y Finalizar
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirmar Cotización - {quote?.id}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                Paso {currentStep} de {getTotalSteps()}: {getStepTitle(currentStep)}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
                />
              </div>
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
                  disabled={!canProceedFromStep(currentStep)}
                >
                  Siguiente
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Form Modal */}
      {showInvoiceForm && quote && (
        <InvoiceForm
          isOpen={showInvoiceForm}
          onClose={handleInvoiceFormClose}
          orderRef={quote.id}
          totalAmount={quote.amount}
          clientName={quote.client}
          orderDate={quote.date}
        />
      )}
    </>
  );
};
