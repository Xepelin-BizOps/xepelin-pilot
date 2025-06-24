
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Upload, X } from 'lucide-react';

interface CompanySettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanySettingsPanel = ({ isOpen, onClose }: CompanySettingsPanelProps) => {
  const [companyData, setCompanyData] = useState({
    name: '',
    address: '',
    rfc: '',
    email: '',
    phone: '',
    password: ''
  });

  const [files, setFiles] = useState({
    logo: null as File | null,
    taxDocument: null as File | null,
    cerFile: null as File | null,
    keyFile: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFiles(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSave = () => {
    console.log('Guardando datos de la empresa:', { companyData, files });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Configuración de la Empresa</SheetTitle>
          <SheetDescription>
            Configura los datos y documentos fiscales de tu empresa
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Datos básicos */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Datos Básicos</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="company-name">Nombre de la Empresa</Label>
                <Input
                  id="company-name"
                  value={companyData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ingresa el nombre de tu empresa"
                />
              </div>
              
              <div>
                <Label htmlFor="company-address">Dirección</Label>
                <Textarea
                  id="company-address"
                  value={companyData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Dirección completa de la empresa"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="company-rfc">RFC</Label>
                <Input
                  id="company-rfc"
                  value={companyData.rfc}
                  onChange={(e) => handleInputChange('rfc', e.target.value)}
                  placeholder="RFC de la empresa"
                />
              </div>
            </div>
          </Card>

          {/* Datos de contacto */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Datos de Contacto</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="company-email">Correo Electrónico</Label>
                <Input
                  id="company-email"
                  type="email"
                  value={companyData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="correo@empresa.com"
                />
              </div>
              
              <div>
                <Label htmlFor="company-phone">Teléfono</Label>
                <Input
                  id="company-phone"
                  type="tel"
                  value={companyData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(55) 1234-5678"
                />
              </div>
            </div>
          </Card>

          {/* Logo */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Logo de la Empresa</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-sm text-gray-600 mb-2">
                {files.logo ? files.logo.name : 'Arrastra tu logo aquí o haz clic para seleccionar'}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
                className="hidden"
                id="logo-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                Seleccionar Logo
              </Button>
            </div>
          </Card>

          {/* Constancia de Situación Fiscal */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Constancia de Situación Fiscal</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-sm text-gray-600 mb-2">
                {files.taxDocument ? files.taxDocument.name : 'Sube tu constancia de situación fiscal (PDF)'}
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange('taxDocument', e.target.files?.[0] || null)}
                className="hidden"
                id="tax-document-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('tax-document-upload')?.click()}
              >
                Seleccionar PDF
              </Button>
            </div>
          </Card>

          {/* Certificados para facturación */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Certificados para Facturación</h3>
            <div className="space-y-4">
              {/* Archivo .cer */}
              <div>
                <Label>Archivo .cer (Certificado)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                  <div className="text-sm text-gray-600 mb-2">
                    {files.cerFile ? files.cerFile.name : 'Selecciona tu archivo .cer'}
                  </div>
                  <input
                    type="file"
                    accept=".cer"
                    onChange={(e) => handleFileChange('cerFile', e.target.files?.[0] || null)}
                    className="hidden"
                    id="cer-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('cer-upload')?.click()}
                  >
                    Seleccionar .cer
                  </Button>
                </div>
              </div>

              {/* Archivo .key */}
              <div>
                <Label>Archivo .key (Llave Privada)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                  <div className="text-sm text-gray-600 mb-2">
                    {files.keyFile ? files.keyFile.name : 'Selecciona tu archivo .key'}
                  </div>
                  <input
                    type="file"
                    accept=".key"
                    onChange={(e) => handleFileChange('keyFile', e.target.files?.[0] || null)}
                    className="hidden"
                    id="key-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('key-upload')?.click()}
                  >
                    Seleccionar .key
                  </Button>
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <Label htmlFor="cert-password">Contraseña del Certificado</Label>
                <Input
                  id="cert-password"
                  type="password"
                  value={companyData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Contraseña de la llave privada"
                />
              </div>
            </div>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Guardar Configuración
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
