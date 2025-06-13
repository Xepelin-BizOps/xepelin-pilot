
import React, { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CIFUploaderProps {
  onCIFProcessed: (data: any) => void;
  className?: string;
}

export const CIFUploader: React.FC<CIFUploaderProps> = ({ onCIFProcessed, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processCIF = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    // Simular procesamiento del CIF
    setTimeout(() => {
      const mockCIFData = {
        rfc: 'XAXX010101000',
        codigoPostal: '01234',
        usoCfdi: 'G03',
        metodoPago: 'PUE',
        formaPago: '03',
        regimenFiscal: '601',
        razunSocial: 'Empresa Ejemplo S.A. de C.V.',
        domicilio: 'Calle Ejemplo 123, Col. Centro'
      };

      onCIFProcessed(mockCIFData);
      setIsProcessing(false);
      
      toast({
        title: "CIF procesado exitosamente",
        description: "Los datos de facturación han sido extraídos automáticamente",
      });
    }, 2000);
  }, [onCIFProcessed, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setUploadedFile(pdfFile);
      processCIF(pdfFile);
    } else {
      toast({
        title: "Archivo no válido",
        description: "Por favor sube un archivo PDF válido",
        variant: "destructive",
      });
    }
  }, [processCIF, toast]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      processCIF(file);
    } else {
      toast({
        title: "Archivo no válido",
        description: "Por favor sube un archivo PDF válido",
        variant: "destructive",
      });
    }
  }, [processCIF, toast]);

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="text-sm font-medium text-gray-700 mb-2">
        Cargar CIF (PDF) para autocompletar datos
      </div>
      
      {!uploadedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }
          `}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Arrastra tu archivo CIF aquí o haz clic para seleccionar
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
            id="cif-upload"
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => document.getElementById('cif-upload')?.click()}
            className="border-gray-300"
          >
            Seleccionar archivo
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">{uploadedFile.name}</span>
            {isProcessing && (
              <span className="text-xs text-green-600">Procesando...</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
