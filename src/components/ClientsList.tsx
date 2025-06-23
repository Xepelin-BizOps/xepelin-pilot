import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Building2, MapPin, FileText, Users, Phone, Mail, Plus, Eye, ChevronDown, UserPlus, Edit } from 'lucide-react';
import { Company } from '@/types/client';
import { CreateClientForm } from '@/components/CreateClientForm';
import { CreateContactForm } from '@/components/CreateContactForm';

// Mock data - en una aplicación real vendría de una API
const mockCompanies: Company[] = [
  {
    id: 'comp-1',
    name: 'Innovación Digital S.A. de C.V.',
    industry: 'Tecnología',
    size: 'medium',
    status: 'active',
    createdAt: '2024-01-15',
    lastContact: '2024-06-20',
    addresses: [
      {
        id: 'addr-1',
        street: 'Av. Insurgentes Sur 1234, Col. Del Valle',
        city: 'Ciudad de México',
        state: 'CDMX',
        zipCode: '03100',
        country: 'México',
        type: 'main'
      },
      {
        id: 'addr-2',
        street: 'Calle Morelos 567, Col. Centro',
        city: 'Ciudad de México',
        state: 'CDMX',
        zipCode: '06000',
        country: 'México',
        type: 'billing'
      }
    ],
    billingData: {
      id: 'bill-1',
      businessName: 'Innovación Digital S.A. de C.V.',
      rfc: 'INN123456789',
      taxRegime: 'Régimen General de Ley Personas Morales',
      useCFDI: 'G03 - Gastos en general',
      email: 'facturacion@innovaciondigital.com',
      phone: '+52 55 1234 5678'
    },
    contacts: [
      {
        id: 'cont-1',
        name: 'Juan Pérez Rodríguez',
        position: 'Director General',
        email: 'juan.perez@innovaciondigital.com',
        phone: '+52 55 1234 5678',
        whatsapp: '+52 55 1234 5678',
        isPrimary: true
      },
      {
        id: 'cont-2',
        name: 'María González López',
        position: 'Gerente de Compras',
        email: 'maria.gonzalez@innovaciondigital.com',
        phone: '+52 55 1234 5679',
        isPrimary: false
      }
    ],
    notes: 'Cliente premium con historial de compras consistente.'
  },
  {
    id: 'comp-2',
    name: 'Tecnología Avanzada S.A.',
    industry: 'Software',
    size: 'large',
    status: 'active',
    createdAt: '2024-02-20',
    lastContact: '2024-06-22',
    addresses: [
      {
        id: 'addr-3',
        street: 'Paseo de la Reforma 2000, Col. Lomas',
        city: 'Ciudad de México',
        state: 'CDMX',
        zipCode: '11000',
        country: 'México',
        type: 'main'
      }
    ],
    billingData: {
      id: 'bill-2',
      businessName: 'Tecnología Avanzada S.A.',
      rfc: 'TAV987654321',
      taxRegime: 'Régimen General de Ley Personas Morales',
      useCFDI: 'G03 - Gastos en general',
      email: 'cuentas@tecavanzada.com',
      phone: '+52 55 9876 5432'
    },
    contacts: [
      {
        id: 'cont-3',
        name: 'Carlos Ruiz Mendoza',
        position: 'CTO',
        email: 'carlos.ruiz@tecavanzada.com',
        phone: '+52 55 9876 5432',
        whatsapp: '+52 55 9876 5432',
        isPrimary: true
      }
    ]
  },
  {
    id: 'comp-3',
    name: 'Sistemas Integrados del Norte',
    industry: 'Consultoría',
    size: 'small',
    status: 'prospect',
    createdAt: '2024-03-10',
    lastContact: '2024-06-18',
    addresses: [
      {
        id: 'addr-4',
        street: 'Av. Universidad 890, Col. Narvarte',
        city: 'Ciudad de México',
        state: 'CDMX',
        zipCode: '03020',
        country: 'México',
        type: 'main'
      }
    ],
    billingData: {
      id: 'bill-3',
      businessName: 'Sistemas Integrados del Norte S.C.',
      rfc: 'SIN456789123',
      taxRegime: 'Régimen Simplificado de Confianza',
      useCFDI: 'G03 - Gastos en general',
      email: 'admin@sistemasintegrados.com',
      phone: '+52 55 5555 1234'
    },
    contacts: [
      {
        id: 'cont-4',
        name: 'Ana López García',
        position: 'Directora Comercial',
        email: 'ana.lopez@sistemasintegrados.com',
        phone: '+52 55 5555 1234',
        isPrimary: true
      }
    ]
  }
];

