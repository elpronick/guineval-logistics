import React from 'react';
import { Ship, Plane, Box, Truck, ShieldAlert, Wrench, Home, Layers } from 'lucide-react';
import styles from './ServicesSection.module.scss';

export const ServicesSection: React.FC = () => {
  const coreServices = [
    {
      icon: Ship,
      title: 'Contenedores Completos (FCL)',
      description: 'Gestión y transporte de contenedores marítimos exclusivos de 20 y 40 pies directos hacia los puertos de Malabo y Bata.',
    },
    {
      icon: Box,
      title: 'Grupajes Marítimos (LCL)',
      description: 'Consolidación de cajas, palets y bultos en contenedores compartidos. La tarifa más económica por metro cúbico.',
    },
    {
      icon: Plane,
      title: 'Charteamos Vuelos y Carga Aérea',
      description: 'Vuelos de línea regular semanales y fletamento de aviones chárter para envíos urgentes, perecederos o de alto valor.',
    },
    {
      icon: Truck,
      title: 'Servicio Puerta a Puerta',
      description: 'Recogida de mercancía en cualquier punto de España, despacho aduanero integral y entrega en domicilio o almacén en Guinea.',
    },
  ];

  const specialties = [
    { name: 'Mercancías Peligrosas (ADR)', icon: ShieldAlert },
    { name: 'Maquinaria de Gran Tonelaje', icon: Wrench },
    { name: 'Mercancías Muy Voluminosas', icon: Box },
    { name: 'Vehículos, Furgonetas y Camiones', icon: Truck },
    { name: 'Mobiliario y Electrodomésticos', icon: Home },
    { name: 'Baldosas y Material de Construcción', icon: Layers },
  ];

  return (
    <section id="services" className="section-padding">
      <div className="container">
        {/* Cabecera */}
        <div className={styles.servicesHeader}>
          <span className="badge badge-gold">Soluciones Logísticas Integrales</span>
          <h2>Logística | Transporte | Aduanas</h2>
          <p>
            Conectamos España con Guinea Ecuatorial mediante líneas regulares aéreas y marítimas con total cobertura aduanera.
          </p>
        </div>

        {/* 4 Servicios Principales */}
        <div className={styles.coreGrid}>
          {coreServices.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div key={idx} className={styles.coreCard}>
                <div>
                  <div className={styles.iconCircle}>
                    <Icon size={26} />
                  </div>
                  <h3>{srv.title}</h3>
                  <p>{srv.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Especialidades de Carga */}
        <div className={styles.specialtiesSection}>
          <div className={styles.specialtiesHeader}>
            <span className="badge badge-gold">Alta Capacidad Técnica</span>
            <h3>Especialistas En</h3>
            <p>Gestionamos cargas complejas que otras agencias no pueden transportar.</p>
          </div>

          <div className={styles.specialtiesGrid}>
            {specialties.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={styles.specialtyItem}>
                  <div className={styles.bullet}></div>
                  <Icon size={18} color="#f5a623" />
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
