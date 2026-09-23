import React, { useState } from 'react';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TrackingSection } from '@/components/tracking/TrackingSection';
import { CalculatorSection } from '@/components/calculator/CalculatorSection';
import { PersonalShopperSection } from '@/components/shopper/PersonalShopperSection';
import { ServicesSection } from '@/components/services/ServicesSection';
import { WarehousesSection } from '@/components/warehouses/WarehousesSection';
import { MessageCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('tracking');

  const renderContent = () => {
    switch (activeTab) {
      case 'tracking':
        return (
          <>
            <TrackingSection />
            <CalculatorSection />
            <PersonalShopperSection />
            <ServicesSection />
            <WarehousesSection />
          </>
        );
      case 'calculator':
        return <CalculatorSection />;
      case 'personal-shopper':
        return <PersonalShopperSection />;
      case 'services':
        return <ServicesSection />;
      case 'warehouses':
        return <WarehousesSection />;
      default:
        return <TrackingSection />;
    }
  };

  return (
    <CurrencyProvider>
      <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main style={{ flex: 1 }}>
          {renderContent()}
        </main>

        <Footer setActiveTab={setActiveTab} />

        {/* Botón Flotante Permanente de WhatsApp */}
        <a
          href="https://wa.me/34661532115?text=Hola%20Guineval,%20deseo%20hacer%20una%20consulta"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999,
            backgroundColor: '#25d366',
            color: '#ffffff',
            borderRadius: '50px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.25)',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            fontSize: '0.95rem',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(37, 211, 102, 0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.4)';
          }}
        >
          <MessageCircle size={22} />
          <span>Chat WhatsApp</span>
        </a>
      </div>
    </CurrencyProvider>
  );
};

export default App;
