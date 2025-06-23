
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Building2, MapPin, Users, FileText, Plus, Trash2 } from 'lucide-react';
import { Company, Address, Contact, BillingData } from '@/types/client';

interface CreateClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (company: Omit<Company, 'id' | 'createdAt' | 'lastContact'>) => void;
  initialData?: Company | null;
  isEdit?: boolean;
}

export const CreateClientForm = ({ open, onOpenChange, onSubmit, initialData, isEdit = false }: CreateClientFormProps) => {
  const [addresses, setAddresses] = useState<Omit<Address, 'id'>[]>([
    { street: '', city: '', state: '', zipCode: '', country: 'México', type: 'main' }
  ]);
  
  const [contacts, setContacts] = useState<Omit<Contact, 'id'>[]>([
    { name: '', position: '', email: '', phone: '', whatsapp: '', isPrimary: true }
  ]);

  const form = useForm({
    defaultValues: {
      name: '',
      industry: '',
      size: 'small' as const,
      status: 'prospect' as const,
      businessName: '',
      rfc: '',
      taxRegime: '',
      useCFDI: 'G03 - Gastos en general',
      email: '',
      phone: '',
      notes: ''
    }
  });

  // Populate form when editing
  useEffect(() => {
    if (isEdit && initialData && open) {
      form.reset({
        name: initialData.name,
        industry: initialData.industry,
        size: initialData.size,
        status: initialData.status,
        businessName: initialData.billingData.businessName,
        rfc: initialData.billingData.rfc,
        taxRegime: initialData.billingData.taxRegime,
        useCFDI: initialData.billingData.useCFDI,
        email: initialData.billingData.email,
        phone: initialData.billingData.phone,
        notes: initialData.notes || ''
      });

      // Set addresses
      setAddresses(initialData.addresses.map(addr => ({
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
        country: addr.country,
        type: addr.type
      })));

      // Set contacts
      setContacts(initialData.contacts.map(contact => ({
        name: contact.name,
        position: contact.position,
        email: contact.email,
        phone: contact.phone,
        whatsapp: contact.whatsapp || '',
        isPrimary: contact.isPrimary
      })));
    } else if (!isEdit && open) {
      // Reset form for new client
      form.reset({
        name: '',
        industry: '',
        size: 'small' as const,
        status: 'prospect' as const,
        businessName: '',
        rfc: '',
        taxRegime: '',
        useCFDI: 'G03 - Gastos en general',
        email: '',
        phone: '',
        notes: ''
      });
      setAddresses([{ street: '', city: '', state: '', zipCode: '', country: 'México', type: 'main' }]);
      setContacts([{ name: '', position: '', email: '', phone: '', whatsapp: '', isPrimary: true }]);
    }
  }, [isEdit, initialData, open, form]);

  const addAddress = () => {
    setAddresses([...addresses, { street: '', city: '', state: '', zipCode: '', country: 'México', type: 'shipping' }]);
  };

  const removeAddress = (index: number) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((_, i) => i !== index));
    }
  };

  const updateAddress = (index: number, field: keyof Address, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setAddresses(newAddresses);
  };

  const addContact = () => {
    setContacts([...contacts, { name: '', position: '', email: '', phone: '', whatsapp: '', isPrimary: false }]);
  };

  const removeContact = (index: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index));
    }
  };

  const updateContact = (index: number, field: keyof Contact, value: string | boolean) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    
    // Si marcamos un contacto como primario, desmarcamos los demás
    if (field === 'isPrimary' && value === true) {
      newContacts.forEach((contact, i) => {
        if (i !== index) contact.isPrimary = false;
      });
    }
    
    setContacts(newContacts);
  };

  const handleSubmit = (data: any) => {
    const newCompany: Omit<Company, 'id' | 'createdAt' | 'lastContact'> = {
      name: data.name,
      industry: data.industry,
      size: data.size,
      status: data.status,
      addresses: addresses.map((addr, index) => ({
        ...addr,
        id: isEdit && initialData ? initialData.addresses[index]?.id || `temp-addr-${index}` : `temp-addr-${index}`
      })),
      billingData: {
        id: isEdit && initialData ? initialData.billingData.id : 'temp-billing',
        businessName: data.businessName || data.name,
        rfc: data.rfc,
        taxRegime: data.taxRegime,
        useCFDI: data.useCFDI,
        email: data.email,
        phone: data.phone
      },
      contacts: contacts.map((contact, index) => ({
        ...contact,
        id: isEdit && initialData ? initialData.contacts[index]?.id || `temp-contact-${index}` : `temp-contact-${index}`
      })),
      notes: data.notes
    };

    onSubmit(newCompany);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white border border-gray-200 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Información General */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Building2 className="h-5 w-5 mr-2" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la Empresa *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ej. Innovación Digital S.A. de C.V." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industria *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ej. Tecnología" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tamaño de Empresa</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="small">Pequeña</SelectItem>
                            <SelectItem value="medium">Mediana</SelectItem>
                            <SelectItem value="large">Grande</SelectItem>
                            <SelectItem value="enterprise">Empresa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="prospect">Prospecto</SelectItem>
                            <SelectItem value="active">Activo</SelectItem>
                            <SelectItem value="inactive">Inactivo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Datos de Facturación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="h-5 w-5 mr-2" />
                  Datos de Facturación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razón Social</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Dejar vacío para usar nombre de empresa" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rfc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RFC *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ej. INN123456789" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="taxRegime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Régimen Fiscal *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ej. Régimen General de Ley Personas Morales" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="useCFDI"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uso de CFDI</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de Facturación *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="facturacion@empresa.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+52 55 1234 5678" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Direcciones */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2" />
                    Direcciones
                  </CardTitle>
                  <Button type="button" onClick={addAddress} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Dirección
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.map((address, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <Select 
                        value={address.type} 
                        onValueChange={(value) => updateAddress(index, 'type', value as Address['type'])}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">Principal</SelectItem>
                          <SelectItem value="billing">Facturación</SelectItem>
                          <SelectItem value="shipping">Envío</SelectItem>
                        </SelectContent>
                      </Select>
                      {addresses.length > 1 && (
                        <Button 
                          type="button" 
                          onClick={() => removeAddress(index)} 
                          variant="ghost" 
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <Input
                        placeholder="Calle y número"
                        value={address.street}
                        onChange={(e) => updateAddress(index, 'street', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        placeholder="Ciudad"
                        value={address.city}
                        onChange={(e) => updateAddress(index, 'city', e.target.value)}
                      />
                      <Input
                        placeholder="Estado"
                        value={address.state}
                        onChange={(e) => updateAddress(index, 'state', e.target.value)}
                      />
                      <Input
                        placeholder="Código Postal"
                        value={address.zipCode}
                        onChange={(e) => updateAddress(index, 'zipCode', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contactos */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-lg">
                    <Users className="h-5 w-5 mr-2" />
                    Contactos
                  </CardTitle>
                  <Button type="button" onClick={addContact} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Contacto
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {contacts.map((contact, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={contact.isPrimary}
                          onChange={(e) => updateContact(index, 'isPrimary', e.target.checked)}
                          className="rounded"
                        />
                        <label className="text-sm font-medium">Contacto Principal</label>
                      </div>
                      {contacts.length > 1 && (
                        <Button 
                          type="button" 
                          onClick={() => removeContact(index)} 
                          variant="ghost" 
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Nombre completo"
                        value={contact.name}
                        onChange={(e) => updateContact(index, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="Puesto"
                        value={contact.position}
                        onChange={(e) => updateContact(index, 'position', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        placeholder="Email"
                        type="email"
                        value={contact.email}
                        onChange={(e) => updateContact(index, 'email', e.target.value)}
                      />
                      <Input
                        placeholder="Teléfono"
                        value={contact.phone}
                        onChange={(e) => updateContact(index, 'phone', e.target.value)}
                      />
                      <Input
                        placeholder="WhatsApp"
                        value={contact.whatsapp}
                        onChange={(e) => updateContact(index, 'whatsapp', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Información adicional sobre el cliente..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {isEdit ? 'Actualizar Cliente' : 'Crear Cliente'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