export const ClientsList = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateContactForm, setShowCreateContactForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contacts.some(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Pequeña';
      case 'medium': return 'Mediana';
      case 'large': return 'Grande';
      case 'enterprise': return 'Empresa';
      default: return size;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'prospect': return 'Prospecto';
      default: return status;
    }
  };

  const handleCreateClient = (newCompany: Omit<Company, 'id' | 'createdAt' | 'lastContact'>) => {
    const company: Company = {
      ...newCompany,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0]
    };
    
    setCompanies([...companies, company]);
  };

  const handleCreateContact = (companyId: string, newContact: any) => {
    setCompanies(companies.map(company => {
      if (company.id === companyId) {
        return {
          ...company,
          contacts: [...company.contacts, {
            ...newContact,
            id: `cont-${Date.now()}`
          }]
        };
      }
      return company;
    }));
  };

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
    setShowDetails(true);
  };

  const handleEditClient = (company: Company) => {
    setSelectedCompany(company);
    setShowEditForm(true);
  };

  const handleUpdateClient = (updatedCompany: Omit<Company, 'id' | 'createdAt' | 'lastContact'>) => {
    if (!selectedCompany) return;
    
    const updated: Company = {
      ...updatedCompany,
      id: selectedCompany.id,
      createdAt: selectedCompany.createdAt,
      lastContact: new Date().toISOString().split('T')[0] // Update last contact
    };
    
    setCompanies(companies.map(company => 
      company.id === selectedCompany.id ? updated : company
    ));
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Clientes ({filteredCompanies.length})
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowCreateForm(true)}>
                  <Building2 className="h-4 w-4 mr-2" />
                  Nuevo Cliente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowCreateContactForm(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nuevo Contacto
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por empresa, industria o contacto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300"
              />
            </div>

            {/* Companies Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Empresa</TableHead>
                    <TableHead>Industria</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Contacto Principal</TableHead>
                    <TableHead>Último Contacto</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => {
                    const primaryContact = company.contacts.find(c => c.isPrimary) || company.contacts[0];
                    return (
                      <TableRow key={company.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{company.name}</p>
                            <p className="text-sm text-gray-500">RFC: {company.billingData.rfc}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">{company.industry}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">{getSizeLabel(company.size)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(company.status)}>
                            {getStatusLabel(company.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {primaryContact && (
                            <div>
                              <p className="text-sm font-medium text-gray-900">{primaryContact.name}</p>
                              <p className="text-xs text-gray-500">{primaryContact.position}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-600">{primaryContact.email}</span>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">
                            {new Date(company.lastContact).toLocaleDateString('es-MX')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(company)}
                              className="border-gray-300 text-gray-600 hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClient(company)}
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {filteredCompanies.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No se encontraron clientes
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl bg-white border border-gray-200 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Detalles del Cliente
            </DialogTitle>
          </DialogHeader>
          
          {selectedCompany && (
            <div className="space-y-6">
              {/* Company Header */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedCompany.name}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge className={getStatusColor(selectedCompany.status)}>
                        {getStatusLabel(selectedCompany.status)}
                      </Badge>
                      <span className="text-sm text-gray-600">{selectedCompany.industry}</span>
                      <span className="text-sm text-gray-600">{getSizeLabel(selectedCompany.size)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Data */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Datos de Facturación
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Razón Social</label>
                      <p className="text-sm text-gray-900">{selectedCompany.billingData.businessName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">RFC</label>
                      <p className="text-sm text-gray-900">{selectedCompany.billingData.rfc}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Régimen Fiscal</label>
                      <p className="text-sm text-gray-900">{selectedCompany.billingData.taxRegime}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Uso de CFDI</label>
                      <p className="text-sm text-gray-900">{selectedCompany.billingData.useCFDI}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Facturación</label>
                      <p className="text-sm text-gray-900">{selectedCompany.billingData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Teléfono</label>
                      <p className="text-sm text-gray-900">{selectedCompany.billingData.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Direcciones
                </h4>
                <div className="space-y-3">
                  {selectedCompany.addresses.map((address) => (
                    <div key={address.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">
                          {address.type === 'main' ? 'Principal' : 
                           address.type === 'billing' ? 'Facturación' : 'Envío'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-900">{address.street}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} {address.zipCode}, {address.country}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contacts */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Contactos ({selectedCompany.contacts.length})
                </h4>
                <div className="space-y-3">
                  {selectedCompany.contacts.map((contact) => (
                    <div key={contact.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            {contact.isPrimary && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">Principal</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{contact.position}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{contact.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{contact.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedCompany.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notas</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedCompany.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Client Form */}
      <CreateClientForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSubmit={handleCreateClient}
      />

      {/* Edit Client Form */}
      <CreateClientForm
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onSubmit={handleUpdateClient}
        initialData={selectedCompany}
        isEdit={true}
      />

      {/* Create Contact Form */}
      <CreateContactForm
        open={showCreateContactForm}
        onOpenChange={setShowCreateContactForm}
        companies={companies}
        onSubmit={handleCreateContact}
      />
    </div>
  );
};
