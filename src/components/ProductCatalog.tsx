
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Upload, Download, FileExcel } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  unit: string;
  category: string;
}

export const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, sku: 'PROD-001', name: 'Laptop Dell Inspiron 15', price: 15000, unit: 'pcs', category: 'Equipos' },
    { id: 2, sku: 'PROD-002', name: 'Monitor Samsung 24"', price: 4500, unit: 'pcs', category: 'Equipos' },
    { id: 3, sku: 'PROD-003', name: 'Teclado Mecánico RGB', price: 1200, unit: 'pcs', category: 'Accesorios' },
    { id: 4, sku: 'PROD-004', name: 'Mouse Inalámbrico', price: 800, unit: 'pcs', category: 'Accesorios' },
    { id: 5, sku: 'SERV-001', name: 'Instalación de Software', price: 500, unit: 'hrs', category: 'Servicios' },
    { id: 6, sku: 'SERV-002', name: 'Soporte Técnico', price: 750, unit: 'hrs', category: 'Servicios' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    sku: '',
    name: '',
    price: 0,
    unit: 'pcs',
    category: 'Equipos'
  });

  const categories = ['Equipos', 'Accesorios', 'Servicios', 'Software'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku || newProduct.price <= 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos correctamente",
        variant: "destructive"
      });
      return;
    }

    const product: Product = {
      id: Date.now(),
      ...newProduct
    };

    setProducts([...products, product]);
    setNewProduct({ sku: '', name: '', price: 0, unit: 'pcs', category: 'Equipos' });
    setShowAddDialog(false);
    
    toast({
      title: "Producto agregado",
      description: "El producto se ha agregado exitosamente al catálogo"
    });
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;

    setProducts(products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ));
    setEditingProduct(null);
    setShowEditDialog(false);
    
    toast({
      title: "Producto actualizado",
      description: "Los cambios se han guardado exitosamente"
    });
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Producto eliminado",
      description: "El producto se ha eliminado del catálogo"
    });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct({ ...product });
    setShowEditDialog(true);
  };

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

    toast({
      title: "Procesando archivo",
      description: `Importando productos desde ${file.name}...`
    });

    // Simular procesamiento del archivo Excel
    setTimeout(() => {
      const importedProducts: Product[] = [
        { id: Date.now() + 1, sku: 'IMP-001', name: 'Producto Importado 1', price: 2500, unit: 'pcs', category: 'Equipos' },
        { id: Date.now() + 2, sku: 'IMP-002', name: 'Producto Importado 2', price: 3500, unit: 'pcs', category: 'Accesorios' },
        { id: Date.now() + 3, sku: 'IMP-003', name: 'Servicio Importado 1', price: 1500, unit: 'hrs', category: 'Servicios' }
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

  const downloadExcelTemplate = () => {
    const templateData = [
      ['SKU', 'Nombre del Producto/Servicio', 'Precio Unitario', 'Unidad', 'Categoría'],
      ['PROD-008', 'Tablet Samsung', '8000', 'pcs', 'Equipos'],
      ['SERV-003', 'Capacitación', '1000', 'hrs', 'Servicios'],
      ['ACC-001', 'Cable HDMI', '150', 'pcs', 'Accesorios']
    ];

    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template_catalogo_productos.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportCatalog = () => {
    const csvContent = [
      ['SKU', 'Nombre', 'Precio', 'Unidad', 'Categoría'],
      ...products.map(p => [p.sku, p.name, p.price.toString(), p.unit, p.category])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'catalogo_productos.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Catálogo exportado",
      description: "El catálogo se ha descargado exitosamente"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Catálogo de Productos y Servicios</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={downloadExcelTemplate}
              className="border-green-300 text-green-600 hover:bg-green-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Template Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowExcelImport(true)}
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar Excel
            </Button>
            <Button
              variant="outline"
              onClick={exportCatalog}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <FileExcel className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nombre o SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-white border-gray-300 rounded-lg">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabla de productos */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium text-gray-700">SKU</TableHead>
                <TableHead className="font-medium text-gray-700">Nombre</TableHead>
                <TableHead className="font-medium text-gray-700">Precio</TableHead>
                <TableHead className="font-medium text-gray-700">Unidad</TableHead>
                <TableHead className="font-medium text-gray-700">Categoría</TableHead>
                <TableHead className="font-medium text-gray-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{product.sku}</TableCell>
                  <TableCell className="text-gray-900">{product.name}</TableCell>
                  <TableCell className="text-gray-900">${product.price.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-600">{product.unit}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron productos que coincidan con los filtros</p>
          </div>
        )}
      </Card>

      {/* Dialog para agregar producto */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Producto/Servicio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                placeholder="PROD-005"
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                className="bg-white border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                placeholder="Ej: Laptop HP Pavilion"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="bg-white border-gray-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={newProduct.price || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  className="bg-white border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="unit">Unidad</Label>
                <Select value={newProduct.unit} onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}>
                  <SelectTrigger className="bg-white border-gray-300 rounded-lg">
                    <SelectValue />
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
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                <SelectTrigger className="bg-white border-gray-300 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleAddProduct}>
              Agregar Producto
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar producto */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Producto/Servicio</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-sku">SKU</Label>
                <Input
                  value={editingProduct.sku}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                  className="bg-white border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="bg-white border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Precio</Label>
                  <Input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="bg-white border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-unit">Unidad</Label>
                  <Select value={editingProduct.unit} onValueChange={(value) => setEditingProduct({ ...editingProduct, unit: value })}>
                    <SelectTrigger className="bg-white border-gray-300 rounded-lg">
                      <SelectValue />
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
              <div>
                <Label htmlFor="edit-category">Categoría</Label>
                <Select value={editingProduct.category} onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}>
                  <SelectTrigger className="bg-white border-gray-300 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleEditProduct}>
                Guardar Cambios
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para importar Excel */}
      <Dialog open={showExcelImport} onOpenChange={setShowExcelImport}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle>Importar Catálogo desde Excel</DialogTitle>
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
                id="catalog-excel-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('catalog-excel-upload')?.click()}
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
    </div>
  );
};
