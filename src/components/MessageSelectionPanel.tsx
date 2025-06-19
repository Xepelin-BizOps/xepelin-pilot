import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, MessageSquare, Mail, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ContactSelector } from './ContactSelector';

interface MessageSelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  type: 'quote' | 'order';
  items: any[];
}

interface MessageTemplate {
  id: string;
  name: string;
  message: string;
  channel: string;
}

export const MessageSelectionPanel: React.FC<MessageSelectionPanelProps> = ({
  isOpen,
  onClose,
  clientName,
  type,
  items
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState('whatsapp');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateMessage, setNewTemplateMessage] = useState('');
  const { toast } = useToast();

  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: 'template-1',
      name: 'Recordatorio Amigable',
      message: 'Hola [CLIENTE], esperamos que esté bien. Le recordamos que tiene pendiente: [ITEMS]. ¿Podríamos coordinar para continuar con el proceso?',
      channel: 'whatsapp'
    },
    {
      id: 'template-2',
      name: 'Seguimiento Formal',
      message: 'Estimado/a [CLIENTE], le escribimos para dar seguimiento a: [ITEMS]. Quedamos atentos a sus comentarios.',
      channel: 'email'
    },
    {
      id: 'template-3',
      name: 'Consulta de Estado',
      message: 'Buenos días [CLIENTE], ¿cómo va todo? Quería consultarle sobre el estado de: [ITEMS]. ¡Gracias!',
      channel: 'whatsapp'
    }
  ]);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setMessage(template.message);
      setSelectedChannel(template.channel);
    }
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim() || !newTemplateMessage.trim()) return;

    if (editingTemplate) {
      setTemplates(prev => 
        prev.map(t => 
          t.id === editingTemplate.id 
            ? { ...t, name: newTemplateName, message: newTemplateMessage, channel: selectedChannel }
            : t
        )
      );
    } else {
      const newTemplate: MessageTemplate = {
        id: `template-${Date.now()}`,
        name: newTemplateName,
        message: newTemplateMessage,
        channel: selectedChannel
      };
      setTemplates(prev => [...prev, newTemplate]);
    }

    setNewTemplateName('');
    setNewTemplateMessage('');
    setEditingTemplate(null);
    setShowTemplateDialog(false);
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setNewTemplateName(template.name);
    setNewTemplateMessage(template.message);
    setSelectedChannel(template.channel);
    setShowTemplateDialog(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    if (selectedTemplate === templateId) {
      setSelectedTemplate('');
      setMessage('');
    }
  };

  const handleSendMessage = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos un elemento para enviar el mensaje",
        variant: "destructive",
      });
      return;
    }

    if (selectedContacts.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos un contacto para enviar el mensaje",
        variant: "destructive",
      });
      return;
    }

    const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
    const itemsList = selectedItemsData.map(item => `${item.id} (${item.client || clientName})`).join(', ');
    
    toast({
      title: `Mensaje enviado por ${selectedChannel === 'both' ? 'WhatsApp y Email' : selectedChannel === 'whatsapp' ? 'WhatsApp' : 'Email'}`,
      description: `Se envió mensaje a ${selectedContacts.length} contacto(s) sobre: ${itemsList}`,
      duration: 5000,
    });

    onClose();
  };

  const filteredTemplates = templates.filter(t => 
    selectedChannel === 'both' || t.channel === selectedChannel
  );

  const totalAmount = items
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Enviar Mensaje - {clientName}
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Channel Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Canal de Comunicación</label>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-full bg-white border-gray-300 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                <SelectItem value="whatsapp">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                    WhatsApp
                  </div>
                </SelectItem>
                <SelectItem value="email">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-blue-600" />
                    Email
                  </div>
                </SelectItem>
                <SelectItem value="both">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-purple-600" />
                    Ambos
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contact Selection */}
          <ContactSelector
            clientName={clientName}
            selectedChannel={selectedChannel}
            selectedContacts={selectedContacts}
            onContactsChange={setSelectedContacts}
          />

          {/* Template Selection */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Plantilla de Mensaje</label>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowTemplateDialog(true)}
                className="border-blue-400 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nueva Plantilla
              </Button>
            </div>
            
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger className="w-full bg-white border-gray-300 rounded-lg">
                <SelectValue placeholder="Seleccionar plantilla..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                {filteredTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Template Management */}
            {filteredTemplates.length > 0 && (
              <Card className="p-3 border border-gray-200 rounded-lg mt-3">
                <div className="text-xs text-gray-600 mb-2">Plantillas disponibles:</div>
                <div className="space-y-2">
                  {filteredTemplates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm font-medium text-gray-800">{template.name}</span>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEditTemplate(template)}
                          className="h-6 w-6 p-0 hover:bg-gray-200"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Item Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'quote' ? 'Cotizaciones' : 'Órdenes'} de {clientName} ({items.length})
            </label>
            <Card className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <input 
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{item.id}</p>
                            <p className="text-sm text-gray-600">Fecha: {item.date}</p>
                            <Badge 
                              variant="secondary"
                              className={
                                item.status === 'Pagado' ? 'bg-blue-100 text-blue-800' :
                                item.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {item.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${item.amount?.toLocaleString()}</p>
                            {item.pending && (
                              <p className="text-xs text-red-600">Pendiente: ${item.pending.toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Message Template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje Personalizado
            </label>
            <Textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-24 bg-white border-gray-300 rounded-lg"
              placeholder="Escribe tu mensaje personalizado..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Variables disponibles: [CLIENTE], [ITEMS]
            </p>
          </div>

          {/* Summary */}
          <Card className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Resumen del Mensaje</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">{type === 'quote' ? 'Cotizaciones' : 'Órdenes'} seleccionadas:</p>
                <p className="font-semibold text-gray-900">{selectedItems.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Contactos seleccionados:</p>
                <p className="font-semibold text-gray-900">{selectedContacts.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Monto total:</p>
                <p className="font-semibold text-gray-900">${totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Canal:</p>
                <p className="font-semibold text-gray-900">
                  {selectedChannel === 'both' ? 'WhatsApp y Email' : 
                   selectedChannel === 'whatsapp' ? 'WhatsApp' : 'Email'}
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={selectedItems.length === 0 || selectedContacts.length === 0}
              onClick={handleSendMessage}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Enviar Mensaje ({selectedItems.length} items, {selectedContacts.length} contactos)
            </Button>
            <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-600 hover:bg-gray-50">
              Cancelar
            </Button>
          </div>
        </div>

        {/* Template Dialog */}
        <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
          <DialogContent className="bg-white border border-gray-200 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Editar Plantilla' : 'Nueva Plantilla de Mensaje'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Plantilla
                </label>
                <Input
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Ej: Recordatorio Amigable"
                  className="bg-white border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canal Principal
                </label>
                <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                  <SelectTrigger className="w-full bg-white border-gray-300 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <Textarea
                  value={newTemplateMessage}
                  onChange={(e) => setNewTemplateMessage(e.target.value)}
                  className="min-h-32 bg-white border-gray-300 rounded-lg"
                  placeholder="Escribe tu mensaje aquí..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Variables: [CLIENTE], [ITEMS]
                </p>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={handleSaveTemplate}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newTemplateName.trim() || !newTemplateMessage.trim()}
                >
                  {editingTemplate ? 'Actualizar' : 'Crear'} Plantilla
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowTemplateDialog(false)}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
