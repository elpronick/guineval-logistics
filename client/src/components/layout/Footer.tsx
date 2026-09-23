import React from 'react';
import { MapPin, Phone, Mail, Clock, Package } from 'lucide-react';
import styles from './Footer.module.scss';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          {/* Columna 1: Empresa y Lema */}
          <div className={styles.companyCol}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#f5a623',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f121e',
                }}
              >
                <Package size={20} strokeWidth={2.5} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>
                EXPORTACIONES GUINEVAL <span style={{ color: '#f5a623' }}>S.L.</span>
              </h3>
            </div>
            <p>
              Especialistas en logística integral, transporte aéreo y marítimo, contenedores completos y grupajes entre España y Guinea Ecuatorial (Malabo y Bata).
            </p>
            <div className={styles.tagline}>
              ★ "Elija lo que quiera por internet y nosotros lo compramos y se lo enviamos a Guinea Ecuatorial"
            </div>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div className={styles.navCol}>
            <h4>Servicios</h4>
            <ul>
              <li>
                <button onClick={() => setActiveTab('tracking')}>Rastreador de Guía</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('calculator')}>Calculadora de Tarifas</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('personal-shopper')}>Compras en España (Personal Shopper)</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')}>Grupajes y Contenedores</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('warehouses')}>Sede Silla y Malabo/Bata</button>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto Oficial */}
          <div className={styles.contactCol}>
            <h4>Contacto Oficial</h4>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <MapPin size={18} />
                <span>Av. de la Séquia Real del Xúquer, 72, 46460 Silla, Valencia (España)</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={18} />
                <div>
                  <div>España: <a href="tel:+34661532115">+34 661 532 115</a></div>
                  <div>Guinea Ecuatorial: <a href="tel:+240222271440">+240 222 271 440</a></div>
                </div>
              </div>
              <div className={styles.contactItem}>
                <Mail size={18} />
                <a href="mailto:daniel.alonso@exportacionesguineval.com">
                  daniel.alonso@exportacionesguineval.com
                </a>
              </div>
              <div className={styles.contactItem}>
                <Clock size={18} />
                <span>Lunes a Viernes: 07:00 - 19:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior de Copyright */}
        <div className={styles.bottomBar}>
          <span>© {new Date().getFullYear()} Exportaciones Guineval S.L. Todos los derechos reservados.</span>
          <span>Plataforma Digital de Paquetería y Tracking, España ⇄ Guinea Ecuatorial</span>
        </div>
      </div>
    </footer>
  );
};
