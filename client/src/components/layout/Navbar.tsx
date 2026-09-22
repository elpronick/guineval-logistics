import React, { useState } from 'react';
import { Package, MessageCircle, Menu, X, PlaneTakeoff, Ship, ShoppingBag, MapPin } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import styles from './Navbar.module.scss';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currency, setCurrency } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'tracking', label: 'Rastrear Envío', icon: Package },
    { id: 'calculator', label: 'Cotizador', icon: PlaneTakeoff },
    { id: 'personal-shopper', label: 'Personal Shopper', icon: ShoppingBag },
    { id: 'services', label: 'Servicios', icon: Ship },
    { id: 'warehouses', label: 'Sedes y Almacenes', icon: MapPin },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        {/* Logotipo Guineval */}
        <a href="#inicio" className={styles.brand} onClick={() => handleNavClick('tracking')}>
          <div className={styles.logoBox}>
            <Package size={24} strokeWidth={2.5} />
          </div>
          <div className={styles.brandInfo}>
            <span className={styles.title}>
              GUINEVAL<span>.</span>
            </span>
            <span className={styles.subtitle}>Logistics España - Guinea</span>
          </div>
        </a>

        {/* Enlaces de Navegación de Escritorio */}
        <nav className={styles.navLinks}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`${styles.navLink} ${activeTab === item.id ? styles.active : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Selector de Moneda y Contacto */}
        <div className={styles.actions}>
          {/* Switch Bimoneda EUR / XAF */}
          <div
            className={styles.currencySwitch}
            title="Cambiar divisa activa"
            onClick={() => setCurrency(currency === 'EUR' ? 'XAF' : 'EUR')}
          >
            <span className={`${styles.currencyOption} ${currency === 'EUR' ? styles.activeOption : ''}`}>
              EUR €
            </span>
            <span className={`${styles.currencyOption} ${currency === 'XAF' ? styles.activeOption : ''}`}>
              XAF CFA
            </span>
          </div>

          {/* Botón WhatsApp España (+34 661 532 115) */}
          <a
            href="https://wa.me/34661532115?text=Hola%20Guineval,%20deseo%20informaci%C3%B3n%20sobre%20sus%20servicios"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </a>

          {/* Menú Móvil Hamburguesa */}
          <button
            className={styles.mobileToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={styles.mobileLink}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon size={18} color="#f5a623" />
                  {item.label}
                </span>
              </button>
            );
          })}
          <a
            href="https://wa.me/34661532115"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            style={{ marginTop: '0.5rem', width: '100%' }}
          >
            <MessageCircle size={18} />
            <span>Contactar por WhatsApp (+34 661 532 115)</span>
          </a>
        </div>
      )}
    </header>
  );
};
