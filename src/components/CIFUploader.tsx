
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CIFData {
  rfc: string;
  codigoPostal: string;
  regimenFiscal: string;
}

interface CIFUploaderProps {
  onCIFData: (data: CIFData) => void;
}

export const CIFUploader: React.FC<CIFUploaderProps> = ({ onCIFData }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const { toast } = useToast();

  const processCIFFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    // Simular procesamiento del PDF CIF
    // En una implementación real, aquí se procesaría el PDF para extraer los datos
    setTimeout(() => {
      const mockCIFData: CIFData = {
        rfc: 'XAXX010101000',
        codigoPostal: '01234',
        regimenFiscal: '601'
      };
      
      onCIFData(mockCIFData);
      setIsProcessing(false);
      setIsProcessed(true);
      
      toast({
        title: "CIF procesado exitosamente",
        description: "Los datos de facturación han sido completados automáticamente",
      });
    }, 2000);
  }, [onCIFData, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setUploadedFile(pdfFile);
      processCIFFile(pdfFile);
    } else {
      toast({
        title: "Archivo no válido",
        description: "Por favor, sube un archivo PDF del CIF",
        variant: "destructive",
      });
    }
  }, [processCIFFile, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      processCIFFile(file);
    } else {
      toast({
        title: "Archivo no válido",
        description: "Por favor, selecciona un archivo PDF del CIF",
        variant: "destructive",
      });
    }
  }, [processCIFFile, toast]);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setIsProcessed(false);
    setIsProcessing(false);
  }, []);

  return (
    <Card className="p-4 border-2 border-dashed border-gray-300 bg-gray-50">
      <div className="text-center">
        <div className="mb-2">
          <FileText className="w-8 h-8 mx-auto text-gray-400" />
        </div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Cargar CIF para auto-completar datos
        </h4>
        
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
              isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-4">
              Arrastra y suelta tu archivo CIF (PDF) aquí o haz clic para seleccionar
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
              className="border-gray-400 text-gray-600 hover:bg-gray-50"
            >
              Seleccionar archivo PDF
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isProcessing && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                )}
                {isProcessed && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="border-gray-400 text-gray-600 hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {isProcessing && (
              <p className="text-xs text-blue-600 mt-2">Procesando archivo CIF...</p>
            )}
            {isProcessed && (
              <p className="text-xs text-green-600 mt-2">Datos completados automáticamente</p>
            )}
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-2">
          El CIF debe ser un archivo PDF válido emitido por el SAT
        </p>
      </div>
    </Card>
  );
};
