
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, Plus, Edit, Save, X } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export const EditContactModal: React.FC<EditContactModalProps> = ({ isOpen, onClose, order }) => {
  const { toast } = useToast();
  
  // Mock data de contactos - en una app real vendría de la API
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'contact-1',
      name: 'Juan Pérez',
      position: 'Director General',
      email: 'juan.perez@innovaciondigital.com',
      phone: '+52 55 1234 5678',
      isPrimary: true
    },
    {
      id: 'contact-2',
      name: 'María González',
      position: 'Gerente de Compras',
      email: 'maria.gonzalez@innovaciondigital.com',
      phone: '+52 55 1234 5679',
      isPrimary: false
    },
    {
      id: 'contact-3',
      name: 'Carlos Ruiz',
      position: 'Coordinador de Proyectos',
      email: 'carlos.ruiz@innovaciondigital.com',
      phone: '+52 55 1234 5680',
      isPrimary: false
    }
  ]);

  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    position: '',
    email: '',
    phone: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContactForm, setNewContactForm] = useState({
    name: '',
    position: '',
    email: '',
    phone: ''
  });

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact.id);
    setEditForm({
      name: contact.name,
      position: contact.position,
      email: contact.email,
      phone: contact.phone
    });
  };

  const handleSaveContact = (contactId: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, ...editForm }
        : contact
    ));
    
    setEditingContact(null);
    toast({
      title: "Contacto Actualizado",
      description: `La información de ${editForm.name} ha sido actualizada correctamente.`,
    });
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
    setEditForm({ name: '', position: '', email: '', phone: '' });
  };

  const handleAddContact = () => {
    if (!newContactForm.name.trim() || !newContactForm.email.trim()) {
      return;
    }

    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: newContactForm.name,
      position: newContactForm.position,
      email: newContactForm.email,
      phone: newContactForm.phone,
      isPrimary: false
    };

    setContacts(prev => [...prev, newContact]);
    setNewContactForm({ name: '', position: '', email: '', phone: '' });
    setShowAddForm(false);
    
    toast({
      title: "Contacto Agregado",
      description: `${newContact.name} ha sido agregado como contacto de ${order.client}.`,
    });
  };

  const handleSetPrimary = (contactId: string) => {
    setContacts(prev => prev.map(contact => ({
      ...contact,
      isPrimary: contact.id === contactId
    })));
    
    toast({
      title: "Contacto Principal Actualizado",
      description: "Se ha establecido un nuevo contacto principal.",
    });
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Contactos de {order.client}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Información de la empresa */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Información de la Empresa</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Orden: {order.id}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Empresa</Label>
                <p className="text-gray-900 font-medium">{order.client}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Total de Contactos</Label>
                <p className="text-gray-900 font-medium">{contacts.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Lista de contactos */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Contactos ({contacts.length})</h3>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar Contacto
              </Button>
            </div>

            <div className="space-y-4">
              {contacts.map((contact) => (
                <Card key={contact.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    {editingContact === contact.id ? (
                      // Formulario de edición
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                            <Input
                              value={editForm.name}
                              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Puesto</Label>
                            <Input
                              value={editForm.position}
                              onChange={(e) => setEditForm(prev => ({ ...prev, position: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Email</Label>
                            <Input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
                            <Input
                              value={editForm.phone}
                              onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleSaveContact(contact.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Guardar
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            size="sm"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Vista normal del contacto
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{contact.name}</h4>
                            {contact.isPrimary && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                Principal
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{contact.position}</p>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {contact.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              {contact.phone}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!contact.isPrimary && (
                            <Button
                              onClick={() => handleSetPrimary(contact.id)}
                              variant="outline"
                              className="border-blue-400 text-blue-600 hover:bg-blue-50"
                              size="sm"
                            >
                              Hacer Principal
                            </Button>
                          )}
                          <Button
                            onClick={() => handleEditContact(contact)}
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            size="sm"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Formulario para agregar nuevo contacto */}
          {showAddForm && (
            <Card className="border border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 mb-4">Agregar Nuevo Contacto</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Nombre *</Label>
                    <Input
                      value={newContactForm.name}
                      onChange={(e) => setNewContactForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nombre completo"
                      className="mt-1 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Puesto</Label>
                    <Input
                      value={newContactForm.position}
                      onChange={(e) => setNewContactForm(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="Cargo o posición"
                      className="mt-1 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email *</Label>
                    <Input
                      type="email"
                      value={newContactForm.email}
                      onChange={(e) => setNewContactForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="correo@empresa.com"
                      className="mt-1 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
                    <Input
                      value={newContactForm.phone}
                      onChange={(e) => setNewContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+52 55 1234 5678"
                      className="mt-1 bg-white"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleAddContact}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                    disabled={!newContactForm.name.trim() || !newContactForm.email.trim()}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewContactForm({ name: '', position: '', email: '', phone: '' });
                    }}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    size="sm"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex space-x-2 pt-4">
          <Button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
