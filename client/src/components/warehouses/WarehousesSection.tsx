import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, Copy, Check } from 'lucide-react';
import styles from './WarehousesSection.module.scss';

export const WarehousesSection: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText('Av. de la Séquia Real del Xúquer, 72, 46460 Silla, Valencia, España');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const warehouses = [
    {
      code: 'VLC',
      name: 'Sede Central Guineval España',
      role: 'Hub de Origen & Carga',
      city: 'Valencia (Silla)',
      country: 'España',
      address: 'Av. de la Séquia Real del Xúquer, 72, 46460 Silla, Valencia',
      phone: '+34 661 532 115',
      whatsapp: 'https://wa.me/34661532115',
      hours: 'Lunes a Viernes: 07:00 - 19:00',
      isOrigin: true,
    },
    {
      code: 'SSG',
      name: 'Centro Logístico Malabo',
      role: 'Sede Principal de Entrega',
      city: 'Malabo (Isla de Bioko)',
      country: 'Guinea Ecuatorial',
      address: 'Carretera del Aeropuerto s/n, Barrio Ela Nguema, Malabo',
      phone: '+240 222 271 440',
      whatsapp: 'https://wa.me/240222271440',
      hours: 'Lunes a Sábado: 08:00 - 18:00',
      isOrigin: false,
    },
    {
      code: 'BSG',
      name: 'Centro de Distribución Bata',
      role: 'Sede Continental Litoral',
      city: 'Bata (Región Continental)',
      country: 'Guinea Ecuatorial',
      address: 'Avenida de la Libertad, Zona Puerto, Bata',
      phone: '+240 222 271 440',
      whatsapp: 'https://wa.me/240222271440',
      hours: 'Lunes a Sábado: 08:00 - 18:00',
      isOrigin: false,
    },
  ];

  return (
    <section id="warehouses" className="section-padding">
      <div className="container">
        {/* Cabecera */}
        <div className={styles.header}>
          <span className="badge badge-gold">Infraestructura Propia</span>
          <h2>Nuestras Sedes y Puntos de Distribución</h2>
          <p>
            Almacenes físicos equipados con muelle de carga, báscula homologada y custodia segura en España y Guinea Ecuatorial.
          </p>
        </div>

        {/* 3 Tarjetas de Sedes */}
        <div className={styles.warehousesGrid}>
          {warehouses.map((wh) => (
            <div
              key={wh.code}
              className={`${styles.warehouseCard} ${wh.isOrigin ? styles.originCard : ''}`}
            >
              <div className={styles.cardTop}>
                <div className={styles.badgeRow}>
                  <span className={wh.isOrigin ? 'badge badge-gold' : 'badge badge-air'}>
                    {wh.role}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#94a3b8' }}>
                    #{wh.code}
                  </span>
                </div>

                <h3>{wh.name}</h3>
                <div className={styles.citySub}>{wh.city}</div>

                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <MapPin size={18} />
                    <span>{wh.address}</span>
                  </div>

                  <div className={styles.infoItem}>
                    <Phone size={18} />
                    <a href={`tel:${wh.phone.replace(/\s+/g, '')}`}>{wh.phone}</a>
                  </div>

                  <div className={styles.infoItem}>
                    <Clock size={18} />
                    <span>{wh.hours}</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardActions}>
                <a
                  href={wh.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: '100%' }}
                >
                  <MessageCircle size={16} />
                  <span>Contactar con esta Sede</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Módulo de Casillero Virtual / Dirección en España */}
        <div className={styles.casilleroBox}>
          <div className={styles.casilleroInfo}>
            <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
              Casillero Virtual Gratuito
            </span>
            <h3>¿Compras tú mismo en Amazon, Inditex o tiendas online?</h3>
            <p>
              Usa la dirección de nuestra nave en Silla (Valencia) como tu dirección de entrega en España. Cuando llegue tu paquete, lo recepcionamos, verificamos y lo enviamos en la siguiente expedición a Malabo o Bata.
            </p>
          </div>

          <div>
            <button type="button" onClick={copyAddress} className="btn btn-gold">
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? '¡Dirección Copiada!' : 'Copiar Dirección para Envíos'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
