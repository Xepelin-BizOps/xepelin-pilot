
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface BillingDataSelectorProps {
  onDataSelected: (data: BillingData) => void;
  selectedData?: BillingData | null;
}

export const BillingDataSelector: React.FC<BillingDataSelectorProps> = ({
  onDataSelected,
  selectedData
}) => {
  const [savedBillingData, setSavedBillingData] = useState<BillingData[]>([
    {
      id: '1',
      name: 'Empresa ABC S.A. de C.V.',
      rfc: 'ABC123456789',
      codigoPostal: '01234',
      usoCfdi: 'G03',
      metodoPago: 'PUE',
      formaPago: '03',
      regimenFiscal: '601'
    },
    {
      id: '2',
      name: 'Comercial XYZ',
      rfc: 'XYZ987654321',
      codigoPostal: '54321',
      usoCfdi: 'G01',
      metodoPago: 'PPD',
      formaPago: '01',
      regimenFiscal: '612'
    }
  ]);
  
  const [showNewForm, setShowNewForm] = useState(false);
  const [newBillingData, setNewBillingData] = useState<Partial<BillingData>>({
    name: '',
    rfc: '',
    codigoPostal: '',
    usoCfdi: '',
    metodoPago: '',
    formaPago: '',
    regimenFiscal: ''
  });
  
  const { toast } = useToast();

  const handleSelectBillingData = (dataId: string) => {
    const selectedBilling = savedBillingData.find(data => data.id === dataId);
    if (selectedBilling) {
      onDataSelected(selectedBilling);
    }
  };

  const handleSaveNewBillingData = () => {
    if (!newBillingData.name || !newBillingData.rfc || !newBillingData.codigoPostal || 
        !newBillingData.usoCfdi || !newBillingData.metodoPago || !newBillingData.formaPago || 
        !newBillingData.regimenFiscal) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    const newData: BillingData = {
      id: Date.now().toString(),
      name: newBillingData.name!,
      rfc: newBillingData.rfc!,
      codigoPostal: newBillingData.codigoPostal!,
      usoCfdi: newBillingData.usoCfdi!,
      metodoPago: newBillingData.metodoPago!,
      formaPago: newBillingData.formaPago!,
      regimenFiscal: newBillingData.regimenFiscal!
    };

    setSavedBillingData([...savedBillingData, newData]);
    onDataSelected(newData);
    setShowNewForm(false);
    setNewBillingData({
      name: '',
      rfc: '',
      codigoPostal: '',
      usoCfdi: '',
      metodoPago: '',
      formaPago: '',
      regimenFiscal: ''
    });

    toast({
      title: "Datos guardados",
      description: "Los datos de facturación se han guardado exitosamente",
    });
  };

  const handleDeleteBillingData = (dataId: string) => {
    setSavedBillingData(savedBillingData.filter(data => data.id !== dataId));
    toast({
      title: "Datos eliminados",
      description: "Los datos de facturación se han eliminado",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Datos de Facturación</h3>
        <Button 
          onClick={() => setShowNewForm(!showNewForm)} 
          variant="outline" 
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Nuevo
        </Button>
      </div>

      {/* Datos guardados */}
      {savedBillingData.length > 0 && (
        <div className="space-y-3">
          <Label>Seleccionar datos existentes:</Label>
          <div className="grid gap-3">
            {savedBillingData.map((data) => (
              <Card key={data.id} className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{data.name}</h4>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSelectBillingData(data.id)}
                          className="h-8 px-2 text-xs"
                        >
                          Seleccionar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteBillingData(data.id)}
                          className="h-8 px-2 text-xs text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><strong>RFC:</strong> {data.rfc}</p>
                      <p><strong>C.P.:</strong> {data.codigoPostal}</p>
                      <p><strong>Uso CFDI:</strong> {data.usoCfdi}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Formulario para nuevos datos */}
      {showNewForm && (
        <Card className="p-4">
          <h4 className="font-semibold mb-4">Agregar Nuevos Datos de Facturación</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre/Razón Social *</Label>
              <Input
                id="name"
                value={newBillingData.name}
                onChange={(e) => setNewBillingData({...newBillingData, name: e.target.value})}
                placeholder="Empresa ABC S.A. de C.V."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newRfc">RFC *</Label>
                <Input
                  id="newRfc"
                  value={newBillingData.rfc}
                  onChange={(e) => setNewBillingData({...newBillingData, rfc: e.target.value})}
                  placeholder="ABC123456789"
                />
              </div>
              <div>
                <Label htmlFor="newCp">Código Postal *</Label>
                <Input
                  id="newCp"
                  value={newBillingData.codigoPostal}
                  onChange={(e) => setNewBillingData({...newBillingData, codigoPostal: e.target.value})}
                  placeholder="01234"
                />
              </div>
            </div>

            <div>
              <Label>Uso del CFDI *</Label>
              <Select value={newBillingData.usoCfdi} onValueChange={(value) => setNewBillingData({...newBillingData, usoCfdi: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar uso del CFDI" />
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
                <Label>Método de pago *</Label>
                <Select value={newBillingData.metodoPago} onValueChange={(value) => setNewBillingData({...newBillingData, metodoPago: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUE">PUE - Pago en una sola exhibición</SelectItem>
                    <SelectItem value="PPD">PPD - Pago en parcialidades o diferido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Forma de pago *</Label>
                <Select value={newBillingData.formaPago} onValueChange={(value) => setNewBillingData({...newBillingData, formaPago: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar forma" />
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
              <Label>Régimen fiscal del receptor *</Label>
              <Select value={newBillingData.regimenFiscal} onValueChange={(value) => setNewBillingData({...newBillingData, regimenFiscal: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar régimen fiscal" />
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

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveNewBillingData}>
                Guardar Datos
              </Button>
            </div>
          </div>
        </Card>
      )}

      {selectedData && (
        <Card className="p-4 bg-green-50 border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">Datos seleccionados:</h4>
          <div className="text-sm text-green-800 space-y-1">
            <p><strong>Nombre:</strong> {selectedData.name}</p>
            <p><strong>RFC:</strong> {selectedData.rfc}</p>
            <p><strong>Código Postal:</strong> {selectedData.codigoPostal}</p>
            <p><strong>Uso CFDI:</strong> {selectedData.usoCfdi}</p>
            <p><strong>Método de Pago:</strong> {selectedData.metodoPago}</p>
            <p><strong>Forma de Pago:</strong> {selectedData.formaPago}</p>
            <p><strong>Régimen Fiscal:</strong> {selectedData.regimenFiscal}</p>
          </div>
        </Card>
      )}
    </div>
  );
};
