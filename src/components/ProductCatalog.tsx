import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FileSpreadsheet, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  type: 'product' | 'service';
}

export const ProductCatalog = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Producto A', description: 'Descripción del producto A', price: 1000, category: 'Categoría 1', type: 'product' },
    { id: '2', name: 'Servicio B', description: 'Descripción del servicio B', price: 2500, category: 'Categoría 2', type: 'service' },
    { id: '3', name: 'Producto C', description: 'Descripción del producto C', price: 1500, category: 'Categoría 1', type: 'product' },
    { id: '4', name: 'Servicio D', description: 'Descripción del servicio D', price: 3000, category: 'Categoría 3', type: 'service' },
  ]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    type: 'product' as 'product' | 'service'
  });

  const handleAddProduct = () => {
    if (!formData.name || !formData.price) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      type: formData.type
    };

    setProducts([...products, newProduct]);
    setFormData({ name: '', description: '', price: '', category: '', type: 'product' });
    
    toast({
      title: "Éxito",
      description: `${formData.type === 'product' ? 'Producto' : 'Servicio'} agregado correctamente`
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      type: product.type
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct || !formData.name || !formData.price) return;

    const updatedProducts = products.map(p => 
      p.id === editingProduct.id 
        ? {
            ...p,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            type: formData.type
          }
        : p
    );

    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', category: '', type: 'product' });
    
    toast({
      title: "Éxito",
      description: "Producto actualizado correctamente"
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Éxito",
      description: "Producto eliminado correctamente"
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processExcelFile(file);
    }
  };

  const processExcelFile = (file: File) => {
    // Simulación del procesamiento de Excel
    toast({
      title: "Procesando...",
      description: "Cargando productos desde Excel"
    });

    // En una implementación real, aquí usarías una librería como SheetJS
    setTimeout(() => {
      const newProducts: Product[] = [
        { id: Date.now().toString(), name: 'Producto Excel 1', description: 'Importado desde Excel', price: 500, category: 'Importados', type: 'product' },
        { id: (Date.now() + 1).toString(), name: 'Servicio Excel 1', description: 'Importado desde Excel', price: 750, category: 'Importados', type: 'service' }
      ];
      
      setProducts([...products, ...newProducts]);
      toast({
        title: "Éxito",
        description: `${newProducts.length} productos importados correctamente`
      });
    }, 1500);
  };

  const downloadTemplate = () => {
    // En una implementación real, esto generaría un archivo Excel real
    toast({
      title: "Descarga iniciada",
      description: "Plantilla de Excel descargada"
    });
  };

  const productCount = products.filter(p => p.type === 'product').length;
  const serviceCount = products.filter(p => p.type === 'service').length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white border-gray-300">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Catálogo de Productos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestión de Catálogo de Productos y Servicios</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formulario para agregar producto/servicio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agregar Nuevo Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nombre del producto/servicio"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Precio *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="Categoría"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as 'product' | 'service'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Producto</SelectItem>
                      <SelectItem value="service">Servicio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descripción del producto/servicio"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <Button onClick={handleAddProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Item
                </Button>
                
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="excel-upload"
                />
                <label htmlFor="excel-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Excel
                    </span>
                  </Button>
                </label>
                
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Plantilla
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista unificada de productos y servicios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Catálogo Completo</span>
                <div className="flex gap-2">
                  <Badge variant="secondary">{productCount} Productos</Badge>
                  <Badge variant="outline">{serviceCount} Servicios</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant={item.type === 'product' ? 'default' : 'secondary'}>
                          {item.type === 'product' ? 'Producto' : 'Servicio'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>${item.price.toLocaleString()}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Dialog para editar producto */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar {editingProduct?.type === 'product' ? 'Producto' : 'Servicio'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Nombre</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">Precio</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">Categoría</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">Tipo</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as 'product' | 'service'})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Producto</SelectItem>
                    <SelectItem value="service">Servicio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateProduct}>
                Guardar Cambios
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
