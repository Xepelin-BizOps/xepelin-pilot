
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CIFUploaderProps {
  onDataExtracted: (data: {
    rfc?: string;
    codigoPostal?: string;
    regimenFiscal?: string;
  }) => void;
}

export const CIFUploader: React.FC<CIFUploaderProps> = ({ onDataExtracted }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processCIFFile = async (file: File) => {
    setIsProcessing(true);
    
    // Simular extracción de datos del PDF CIF
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Datos simulados extraídos del CIF
    const extractedData = {
      rfc: 'ABC123456XYZ',
      codigoPostal: '01234',
      regimenFiscal: '601'
    };
    
    onDataExtracted(extractedData);
    setIsProcessing(false);
    
    toast({
      title: "CIF procesado",
      description: "Los datos del CIF han sido extraídos y aplicados al formulario",
    });
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (!pdfFile) {
      toast({
        title: "Archivo no válido",
        description: "Por favor, sube un archivo PDF válido",
        variant: "destructive",
      });
      return;
    }
    
    setUploadedFile(pdfFile);
    await processCIFFile(pdfFile);
  }, [onDataExtracted, toast]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      toast({
        title: "Archivo no válido",
        description: "Por favor, sube un archivo PDF válido",
        variant: "destructive",
      });
      return;
    }
    
    setUploadedFile(file);
    await processCIFFile(file);
  }, [onDataExtracted, toast]);

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <Card className="p-4 border-2 border-dashed border-gray-300">
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Subir CIF (PDF)
        </h4>
        <p className="text-xs text-gray-600 mb-4">
          Arrastra aquí tu CIF en PDF para autorrellenar los datos de facturación
        </p>
        
        {!uploadedFile ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {isDragOver ? 'Suelta el archivo aquí' : 'Arrastra tu CIF aquí o haz clic para seleccionar'}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-xs text-gray-600">
                  {isProcessing ? 'Procesando...' : 'Datos extraídos correctamente'}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={removeFile}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
