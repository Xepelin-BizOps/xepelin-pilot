
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Producto A', description: 'Descripción del producto A', price: 1000, category: 'Categoría 1', type: 'product' },
    { id: '2', name: 'Servicio B', description: 'Descripción del servicio B', price: 2500, category: 'Categoría 2', type: 'service' },
    { id: '3', name: 'Producto C', description: 'Descripción del producto C', price: 1500, category: 'Categoría 1', type: 'product' },
    { id: '4', name: 'Servicio D', description: 'Descripción del servicio D', price: 3000, category: 'Categoría 3', type: 'service' },
  ]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', category: '', type: 'product' });
    
    toast({
      title: "Éxito",
      description: "Producto actualizado correctamente"
    });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', category: '', type: 'product' });
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
    toast({
      title: "Procesando...",
      description: "Cargando productos desde Excel"
    });

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
    toast({
      title: "Descarga iniciada",
      description: "Plantilla de Excel descargada"
    });
  };

  const productCount = products.filter(p => p.type === 'product').length;
  const serviceCount = products.filter(p => p.type === 'service').length;

  return (
    <div className="space-y-4">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
            <div className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              Catálogo de Productos y Servicios ({products.length})
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{productCount} Productos</Badge>
              <Badge variant="outline">{serviceCount} Servicios</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Formulario para agregar producto/servicio */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingProduct ? 'Editar Item' : 'Agregar Nuevo Item'}
                </CardTitle>
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
                  {editingProduct ? (
                    <>
                      <Button onClick={handleUpdateProduct}>
                        Guardar Cambios
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Lista unificada de productos y servicios */}
            <Card>
              <CardHeader>
                <CardTitle>Catálogo Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
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
                        <TableRow key={item.id} className="hover:bg-gray-50">
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
                                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(item.id)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Eliminar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {products.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      No hay productos registrados
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
