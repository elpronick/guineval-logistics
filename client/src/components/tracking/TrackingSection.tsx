import React, { useState, useEffect } from 'react';
import { Search, Plane, Ship, CheckCircle2, Clock, MapPin, MessageCircle, AlertCircle } from 'lucide-react';
import { ApiService } from '@/services/api';
import type { Shipment, TrackingEvent } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import styles from './TrackingSection.module.scss';

export const TrackingSection: React.FC = () => {
  const [trackingCode, setTrackingCode] = useState('GNV-ES-2026-001');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { formatPrice } = useCurrency();

  // Buscar automáticamente el envío inicial al montar
  useEffect(() => {
    handleSearch('GNV-ES-2026-001');
  }, []);

  const handleSearch = async (codeToSearch?: string) => {
    const code = (codeToSearch || trackingCode).trim();
    if (!code) return;

    setLoading(true);
    setError(null);

    try {
      const data = await ApiService.getTracking(code);
      setShipment(data);
      setTrackingCode(code);
    } catch (err: any) {
      setError(err.message || 'No se pudo localizar el envío');
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT':
        return <span className="badge badge-gold">En Tránsito Internacional</span>;
      case 'RECEIVED_ORIGIN':
        return <span className="badge badge-air">Recibido en Almacén Valencia</span>;
      case 'READY_FOR_PICKUP':
        return <span className="badge badge-success">Listo para Recoger</span>;
      case 'CUSTOMS_HOLD':
        return <span className="badge badge-warning">En Trámite Aduanero</span>;
      case 'DELIVERED':
        return <span className="badge badge-success">Entregado</span>;
      default:
        return <span className="badge badge-gold">{status}</span>;
    }
  };

  return (
    <section id="tracking" className="section-padding">
      <div className="container">
        {/* Cabecera Hero */}
        <div className={styles.hero}>
          <div className={styles.badgeTop}>
            <span>Rastreo Oficial 24/7</span>
          </div>
          <h1>
            Sigue tu Envío en <span>Tiempo Real</span>
          </h1>
          <p>
            Rastrea paquetes aéreos y contenedores marítimos desde nuestra <strong>Sede Central en Valencia (Silla)</strong> hasta <strong>Malabo</strong> y <strong>Bata</strong>.
          </p>

          {/* Buscador de Tracking */}
          <form
            className={styles.searchBox}
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <Search className={styles.searchIcon} size={22} />
            <input
              type="text"
              placeholder="Introduce tu código (ej: GNV-ES-2026-001)"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
            />
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Buscando...' : 'Rastrear Guía'}
            </button>
          </form>

          {/* Códigos de Prueba Rápidos */}
          <div className={styles.quickExamples}>
            <span>Probar envíos reales de ejemplo:</span>
            <button type="button" onClick={() => handleSearch('GNV-ES-2026-001')}>
              GNV-ES-2026-001 (Aéreo a Malabo)
            </button>
            <span>•</span>
            <button type="button" onClick={() => handleSearch('GNV-ES-2026-002')}>
              GNV-ES-2026-002 (Marítimo a Bata)
            </button>
            <span>•</span>
            <button type="button" onClick={() => handleSearch('GNV-ES-2026-003')}>
              GNV-ES-2026-003 (Listo en Mostrador)
            </button>
          </div>
        </div>

        {/* Mensaje de Error si no se encuentra */}
        {error && (
          <div
            style={{
              maxWidth: '650px',
              margin: '2rem auto',
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Tarjeta de Detalle del Envío y Línea de Tiempo */}
        {shipment && (
          <div className={styles.resultCard}>
            <div className={styles.cardHeader}>
              <div className={styles.trackingMeta}>
                <div className={styles.label}>Número de Guía Oficial</div>
                <div className={styles.code}>{shipment.tracking_number}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {getStatusBadge(shipment.current_status)}
                {shipment.service_type.startsWith('AIR') ? (
                  <span className="badge badge-air">
                    <Plane size={12} /> Aéreo Express
                  </span>
                ) : (
                  <span className="badge badge-sea">
                    <Ship size={12} /> Carga Marítima
                  </span>
                )}
              </div>
            </div>

            {/* Visualizador de Ruta Valencia -> Malabo/Bata */}
            <div className={styles.routeVisual}>
              <div className={styles.routePoint}>
                <span className={styles.pointType}>Origen (España)</span>
                <span className={styles.pointName}>{shipment.origin_name || 'Valencia (Silla)'}</span>
                <span className={styles.pointSub}>Av. Séquia Real del Xúquer, 72</span>
              </div>

              <div className={styles.routeConnector}>
                <div className={styles.iconMode}>
                  {shipment.service_type.startsWith('AIR') ? <Plane size={24} /> : <Ship size={24} />}
                </div>
                <div className={styles.line}></div>
              </div>

              <div className={styles.routePoint} style={{ textAlign: 'right' }}>
                <span className={styles.pointType}>Destino (Guinea Ecuatorial)</span>
                <span className={styles.pointName}>
                  {shipment.destination_name || `Sede ${shipment.recipient_city}`}
                </span>
                <span className={styles.pointSub}>Entrega en mostrador / reparto</span>
              </div>
            </div>

            {/* Métricas y Datos del Paquete */}
            <div className={styles.detailsGrid}>
              <div className={styles.detailBox}>
                <div className={styles.detailLabel}>Destinatario</div>
                <div className={styles.detailVal}>{shipment.recipient_name}</div>
              </div>
              <div className={styles.detailBox}>
                <div className={styles.detailLabel}>Peso / Medidas</div>
                <div className={styles.detailVal}>{shipment.weight_kg} kg ({shipment.length_cm}x{shipment.width_cm}x{shipment.height_cm} cm)</div>
              </div>
              <div className={styles.detailBox}>
                <div className={styles.detailLabel}>Fecha Estimada</div>
                <div className={styles.detailVal} style={{ color: '#f5a623' }}>
                  {shipment.estimated_delivery_date || 'En tránsito'}
                </div>
              </div>
              <div className={styles.detailBox}>
                <div className={styles.detailLabel}>Importe Envío</div>
                <div className={styles.detailVal}>{formatPrice(shipment.cost_eur)}</div>
              </div>
            </div>

            {/* Línea de Tiempo Cronológica de Eventos */}
            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.25rem' }}>
              Historial de Tránsito y Actualizaciones
            </h3>

            <div className={styles.timeline}>
              {shipment.timeline && shipment.timeline.length > 0 ? (
                shipment.timeline.map((event: TrackingEvent, idx: number) => (
                  <div key={event.id || idx} className={styles.timelineItem}>
                    <div className={`${styles.dot} ${idx === shipment.timeline!.length - 1 ? styles.completed : ''}`}>
                      <CheckCircle2 size={16} />
                    </div>
                    <div className={styles.eventContent}>
                      <div className={styles.eventHeader}>
                        <span className={styles.eventStatus}>{event.status.replace(/_/g, ' ')}</span>
                        <span className={styles.eventTime}>
                          <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {new Date(event.event_timestamp).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className={styles.eventLoc}>
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                      <div className={styles.eventDesc}>{event.description}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#94a3b8' }}>No hay eventos registrados aún para este paquete.</p>
              )}
            </div>

            {/* Botón Consultar por WhatsApp */}
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <a
                href={`https://wa.me/34661532115?text=${encodeURIComponent(
                  `Hola Guineval, deseo consultar el estado de mi envío con número de guía: ${shipment.tracking_number}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <MessageCircle size={18} />
                <span>Consultar incidencia o recogida por WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
