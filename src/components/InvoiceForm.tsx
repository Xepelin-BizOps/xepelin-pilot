import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CIFUploader } from '@/components/CIFUploader';
import { BillingDataSelector } from '@/components/BillingDataSelector';

interface InvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  orderRef: string;
  totalAmount: number;
  clientName: string;
  orderDate: string;
}

interface BillingData {
  id: string;
  name: string;
  rfc: string;
  codigoPostal: string;
  usoCfdi: string;
  metodoPago: string;
  formaPago: string;
  regimenFiscal: string;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  isOpen,
  onClose,
  orderRef,
  totalAmount,
  clientName,
  orderDate
}) => {
  const [rfcReceptor, setRfcReceptor] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [usoCfdi, setUsoCfdi] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [formaPago, setFormaPago] = useState('');
  const [regimenFiscal, setRegimenFiscal] = useState('');
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [selectedBillingData, setSelectedBillingData] = useState<BillingData | null>(null);
  const [useManualEntry, setUseManualEntry] = useState(false);
  const { toast } = useToast();

  const handleCIFDataExtracted = (data: {
    rfc?: string;
    codigoPostal?: string;
    regimenFiscal?: string;
  }) => {
    if (data.rfc) setRfcReceptor(data.rfc);
    if (data.codigoPostal) setCodigoPostal(data.codigoPostal);
    if (data.regimenFiscal) setRegimenFiscal(data.regimenFiscal);
  };

  const handleBillingDataSelected = (data: BillingData) => {
    setSelectedBillingData(data);
    setRfcReceptor(data.rfc);
    setCodigoPostal(data.codigoPostal);
    setUsoCfdi(data.usoCfdi);
    setMetodoPago(data.metodoPago);
    setFormaPago(data.formaPago);
    setRegimenFiscal(data.regimenFiscal);
    setUseManualEntry(false);
  };

  const handleManualEntry = () => {
    setUseManualEntry(true);
    setSelectedBillingData(null);
    // Keep current values if any
  };

  const handleGenerateInvoice = () => {
    console.log('Generando factura...', {
      orderRef,
      clientName,
      totalAmount,
      rfcReceptor,
      codigoPostal,
      usoCfdi,
      metodoPago,
      formaPago,
      regimenFiscal
    });
    
    setInvoiceGenerated(true);
    toast({
      title: "Factura generada",
      description: "La factura se ha generado exitosamente",
    });
  };

  const handleDownloadInvoice = () => {
    console.log('Descargando factura...');
    toast({
      title: "Descargando factura",
      description: "El archivo PDF se está descargando",
    });
  };

  const handleCancelInvoice = () => {
    console.log('Cancelando factura...');
    setInvoiceGenerated(false);
    toast({
      title: "Factura cancelada",
      description: "La factura ha sido cancelada",
      variant: "destructive",
    });
  };

  const handleClose = () => {
    setInvoiceGenerated(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {invoiceGenerated ? 'Factura Generada' : 'Emitir Factura'}
          </DialogTitle>
        </DialogHeader>
        
        {!invoiceGenerated ? (
          <div className="space-y-6">
            {/* Información de la orden */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Información de la orden</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-blue-700 font-medium">Cliente:</Label>
                  <p className="text-blue-900 font-semibold">{clientName}</p>
                </div>
                <div>
                  <Label className="text-blue-700 font-medium">Folio:</Label>
                  <p className="text-blue-900 font-semibold">{orderRef}</p>
                </div>
                <div>
                  <Label className="text-blue-700 font-medium">Monto:</Label>
                  <p className="text-blue-900 font-semibold">${totalAmount.toLocaleString()}.00</p>
                </div>
                <div>
                  <Label className="text-blue-700 font-medium">Fecha:</Label>
                  <p className="text-blue-900 font-semibold">{orderDate}</p>
                </div>
              </div>
            </Card>

            {/* Selector de datos de facturación */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <BillingDataSelector
                  onDataSelected={handleBillingDataSelected}
                  selectedData={selectedBillingData}
                />
                
                {!useManualEntry && !selectedBillingData && (
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      onClick={handleManualEntry}
                      className="w-full"
                    >
                      Ingresar datos manualmente
                    </Button>
                  </div>
                )}
              </div>

              {/* Formulario manual o campos editables */}
              {(useManualEntry || selectedBillingData) && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Datos de Facturación</h3>
                    {selectedBillingData && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleManualEntry}
                      >
                        Editar manualmente
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rfc" className="text-gray-700">RFC del receptor *</Label>
                      <Input 
                        id="rfc"
                        value={rfcReceptor}
                        onChange={(e) => setRfcReceptor(e.target.value)}
                        placeholder="MOGP800516XS1"
                        className="border-gray-300"
                        disabled={!useManualEntry && selectedBillingData !== null}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cp" className="text-gray-700">Código Postal *</Label>
                      <Input 
                        id="cp"
                        value={codigoPostal}
                        onChange={(e) => setCodigoPostal(e.target.value)}
                        placeholder="01234"
                        className="border-gray-300"
                        disabled={!useManualEntry && selectedBillingData !== null}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700">Uso del CFDI *</Label>
                    <Select 
                      value={usoCfdi} 
                      onValueChange={setUsoCfdi}
                      disabled={!useManualEntry && selectedBillingData !== null}
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="G03 - Gastos en general" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="G01">G01 - Adquisición de mercancías</SelectItem>
                        <SelectItem value="G02">G02 - Devoluciones, descuentos o bonificaciones</SelectItem>
                        <SelectItem value="G03">G03 - Gastos en general</SelectItem>
                        <SelectItem value="I01">I01 - Construcciones</SelectItem>
                        <SelectItem value="I02">I02 - Mobilario y equipo de oficina</SelectItem>
                        <SelectItem value="P01">P01 - Por definir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700">Método de pago *</Label>
                      <Select 
                        value={metodoPago} 
                        onValueChange={setMetodoPago}
                        disabled={!useManualEntry && selectedBillingData !== null}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="PUE - Pago en una sola exhibición" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PUE">PUE - Pago en una sola exhibición</SelectItem>
                          <SelectItem value="PPD">PPD - Pago en parcialidades o diferido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-700">Forma de pago *</Label>
                      <Select 
                        value={formaPago} 
                        onValueChange={setFormaPago}
                        disabled={!useManualEntry && selectedBillingData !== null}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="03 - Transferencia electrónica de fondos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="01">01 - Efectivo</SelectItem>
                          <SelectItem value="02">02 - Cheque nominativo</SelectItem>
                          <SelectItem value="03">03 - Transferencia electrónica de fondos</SelectItem>
                          <SelectItem value="04">04 - Tarjeta de crédito</SelectItem>
                          <SelectItem value="28">28 - Tarjeta de débito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700">Régimen fiscal del receptor *</Label>
                    <Select 
                      value={regimenFiscal} 
                      onValueChange={setRegimenFiscal}
                      disabled={!useManualEntry && selectedBillingData !== null}
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="601 - General de Ley Personas Morales" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="601">601 - General de Ley Personas Morales</SelectItem>
                        <SelectItem value="603">603 - Personas Morales con Fines no Lucrativos</SelectItem>
                        <SelectItem value="605">605 - Sueldos y Salarios e Ingresos Asimilados a Salarios</SelectItem>
                        <SelectItem value="606">606 - Arrendamiento</SelectItem>
                        <SelectItem value="612">612 - Personas Físicas con Actividades Empresariales y Profesionales</SelectItem>
                        <SelectItem value="621">621 - Incorporación Fiscal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* CIF Uploader solo cuando sea entrada manual */}
                  {useManualEntry && (
                    <div>
                      <CIFUploader onDataExtracted={handleCIFDataExtracted} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleGenerateInvoice}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!rfcReceptor || !codigoPostal || !usoCfdi || !metodoPago || !formaPago || !regimenFiscal}
              >
                Emitir factura
              </Button>
            </div>
          </div>
        ) : (
          /* Vista de factura generada */
          <div className="space-y-6">
            <Card className="p-4 bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Factura generada exitosamente</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-green-700 font-medium">Cliente:</Label>
                  <p className="text-green-900 font-semibold">{clientName}</p>
                </div>
                <div>
                  <Label className="text-green-700 font-medium">Folio Orden:</Label>
                  <p className="text-green-900 font-semibold">{orderRef}</p>
                </div>
                <div>
                  <Label className="text-green-700 font-medium">Folio Fiscal:</Label>
                  <p className="text-green-900 font-semibold">A1B2C3D4-E5F6-7890-ABCD-EFGH12345678</p>
                </div>
                <div>
                  <Label className="text-green-700 font-medium">Monto:</Label>
                  <p className="text-green-900 font-semibold">${totalAmount.toLocaleString()}.00</p>
                </div>
              </div>
            </Card>

            <div className="flex justify-between items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleCancelInvoice}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar Factura
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Cerrar
                </Button>
                <Button 
                  onClick={handleDownloadInvoice}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
