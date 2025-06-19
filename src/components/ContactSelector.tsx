import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Mail, MessageSquare, User, X } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
  whatsapp: string;
  clientId?: string;
}

interface ContactSelectorProps {
  clientName: string;
  selectedChannel: string;
  selectedContacts: string[];
  onContactsChange: (contactIds: string[]) => void;
}

export const ContactSelector: React.FC<ContactSelectorProps> = ({
  clientName,
  selectedChannel,
  selectedContacts,
  onContactsChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    position: '',
    email: '',
    whatsapp: ''
  });
  const [hasPreselected, setHasPreselected] = useState(false);

  // Mock contacts data - in real app this would come from API/database
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'contact-1',
      name: 'Juan Pérez',
      position: 'Director General',
      email: 'juan.perez@innovaciondigital.com',
      whatsapp: '+52 55 1234 5678',
      clientId: 'client-1'
    },
    {
      id: 'contact-2',
      name: 'María González',
      position: 'Gerente de Compras',
      email: 'maria.gonzalez@innovaciondigital.com',
      whatsapp: '+52 55 1234 5679',
      clientId: 'client-1'
    },
    {
      id: 'contact-3',
      name: 'Carlos Ruiz',
      position: 'CTO',
      email: 'carlos.ruiz@tecavanzada.com',
      whatsapp: '+52 55 9876 5432',
      clientId: 'client-2'
    },
    {
      id: 'contact-4',
      name: 'Ana López',
      position: 'CFO',
      email: 'ana.lopez@sistemasintegrados.com',
      whatsapp: '+52 55 5555 1234',
      clientId: 'client-3'
    }
  ]);

  // Auto-preselect client contacts when component mounts or clientName changes
  useEffect(() => {
    if (!hasPreselected && clientName !== 'Clientes Múltiples') {
      const clientContacts = contacts.filter(contact => 
        contact.clientId === 'client-1' // This would be dynamic based on actual client
      );
      
      const availableClientContacts = clientContacts.filter(contact => 
        isContactAvailable(contact)
      );
      
      if (availableClientContacts.length > 0) {
        const contactIds = availableClientContacts.map(contact => contact.id);
        onContactsChange(contactIds);
        setHasPreselected(true);
      }
    }
  }, [clientName, selectedChannel, contacts, hasPreselected, onContactsChange]);

  // Reset preselection flag when clientName or channel changes
  useEffect(() => {
    setHasPreselected(false);
  }, [clientName, selectedChannel]);

  // Filter contacts based on client and search term
  const clientContacts = contacts.filter(contact => 
    contact.clientId === 'client-1' // This would be dynamic based on actual client
  );

  const otherContacts = contacts.filter(contact => 
    contact.clientId !== 'client-1'
  );

  const filteredContacts = [...clientContacts, ...otherContacts].filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleContactSelection = (contactId: string) => {
    const newSelected = selectedContacts.includes(contactId)
      ? selectedContacts.filter(id => id !== contactId)
      : [...selectedContacts, contactId];
    onContactsChange(newSelected);
  };

  const handleCreateContact = () => {
    if (!newContact.name.trim() || (!newContact.email.trim() && !newContact.whatsapp.trim())) {
      return;
    }

    const contact: Contact = {
      id: `contact-${Date.now()}`,
      name: newContact.name,
      position: newContact.position,
      email: newContact.email,
      whatsapp: newContact.whatsapp,
      clientId: 'client-1' // This would be dynamic
    };

    setContacts(prev => [...prev, contact]);
    setNewContact({ name: '', position: '', email: '', whatsapp: '' });
    setShowCreateDialog(false);
    
    // Auto-select the new contact
    onContactsChange([...selectedContacts, contact.id]);
  };

  const getContactAvailableChannels = (contact: Contact) => {
    const channels = [];
    if (contact.email) channels.push('email');
    if (contact.whatsapp) channels.push('whatsapp');
    return channels;
  };

  const isContactAvailable = (contact: Contact) => {
    const availableChannels = getContactAvailableChannels(contact);
    if (selectedChannel === 'both') {
      return availableChannels.includes('email') || availableChannels.includes('whatsapp');
    }
    return availableChannels.includes(selectedChannel);
  };

  const selectedContactsData = contacts.filter(c => selectedContacts.includes(c.id));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contactos para {clientName}
        </label>
        
        {/* Search and Add */}
        <div className="flex space-x-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar contactos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-300"
            />
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            variant="outline"
            className="border-blue-400 text-blue-600 hover:bg-blue-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nuevo
          </Button>
        </div>

        {/* Selected Contacts Summary */}
        {selectedContacts.length > 0 && (
          <Card className="p-3 bg-blue-50 border border-blue-200 mb-3">
            <div className="text-sm text-blue-700 mb-2">
              Contactos seleccionados ({selectedContacts.length}):
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedContactsData.map((contact) => (
                <Badge
                  key={contact.id}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                  onClick={() => toggleContactSelection(contact.id)}
                >
                  {contact.name}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Contacts List */}
        <Card className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {/* Client Contacts */}
            {clientContacts.length > 0 && (
              <div>
                <div className="bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 border-b">
                  Contactos de {clientName}
                </div>
                {clientContacts
                  .filter(contact => 
                    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contact.position.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((contact) => (
                    <ContactItem
                      key={contact.id}
                      contact={contact}
                      isSelected={selectedContacts.includes(contact.id)}
                      isAvailable={isContactAvailable(contact)}
                      selectedChannel={selectedChannel}
                      onToggle={() => toggleContactSelection(contact.id)}
                    />
                  ))}
              </div>
            )}

            {/* Other Contacts */}
            {otherContacts.some(contact => 
              contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              contact.position.toLowerCase().includes(searchTerm.toLowerCase())
            ) && (
              <div>
                <div className="bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 border-b">
                  Otros contactos
                </div>
                {otherContacts
                  .filter(contact => 
                    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contact.position.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((contact) => (
                    <ContactItem
                      key={contact.id}
                      contact={contact}
                      isSelected={selectedContacts.includes(contact.id)}
                      isAvailable={isContactAvailable(contact)}
                      selectedChannel={selectedChannel}
                      onToggle={() => toggleContactSelection(contact.id)}
                    />
                  ))}
              </div>
            )}

            {filteredContacts.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No se encontraron contactos
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Create Contact Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-white border border-gray-200 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle>Nuevo Contacto para {clientName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <Input
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre completo"
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puesto
              </label>
              <Input
                value={newContact.position}
                onChange={(e) => setNewContact(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Cargo o posición"
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <Input
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                placeholder="correo@ejemplo.com"
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <Input
                value={newContact.whatsapp}
                onChange={(e) => setNewContact(prev => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="+52 55 1234 5678"
                className="bg-white border-gray-300"
              />
            </div>
            <p className="text-xs text-gray-500">
              * Campos obligatorios. Debe proporcionar al menos un correo o WhatsApp.
            </p>
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleCreateContact}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!newContact.name.trim() || (!newContact.email.trim() && !newContact.whatsapp.trim())}
              >
                Crear Contacto
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ContactItemProps {
  contact: Contact;
  isSelected: boolean;
  isAvailable: boolean;
  selectedChannel: string;
  onToggle: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  isSelected,
  isAvailable,
  selectedChannel,
  onToggle
}) => {
  return (
    <div 
      className={`p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
        !isAvailable ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          checked={isSelected}
          onChange={onToggle}
          disabled={!isAvailable}
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-1 text-gray-400" />
                {contact.name}
              </p>
              {contact.position && (
                <p className="text-sm text-gray-600">{contact.position}</p>
              )}
              <div className="flex items-center space-x-3 mt-1">
                {contact.email && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Mail className="w-3 h-3 mr-1" />
                    {contact.email}
                  </div>
                )}
                {contact.whatsapp && (
                  <div className="flex items-center text-xs text-gray-500">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {contact.whatsapp}
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-1">
              {contact.email && (
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    selectedChannel === 'email' || selectedChannel === 'both'
                      ? 'border-blue-300 text-blue-600'
                      : 'border-gray-300 text-gray-500'
                  }`}
                >
                  Email
                </Badge>
              )}
              {contact.whatsapp && (
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    selectedChannel === 'whatsapp' || selectedChannel === 'both'
                      ? 'border-green-300 text-green-600'
                      : 'border-gray-300 text-gray-500'
                  }`}
                >
                  WhatsApp
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isAvailable && (
        <p className="text-xs text-red-500 mt-1 ml-6">
          No disponible para el canal seleccionado
        </p>
      )}
    </div>
  );
};
