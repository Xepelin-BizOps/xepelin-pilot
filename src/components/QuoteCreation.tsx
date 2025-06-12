
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, FileText } from 'lucide-react';

interface QuoteCreationProps {
  onClientClick: (client: any) => void;
}

export const QuoteCreation: React.FC<QuoteCreationProps> = ({ onClientClick }) => {
  const [products, setProducts] = useState([
    { id: 1, sku: 'PROD-001', name: 'Laptop Dell Inspiron 15', price: 15000, quantity: 2, unit: 'pcs' }
  ]);
  const [showProductSearch, setShowProductSearch] = useState(false);

  const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const availableProducts = [
    { sku: 'PROD-002', name: 'Monitor Samsung 24"', price: 4500, unit: 'pcs' },
    { sku: 'PROD-003', name: 'Teclado Mecánico RGB', price: 1200, unit: 'pcs' },
    { sku: 'PROD-004', name: 'Mouse Inalámbrico', price: 800, unit: 'pcs' }
  ];

  const quotes = [
    {
      id: 'COT-2024-001',
      client: 'Tecnología Avanzada S.A.',
      date: '2024-06-10',
      amount: 32000,
      status: 'Pendiente',
      products: 3
    },
    {
      id: 'COT-2024-002', 
      client: 'Innovación Digital S.C.',
      date: '2024-06-11',
      amount: 45600,
      status: 'Convertida',
      products: 5
    },
    {
      id: 'COT-2024-003',
      client: 'Sistemas Corporativos',
      date: '2024-06-12', 
      amount: 18900,
      status: 'En Revisión',
      products: 2
    }
  ];

  const addProduct = (product: any) => {
    setProducts([...products, { 
      id: Date.now(), 
      ...product, 
      quantity: 1 
    }]);
    setShowProductSearch(false);
  };

  const handleClientClick = (clientName: string) => {
    onClientClick({
      name: clientName,
      quotes: 5,
      orders: 3,
      totalPaid: 125000,
      totalPending: 32000,
      lastActivity: '2024-06-12'
    });
  };

  return (
    <div className="space-y-6">
      {/* Quote Creation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Cotización</h3>
            
            {/* Client Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="client">Cliente</Label>
                <Select>
                  <SelectTrigger className="bg-white border-gray-300 rounded-lg">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    <SelectItem value="client1">Tecnología Avanzada S.A.</SelectItem>
                    <SelectItem value="client2">Innovación Digital S.C.</SelectItem>
                    <SelectItem value="client3">Sistemas Corporativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input 
                  type="date" 
                  className="bg-white border-gray-300 rounded-lg"
                  defaultValue="2024-06-12"
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
                    Buscar Producto
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Importar Excel
                  </Button>
                </div>
              </div>

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
                            className="w-20 bg-white border-gray-300 rounded"
                          />
                        </td>
                        <td className="py-3 px-4 text-gray-900">${product.price.toLocaleString()}</td>
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          ${(product.price * product.quantity).toLocaleString()}
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
                className="bg-white border-gray-300 rounded-lg"
              />
            </div>

            <div className="mt-6 space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Crear Cotización
              </Button>
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                Guardar como Borrador
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Quotes List */}
      <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Cotizaciones Recientes</h3>
          <div className="flex space-x-2">
            <Input 
              placeholder="Buscar cotizaciones..." 
              className="w-64 bg-white border-gray-300 rounded-lg"
            />
            <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
              Filtros
            </Button>
          </div>
        </div>

        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Productos</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Monto</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {quotes.map((quote) => (
                <tr key={quote.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-blue-600">{quote.id}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleClientClick(quote.client)}
                      className="text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {quote.client}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{quote.date}</td>
                  <td className="py-3 px-4 text-gray-600">{quote.products} items</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">${quote.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <Badge 
                      variant={quote.status === 'Convertida' ? 'default' : 'secondary'}
                      className={quote.status === 'Convertida' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}
                    >
                      {quote.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                        Ver
                      </Button>
                      {quote.status === 'Pendiente' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Confirmar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
