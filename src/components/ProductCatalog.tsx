import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, FileSpreadsheet, Download, Upload, Search, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  // Campos obligatorios
  id: string;
  nombre: string;
  descripcion_corta: string;
  categoria: string;
  precio: number;
  moneda: string;
  iva_incluido: boolean;
  grava_iva: boolean;
  clave_sat: string;
  unidad_sat: string;
  imagenes: string[];
  
  // Campos opcionales
  descripcion_larga?: string;
  subcategoria?: string;
  etiquetas?: string[];
  descuento?: number;
  proveedor_id?: string;
  proveedor_nombre?: string;
  rfc_proveedor?: string;
  estado?: string;
  municipio?: string;
  dias_habiles?: string;
  horarios?: string;
  garantia?: string;
  politica_devolucion?: string;
  tiempo_entrega?: string;
  type: 'product' | 'service';
}

export const ProductCatalog = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      nombre: 'Producto A',
      descripcion_corta: 'Descripción breve del producto A',
      categoria: 'Categoría 1',
      precio: 1000,
      moneda: 'MXN',
      iva_incluido: true,
      grava_iva: true,
      clave_sat: '01010101',
      unidad_sat: 'PZA',
      imagenes: ['https://via.placeholder.com/300'],
      type: 'product',
      descripcion_larga: 'Descripción detallada del producto A con todas sus características técnicas.',
      subcategoria: 'Subcategoría A',
      etiquetas: ['calidad', 'nuevo', 'oferta'],
      tiempo_entrega: '3-5 días hábiles'
    },
    {
      id: '2',
      nombre: 'Servicio B',
      descripcion_corta: 'Descripción breve del servicio B',
      categoria: 'Categoría 2',
      precio: 2500,
      moneda: 'MXN',
      iva_incluido: false,
      grava_iva: true,
      clave_sat: '84111506',
      unidad_sat: 'E48',
      imagenes: ['https://via.placeholder.com/300'],
      type: 'service',
      descripcion_larga: 'Servicio completo con atención personalizada.',
      dias_habiles: 'Lunes a Viernes',
      horarios: '9:00 AM - 6:00 PM'
    },
    {
      id: '3',
      nombre: 'Producto C',
      descripcion_corta: 'Descripción breve del producto C',
      categoria: 'Categoría 1',
      precio: 1500,
      moneda: 'MXN',
      iva_incluido: true,
      grava_iva: true,
      clave_sat: '01010102',
      unidad_sat: 'PZA',
      imagenes: ['https://via.placeholder.com/300'],
      type: 'product',
      garantia: '12 meses',
      tiempo_entrega: '1-2 días hábiles'
    },
    {
      id: '4',
      nombre: 'Servicio D',
      descripcion_corta: 'Descripción breve del servicio D',
      categoria: 'Categoría 3',
      precio: 3000,
      moneda: 'MXN',
      iva_incluido: false,
      grava_iva: true,
      clave_sat: '84111507',
      unidad_sat: 'E48',
      imagenes: ['https://via.placeholder.com/300'],
      type: 'service',
      estado: 'CDMX',
      municipio: 'Miguel Hidalgo'
    }
  ]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion_corta: '',
    descripcion_larga: '',
    precio: '',
    moneda: 'MXN',
    categoria: '',
    subcategoria: '',
    iva_incluido: true,
    grava_iva: true,
    clave_sat: '',
    unidad_sat: '',
    type: 'product' as 'product' | 'service',
    tiempo_entrega: '',
    garantia: ''
  });

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    
    return products.filter(product => 
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion_corta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleAddProduct = () => {
    if (!formData.nombre || !formData.precio || !formData.descripcion_corta) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      descripcion_corta: formData.descripcion_corta,
      descripcion_larga: formData.descripcion_larga,
      precio: parseFloat(formData.precio),
      moneda: formData.moneda,
      categoria: formData.categoria,
      subcategoria: formData.subcategoria,
      iva_incluido: formData.iva_incluido,
      grava_iva: formData.grava_iva,
      clave_sat: formData.clave_sat,
      unidad_sat: formData.unidad_sat,
      type: formData.type,
      imagenes: ['https://via.placeholder.com/300'],
      tiempo_entrega: formData.tiempo_entrega,
      garantia: formData.garantia
    };

    setProducts([...products, newProduct]);
    setFormData({ 
      nombre: '', 
      descripcion_corta: '', 
      descripcion_larga: '', 
      precio: '', 
      moneda: 'MXN',
      categoria: '', 
      subcategoria: '',
      iva_incluido: true,
      grava_iva: true,
      clave_sat: '',
      unidad_sat: '',
      type: 'product',
      tiempo_entrega: '',
      garantia: ''
    });
    
    toast({
      title: "Éxito",
      description: `${formData.type === 'product' ? 'Producto' : 'Servicio'} agregado correctamente`
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      descripcion_corta: product.descripcion_corta,
      descripcion_larga: product.descripcion_larga || '',
      precio: product.precio.toString(),
      moneda: product.moneda,
      categoria: product.categoria,
      subcategoria: product.subcategoria || '',
      iva_incluido: product.iva_incluido,
      grava_iva: product.grava_iva,
      clave_sat: product.clave_sat,
      unidad_sat: product.unidad_sat,
      type: product.type,
      tiempo_entrega: product.tiempo_entrega || '',
      garantia: product.garantia || ''
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct || !formData.nombre || !formData.precio || !formData.descripcion_corta) return;

    const updatedProducts = products.map(p => 
      p.id === editingProduct.id 
        ? {
            ...p,
            nombre: formData.nombre,
            descripcion_corta: formData.descripcion_corta,
            descripcion_larga: formData.descripcion_larga,
            precio: parseFloat(formData.precio),
            moneda: formData.moneda,
            categoria: formData.categoria,
            subcategoria: formData.subcategoria,
            iva_incluido: formData.iva_incluido,
            grava_iva: formData.grava_iva,
            clave_sat: formData.clave_sat,
            unidad_sat: formData.unidad_sat,
            type: formData.type,
            tiempo_entrega: formData.tiempo_entrega,
            garantia: formData.garantia
          }
        : p
    );

    setProducts(updatedProducts);
    setEditingProduct(null);
    setFormData({ 
      nombre: '', 
      descripcion_corta: '', 
      descripcion_larga: '', 
      precio: '', 
      moneda: 'MXN',
      categoria: '', 
      subcategoria: '',
      iva_incluido: true,
      grava_iva: true,
      clave_sat: '',
      unidad_sat: '',
      type: 'product',
      tiempo_entrega: '',
      garantia: ''
    });
    
    toast({
      title: "Éxito",
      description: "Producto actualizado correctamente"
    });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({ 
      nombre: '', 
      descripcion_corta: '', 
      descripcion_larga: '', 
      precio: '', 
      moneda: 'MXN',
      categoria: '', 
      subcategoria: '',
      iva_incluido: true,
      grava_iva: true,
      clave_sat: '',
      unidad_sat: '',
      type: 'product',
      tiempo_entrega: '',
      garantia: ''
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
    toast({
      title: "Procesando...",
      description: "Cargando productos desde Excel"
    });

    setTimeout(() => {
      const newProducts: Product[] = [
        { 
          id: Date.now().toString(), 
          nombre: 'Producto Excel 1', 
          descripcion_corta: 'Importado desde Excel', 
          precio: 500, 
          moneda: 'MXN',
          categoria: 'Importados', 
          iva_incluido: true,
          grava_iva: true,
          clave_sat: '01010103',
          unidad_sat: 'PZA',
          imagenes: ['https://via.placeholder.com/300'],
          type: 'product' 
        },
        { 
          id: (Date.now() + 1).toString(), 
          nombre: 'Servicio Excel 1', 
          descripcion_corta: 'Importado desde Excel', 
          precio: 750, 
          moneda: 'MXN',
          categoria: 'Importados', 
          iva_incluido: false,
          grava_iva: true,
          clave_sat: '84111508',
          unidad_sat: 'E48',
          imagenes: ['https://via.placeholder.com/300'],
          type: 'service' 
        }
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

  const productCount = filteredProducts.filter(p => p.type === 'product').length;
  const serviceCount = filteredProducts.filter(p => p.type === 'service').length;

  return (
    <div className="space-y-4">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
            <div className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              Catálogo de Productos y Servicios ({filteredProducts.length})
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
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Nombre del producto/servicio"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio *</Label>
                    <Input
                      id="precio"
                      type="number"
                      value={formData.precio}
                      onChange={(e) => setFormData({...formData, precio: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="moneda">Moneda *</Label>
                    <Select value={formData.moneda} onValueChange={(value) => setFormData({...formData, moneda: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MXN">MXN</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría *</Label>
                    <Input
                      id="categoria"
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      placeholder="Categoría"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subcategoria">Subcategoría</Label>
                    <Input
                      id="subcategoria"
                      value={formData.subcategoria}
                      onChange={(e) => setFormData({...formData, subcategoria: e.target.value})}
                      placeholder="Subcategoría"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo *</Label>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="clave_sat">Clave SAT *</Label>
                    <Input
                      id="clave_sat"
                      value={formData.clave_sat}
                      onChange={(e) => setFormData({...formData, clave_sat: e.target.value})}
                      placeholder="01010101"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unidad_sat">Unidad SAT *</Label>
                    <Input
                      id="unidad_sat"
                      value={formData.unidad_sat}
                      onChange={(e) => setFormData({...formData, unidad_sat: e.target.value})}
                      placeholder="PZA"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tiempo_entrega">Tiempo de Entrega</Label>
                    <Input
                      id="tiempo_entrega"
                      value={formData.tiempo_entrega}
                      onChange={(e) => setFormData({...formData, tiempo_entrega: e.target.value})}
                      placeholder="3-5 días hábiles"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="garantia">Garantía</Label>
                    <Input
                      id="garantia"
                      value={formData.garantia}
                      onChange={(e) => setFormData({...formData, garantia: e.target.value})}
                      placeholder="12 meses"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="descripcion_corta">Descripción Corta *</Label>
                    <Textarea
                      id="descripcion_corta"
                      value={formData.descripcion_corta}
                      onChange={(e) => setFormData({...formData, descripcion_corta: e.target.value})}
                      placeholder="Descripción breve del producto/servicio"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="descripcion_larga">Descripción Larga</Label>
                    <Textarea
                      id="descripcion_larga"
                      value={formData.descripcion_larga}
                      onChange={(e) => setFormData({...formData, descripcion_larga: e.target.value})}
                      placeholder="Descripción detallada del producto/servicio"
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

            {/* Barra de búsqueda */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar productos por nombre, descripción o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  {searchTerm && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSearchTerm('')}
                    >
                      Limpiar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Lista unificada de productos y servicios */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Catálogo Completo
                  {searchTerm && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      - Mostrando {filteredProducts.length} resultados para "{searchTerm}"
                    </span>
                  )}
                </CardTitle>
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
                        <TableHead>Clave SAT</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell>
                            <Badge variant={item.type === 'product' ? 'default' : 'secondary'}>
                              {item.type === 'product' ? 'Producto' : 'Servicio'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{item.nombre}</TableCell>
                          <TableCell className="max-w-xs truncate">{item.descripcion_corta}</TableCell>
                          <TableCell>${item.precio.toLocaleString()} {item.moneda}</TableCell>
                          <TableCell>{item.categoria}</TableCell>
                          <TableCell>{item.clave_sat}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewProduct(item)}
                                className="border-green-300 text-green-600 hover:bg-green-50 p-2"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProduct(item)}
                                className="border-blue-300 text-blue-600 hover:bg-blue-50 p-2"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(item.id)}
                                className="border-red-300 text-red-600 hover:bg-red-50 p-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {filteredProducts.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      {searchTerm ? 
                        `No se encontraron productos que coincidan con "${searchTerm}"` : 
                        'No hay productos registrados'
                      }
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Modal para ver detalles del producto */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Detalles del {selectedProduct?.type === 'product' ? 'Producto' : 'Servicio'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Tipo</Label>
                  <div className="mt-1">
                    <Badge variant={selectedProduct.type === 'product' ? 'default' : 'secondary'}>
                      {selectedProduct.type === 'product' ? 'Producto' : 'Servicio'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Nombre</Label>
                  <p className="mt-1 text-sm text-gray-900 font-medium">{selectedProduct.nombre}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Descripción Corta</Label>
                <p className="mt-1 text-sm text-gray-900">{selectedProduct.descripcion_corta}</p>
              </div>
              
              {selectedProduct.descripcion_larga && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Descripción Larga</Label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.descripcion_larga}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Precio</Label>
                  <p className="mt-1 text-lg font-bold text-green-600">${selectedProduct.precio.toLocaleString()} {selectedProduct.moneda}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">IVA Incluido</Label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.iva_incluido ? 'Sí' : 'No'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Categoría</Label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.categoria}</p>
                </div>
                
                {selectedProduct.subcategoria && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Subcategoría</Label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.subcategoria}</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Clave SAT</Label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.clave_sat}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Unidad SAT</Label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.unidad_sat}</p>
                </div>
              </div>
              
              {selectedProduct.tiempo_entrega && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Tiempo de Entrega</Label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.tiempo_entrega}</p>
                </div>
              )}
              
              {selectedProduct.garantia && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Garantía</Label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.garantia}</p>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleEditProduct(selectedProduct);
                    setIsViewDialogOpen(false);
                  }}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                  className="flex-1"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
