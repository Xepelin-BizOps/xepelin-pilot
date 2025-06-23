
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { UserPlus } from 'lucide-react';
import { Company, Contact } from '@/types/client';

interface CreateContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: Company[];
  onSubmit: (companyId: string, contact: Omit<Contact, 'id'>) => void;
}

export const CreateContactForm = ({ open, onOpenChange, companies, onSubmit }: CreateContactFormProps) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  const form = useForm({
    defaultValues: {
      name: '',
      position: '',
      email: '',
      phone: '',
      whatsapp: '',
      isPrimary: false
    }
  });

  const handleSubmit = (data: any) => {
    if (!selectedCompanyId) return;

    const newContact: Omit<Contact, 'id'> = {
      name: data.name,
      position: data.position,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      isPrimary: data.isPrimary
    };

    onSubmit(selectedCompanyId, newContact);
    onOpenChange(false);
    form.reset();
    setSelectedCompanyId('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-gray-200 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Crear Nuevo Contacto
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Selección de Empresa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Seleccionar Empresa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Información del Contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información del Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ej. Juan Pérez Rodríguez" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Puesto *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ej. Director General" />
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
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="contacto@empresa.com" />
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
                        <FormLabel>Teléfono *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+52 55 1234 5678" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+52 55 1234 5678" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isPrimary"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 pt-6">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="rounded"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium">
                          Contacto Principal
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!selectedCompanyId}
              >
                Crear Contacto
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
