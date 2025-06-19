import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { X, MessageSquare, Plus, Edit, Trash2, Mail } from 'lucide-react';
import { ContactSelector } from './ContactSelector';
import { useToast } from '@/hooks/use-toast';

interface MassReminderPanelProps {
  onClose: () => void;
}

interface WhatsAppTemplate {
  id: string;
  name: string;
  message: string;
}

export const MassReminderPanel: React.FC<MassReminderPanelProps> = ({ onClose }) => {
  const [selectedChannel, setSelectedChannel] = useState('whatsapp');
  const [selectedOrders, setSelectedOrders] = useState<string[]>(['ORD-2024-001', 'ORD-2024-002']);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [message, setMessage] = useState('Estimado cliente, le recordamos que tiene un pago pendiente. Puede realizar el pago a través del siguiente enlace: [LINK_PAGO]');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppTemplate | null>(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateMessage, setNewTemplateMessage] = useState('');
  const { toast } = useToast();

  // Plantillas predefinidas de WhatsApp
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplate[]>([
    {
      id: 'template-1',
      name: 'Recordatorio Amigable',
      message: 'Hola [CLIENTE], esperamos que esté bien. Le recordamos que tiene un pago pendiente por $[MONTO]. Puede pagar fácilmente a través de este enlace: [LINK_PAGO]. ¡Gracias por su preferencia!'
    },
    {
      id: 'template-2',
      name: 'Recordatorio Formal',
      message: 'Estimado/a [CLIENTE], le informamos que tiene un pago vencido por $[MONTO] correspondiente a la orden [ORDEN]. Para evitar inconvenientes, puede realizar el pago aquí: [LINK_PAGO]'
    },
    {
      id: 'template-3',
      name: 'Recordatorio Urgente',
      message: '⚠️ PAGO VENCIDO ⚠️\n\n[CLIENTE], su pago de $[MONTO] está vencido desde el [FECHA_VENCIMIENTO]. Es importante que regularice su situación. Pague ahora: [LINK_PAGO]'
    }
  ]);

  const unpaidOrders = [
    {
      id: 'ORD-2024-001',
      client: 'Innovación Digital S.C.',
      amount: 20000,
      dueDate: '2024-06-15',
      contact: '+52 55 1234 5678'
    },
    {
      id: 'ORD-2024-002', 
      client: 'Tecnología Avanzada S.A.',
      amount: 32000,
      dueDate: '2024-06-18',
      contact: 'contacto@tecavanzada.com'
    },
    {
      id: 'ORD-2024-004',
      client: 'Sistemas Integrados',
      amount: 15000,
      dueDate: '2024-06-20',
      contact: '+52 55 9876 5432'
    }
  ];

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = whatsappTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setMessage(template.message);
    }
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim() || !newTemplateMessage.trim()) return;

    if (editingTemplate) {
      // Editar plantilla existente
      setWhatsappTemplates(prev => 
        prev.map(t => 
          t.id === editingTemplate.id 
            ? { ...t, name: newTemplateName, message: newTemplateMessage }
            : t
        )
      );
    } else {
      // Crear nueva plantilla
      const newTemplate: WhatsAppTemplate = {
        id: `template-${Date.now()}`,
        name: newTemplateName,
        message: newTemplateMessage
      };
      setWhatsappTemplates(prev => [...prev, newTemplate]);
    }

    // Limpiar y cerrar
    setNewTemplateName('');
    setNewTemplateMessage('');
    setEditingTemplate(null);
    setShowTemplateDialog(false);
  };

  const handleEditTemplate = (template: WhatsAppTemplate) => {
    setEditingTemplate(template);
    setNewTemplateName(template.name);
    setNewTemplateMessage(template.message);
    setShowTemplateDialog(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setWhatsappTemplates(prev => prev.filter(t => t.id !== templateId));
    if (selectedTemplate === templateId) {
      setSelectedTemplate('');
      setMessage('');
    }
  };

  const openNewTemplateDialog = () => {
    setEditingTemplate(null);
    setNewTemplateName('');
    setNewTemplateMessage('');
    setShowTemplateDialog(true);
  };

  const handleSendReminders = () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos una orden para enviar recordatorios",
        variant: "destructive",
      });
      return;
    }

    if (selectedContacts.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos un contacto para enviar los recordatorios",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Recordatorios enviados por ${selectedChannel === 'both' ? 'WhatsApp y Email' : selectedChannel === 'whatsapp' ? 'WhatsApp' : 'Email'}`,
      description: `Se enviaron ${selectedOrders.length} recordatorios a ${selectedContacts.length} contacto(s)`,
      duration: 5000,
    });

    onClose();
  };

  const selectedOrdersData = unpaidOrders.filter(order => selectedOrders.includes(order.id));
  const totalAmount = selectedOrdersData.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Envío Masivo de Recordatorios</h3>
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
                    <div className="flex mr-2">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                      <Mail className="w-4 h-4 text-blue-600 -ml-1" />
                    </div>
                    Ambos
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contact Selection - using generic client name for mass reminders */}
          <ContactSelector
            clientName="Clientes Múltiples"
            selectedChannel={selectedChannel}
            selectedContacts={selectedContacts}
            onContactsChange={setSelectedContacts}
          />

          {/* WhatsApp Template Selection */}
          {(selectedChannel === 'whatsapp' || selectedChannel === 'both') && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Plantilla de WhatsApp</label>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={openNewTemplateDialog}
                  className="border-green-400 text-green-600 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Nueva Plantilla
                </Button>
              </div>
              
              <div className="space-y-3">
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="w-full bg-white border-gray-300 rounded-lg">
                    <SelectValue placeholder="Seleccionar plantilla..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    {whatsappTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Template Management */}
                {whatsappTemplates.length > 0 && (
                  <Card className="p-3 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-600 mb-2">Plantillas disponibles:</div>
                    <div className="space-y-2">
                      {whatsappTemplates.map((template) => (
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
            </div>
          )}

          {/* Order Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Órdenes Pendientes de Pago ({unpaidOrders.length})
            </label>
            <Card className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {unpaidOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <input 
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{order.client}</p>
                            <p className="text-sm text-gray-600">{order.id}</p>
                            <p className="text-xs text-gray-500">Vence: {order.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${order.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{order.contact}</p>
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
              {selectedChannel === 'whatsapp' ? 'Mensaje de WhatsApp' : 
               selectedChannel === 'email' ? 'Mensaje de Email' :
               'Mensaje'}
            </label>
            <Textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-24 bg-white border-gray-300 rounded-lg"
              placeholder="Personaliza tu mensaje..."
            />
            {selectedChannel === 'whatsapp' || selectedChannel === 'both' ? (
              <p className="text-xs text-gray-500 mt-1">
                Variables disponibles: [CLIENTE], [MONTO], [ORDEN], [FECHA_VENCIMIENTO], [LINK_PAGO]
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Usa [LINK_PAGO] para incluir el enlace de pago automáticamente
              </p>
            )}
          </div>

          {/* Summary */}
          <Card className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Resumen del Envío</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Órdenes seleccionadas:</p>
                <p className="font-semibold text-gray-900">{selectedOrders.length}</p>
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
                  {selectedChannel === 'whatsapp' ? 'WhatsApp' : 
                   selectedChannel === 'email' ? 'Email' : 
                   'WhatsApp y Email'}
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={selectedOrders.length === 0 || selectedContacts.length === 0}
              onClick={handleSendReminders}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Enviar Recordatorios ({selectedOrders.length} órdenes, {selectedContacts.length} contactos)
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
                {editingTemplate ? 'Editar Plantilla' : 'Nueva Plantilla de WhatsApp'}
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
                  Mensaje
                </label>
                <Textarea
                  value={newTemplateMessage}
                  onChange={(e) => setNewTemplateMessage(e.target.value)}
                  className="min-h-32 bg-white border-gray-300 rounded-lg"
                  placeholder="Escribe tu mensaje aquí..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Variables: [CLIENTE], [MONTO], [ORDEN], [FECHA_VENCIMIENTO], [LINK_PAGO]
                </p>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={handleSaveTemplate}
                  className="flex-1 bg-green-600 hover:bg-green-700"
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
