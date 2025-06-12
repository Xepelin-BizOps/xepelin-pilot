
import React, { useState } from 'react';
import { UnifiedDashboard } from '@/components/UnifiedDashboard';
import { QuoteCreation } from '@/components/QuoteCreation';
import { SalesOrders } from '@/components/SalesOrders';
import { ClientHistoryPanel } from '@/components/ClientHistoryPanel';
import { MassReminderPanel } from '@/components/MassReminderPanel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [activeTab, setActiveTab] = useState('quotes');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showReminderPanel, setShowReminderPanel] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Xepelin</h1>
              <span className="ml-3 text-sm text-gray-500">Gestión Comercial</span>
            </div>
            <Button 
              onClick={() => setShowReminderPanel(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Enviar Recordatorios
            </Button>
          </div>
        </div>
      </div>

      {/* Unified Dashboard - Always Visible */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <UnifiedDashboard />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
            <TabsTrigger 
              value="quotes" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-md"
            >
              Cotizaciones
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-md"
            >
              Órdenes de Venta
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="quotes" className="mt-6">
            <QuoteCreation onClientClick={setSelectedClient} />
          </TabsContent>
          
          <TabsContent value="orders" className="mt-6">
            <SalesOrders onClientClick={setSelectedClient} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Client History Panel */}
      {selectedClient && (
        <ClientHistoryPanel 
          client={selectedClient} 
          onClose={() => setSelectedClient(null)} 
        />
      )}

      {/* Mass Reminder Panel */}
      {showReminderPanel && (
        <MassReminderPanel onClose={() => setShowReminderPanel(false)} />
      )}
    </div>
  );
};

export default Index;
