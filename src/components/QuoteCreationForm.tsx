import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Plus, FileText, UserPlus, Package, Mail, MessageSquare, Trash2, Download, Upload, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuoteCreationFormProps {
  onClose: () => void;
  editingQuote?: any;
  onSaveQuote?: (quoteData: any) => void;
}

export const QuoteCreationForm: React.FC<QuoteCreationFormProps> = ({ onClose, editingQuote, onSaveQuote }) => {
  const [products, setProducts] = useState([
    { id: 1, sku: 'PROD-001', name: 'Laptop Dell Inspiron 15', price: 15000, quantity: 2, unit: 'pcs' }
  ]);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showManualProduct, setShowManualProduct] = useState(false);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [quoteDate, setQuoteDate] = useState('');
  const [notes, setNotes] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  // Estados para el formulario manual de productos
  const [manualProduct, setManualProduct] = useState({
    name: '',
    sku: '',
    price: 0,
    unit: 'pcs'
  });

  useEffect(() => {
    if (editingQuote) {
      // Cargar datos de la cotización a editar
      setProducts(editingQuote.items || []);
      setSelectedClient(editingQuote.client || '');
      setQuoteDate(editingQuote.date || '');
      setNotes(editingQuote.notes || '');
    } else {
      // Resetear para nueva cotización
      setProducts([
        { id: 1, sku: 'PROD-001', name: 'Laptop Dell Inspiron 15', price: 15000, quantity: 2, unit: 'pcs' }
      ]);
      setSelectedClient('');
      setQuoteDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [editingQuote]);

  const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const availableProducts = [
    { sku: 'PROD-002', name: 'Monitor Samsung 24"', price: 4500, unit: 'pcs' },
    { sku: 'PROD-003', name: 'Teclado Mecánico RGB', price: 1200, unit: 'pcs' },
    { sku: 'PROD-004', name: 'Mouse Inalámbrico', price: 800, unit: 'pcs' }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleExcelFile(e.dataTransfer.files[0]);
    }
  };

  const handleExcelFile = (file: File) => {
    // Verificar que sea un archivo Excel
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.csv'
    ];
    
    if (!validTypes.some(type => file.type === type || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo Excel válido (.xlsx, .xls, .csv)",
        variant: "destructive"
      });
      return;
    }

    // Simular procesamiento del archivo Excel
    toast({
      title: "Procesando archivo",
      description: `Importando productos desde ${file.name}...`
    });

    // Simular datos importados (en una implementación real aquí se procesaría el Excel)
    setTimeout(() => {
      const importedProducts = [
        { id: Date.now() + 1, sku: 'IMP-001', name: 'Producto Importado 1', price: 2500, quantity: 1, unit: 'pcs' },
        { id: Date.now() + 2, sku: 'IMP-002', name: 'Producto Importado 2', price: 3500, quantity: 1, unit: 'pcs' },
        { id: Date.now() + 3, sku: 'IMP-003', name: 'Producto Importado 3', price: 1500, quantity: 1, unit: 'pcs' }
      ];
      
      setProducts([...products, ...importedProducts]);
      setShowExcelImport(false);
      
      toast({
        title: "Importación exitosa",
        description: `Se importaron ${importedProducts.length} productos correctamente`
      });
    }, 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleExcelFile(e.target.files[0]);
    }
  };

  const addProduct = (product: any) => {
    setProducts([...products, { 
      id: Date.now(), 
      ...product, 
      quantity: 1 
    }]);
    setShowProductSearch(false);
  };

  const addManualProduct = () => {
    if (manualProduct.name && manualProduct.sku && manualProduct.price > 0) {
      setProducts([...products, { 
        id: Date.now(), 
        ...manualProduct,
        quantity: 1 
      }]);
      setManualProduct({ name: '', sku: '', price: 0, unit: 'pcs' });
      setShowManualProduct(false);
    }
  };

  const removeProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, quantity: Math.max(0, quantity) } : p
    ));
  };

  const updateProductPrice = (productId: number, price: number) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, price: Math.max(0, price) } : p
    ));
  };

  const handleSaveQuote = () => {
    if (!selectedClient || products.length === 0) {
      alert('Por favor selecciona un cliente y agrega al menos un producto');
      return;
    }

    const quoteData = {
      id: editingQuote?.id || Math.floor(100000 + Math.random() * 900000).toString(),
      client: selectedClient,
      date: quoteDate,
      amount: total,
      status: editingQuote?.status || 'Pendiente',
      products: products.length,
      isInvoiced: editingQuote?.isInvoiced || false,
      items: products,
      notes: notes
    };

    if (onSaveQuote) {
      onSaveQuote(quoteData);
    }
    onClose();
  };

  const downloadExcelTemplate = () => {
    // Crear datos de ejemplo para el template
    const templateData = [
      ['Nombre del Producto', 'SKU', 'Precio Unitario', 'Unidad'],
      ['Laptop HP Pavilion', 'PROD-005', '15000', 'pcs'],
      ['Monitor Dell 24"', 'PROD-006', '4500', 'pcs'],
      ['Teclado Mecánico', 'PROD-007', '1200', 'pcs']
    ];

    // Convertir a CSV (simulando Excel)
    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template_productos.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Quote Creation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingQuote ? `Editar Cotización - ${editingQuote.id}` : 'Nueva Cotización'}
              </h3>
              <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-600 hover:bg-gray-50">
                Cerrar
              </Button>
            </div>
            
            {/* Client Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="client">Cliente</Label>
                <div className="flex space-x-2">
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="bg-white border-gray-300 rounded-lg">
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                      <SelectItem value="Tecnología Avanzada S.A.">Tecnología Avanzada S.A.</SelectItem>
                      <SelectItem value="Innovación Digital S.C.">Innovación Digital S.C.</SelectItem>
                      <SelectItem value="Sistemas Corporativos">Sistemas Corporativos</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="clientName">Nombre / Razón Social</Label>
                          <Input placeholder="Empresa ABC S.A." className="bg-white border-gray-300 rounded-lg" />
                        </div>
                        <div>
                          <Label htmlFor="clientEmail">Email</Label>
                          <Input type="email" placeholder="contacto@empresa.com" className="bg-white border-gray-300 rounded-lg" />
                        </div>
                        <div>
                          <Label htmlFor="clientPhone">WhatsApp</Label>
                          <Input placeholder="+52 55 1234 5678" className="bg-white border-gray-300 rounded-lg" />
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setShowClientDialog(false)}>
                          Agregar Cliente
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input 
                  type="date" 
                  value={quoteDate}
                  onChange={(e) => setQuoteDate(e.target.value)}
                  className="bg-white border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Products Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Productos</Label>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowProductSearch(true)}
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar Catálogo
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Crear Productos y Servicios
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                      <DropdownMenuItem 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setShowManualProduct(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Manual
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={downloadExcelTemplate}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar Template Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setShowExcelImport(true)}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Importar Excel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Excel Import Dialog */}
              <Dialog open={showExcelImport} onOpenChange={setShowExcelImport}>
                <DialogContent className="bg-white max-w-md">
                  <DialogHeader>
                    <DialogTitle>Importar Productos desde Excel</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div 
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">
                        Arrastra y suelta tu archivo Excel aquí
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        o haz clic para seleccionar
                      </p>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="excel-upload"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('excel-upload')?.click()}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        Seleccionar Archivo
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Formatos soportados: .xlsx, .xls, .csv</p>
                      <p>Descarga el template para ver el formato requerido.</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Manual Product Dialog */}
              <Dialog open={showManualProduct} onOpenChange={setShowManualProduct}>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Agregar Producto Manual</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="productName">Nombre del Producto</Label>
                      <Input 
                        placeholder="Ej: Laptop HP Pavilion" 
                        value={manualProduct.name}
                        onChange={(e) => setManualProduct({ ...manualProduct, name: e.target.value })}
                        className="bg-white border-gray-300 rounded-lg" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="productSku">SKU</Label>
                      <Input 
                        placeholder="PROD-005" 
                        value={manualProduct.sku}
                        onChange={(e) => setManualProduct({ ...manualProduct, sku: e.target.value })}
                        className="bg-white border-gray-300 rounded-lg" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="productPrice">Precio Unitario</Label>
                        <Input 
                          type="number" 
                          placeholder="5000" 
                          value={manualProduct.price || ''}
                          onChange={(e) => setManualProduct({ ...manualProduct, price: Number(e.target.value) })}
                          className="bg-white border-gray-300 rounded-lg" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="productUnit">Unidad</Label>
                        <Select 
                          value={manualProduct.unit} 
                          onValueChange={(value) => setManualProduct({ ...manualProduct, unit: value })}
                        >
                          <SelectTrigger className="bg-white border-gray-300 rounded-lg">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                            <SelectItem value="pcs">Piezas</SelectItem>
                            <SelectItem value="kg">Kilogramos</SelectItem>
                            <SelectItem value="mt">Metros</SelectItem>
                            <SelectItem value="hrs">Horas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      onClick={addManualProduct}
                    >
                      Agregar Producto
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Product Search Dropdown */}
              {showProductSearch && (
                <Card className="p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-2">
                    <Input 
                      placeholder="Buscar por nombre o SKU..." 
                      className="bg-white border-gray-300 rounded-lg"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {availableProducts.map((product) => (
                        <div 
                          key={product.sku}
                          className="p-2 hover:bg-gray-50 rounded cursor-pointer flex justify-between items-center"
                          onClick={() => addProduct(product)}
                        >
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.sku}</p>
                          </div>
                          <p className="font-semibold text-gray-900">${product.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {/* Products Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Producto</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Cantidad</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Precio Unit.</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {products.map((product) => (
                      <tr key={product.id} className="border-t border-gray-200">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.sku}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Input 
                            type="number" 
                            value={product.quantity}
                            onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value) || 0)}
                            className="w-20 bg-white border-gray-300 rounded"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Input 
                            type="number" 
                            value={product.price}
                            onChange={(e) => updateProductPrice(product.id, parseFloat(e.target.value) || 0)}
                            className="w-24 bg-white border-gray-300 rounded"
                          />
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          ${(product.price * product.quantity).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeProduct(product.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Resumen Financiero</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IVA (16%):</span>
                <span className="font-medium text-gray-900">${iva.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-bold text-lg text-gray-900">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <Label htmlFor="notes">Notas</Label>
              <Textarea 
                placeholder="Condiciones comerciales, términos de pago..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-white border-gray-300 rounded-lg"
              />
            </div>

            <div className="mt-6 space-y-2">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleSaveQuote}
              >
                {editingQuote ? 'Actualizar Cotización' : 'Crear Cotización'}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                Guardar Borrador
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
