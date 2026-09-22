import React, { useState, useEffect } from 'react';
import { Plane, Ship, MessageCircle, ArrowRight } from 'lucide-react';
import { ApiService } from '@/services/api';
import type { QuoteCalculationResult, QuoteOption } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import styles from './CalculatorSection.module.scss';

export const CalculatorSection: React.FC = () => {
  const [destinationCity, setDestinationCity] = useState<'Malabo' | 'Bata'>('Malabo');
  const [cargoCategory, setCargoCategory] = useState('GENERAL');
  const [weightKg, setWeightKg] = useState<number>(5.0);
  const [lengthCm, setLengthCm] = useState<number>(35);
  const [widthCm, setWidthCm] = useState<number>(25);
  const [heightCm, setHeightCm] = useState<number>(20);

  const [quoteResult, setQuoteResult] = useState<QuoteCalculationResult | null>(null);
  const { formatPrice } = useCurrency();

  // Calcular cotización al cambiar cualquier campo
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const result = await ApiService.calculateQuote({
          destination_city: destinationCity,
          cargo_category: cargoCategory,
          weight_kg: Number(weightKg) || 1,
          length_cm: Number(lengthCm) || 10,
          width_cm: Number(widthCm) || 10,
          height_cm: Number(heightCm) || 10,
        });
        setQuoteResult(result);
      } catch (err) {
        console.error('Error calculando cotización:', err);
      }
    };

    fetchQuote();
  }, [destinationCity, cargoCategory, weightKg, lengthCm, widthCm, heightCm]);

  return (
    <section id="calculator" className="section-padding">
      <div className="container">
        <div className={styles.calculatorContainer}>
          {/* Cabecera */}
          <div className={styles.header}>
            <span className="badge badge-gold">Cotizador Inteligente</span>
            <h2>Calcula el Coste de tu Envío</h2>
            <p>
              Tarifas oficiales transparentes desde nuestra sede en <strong>Silla (Valencia)</strong> hacia <strong>Malabo</strong> y <strong>Bata</strong>.
            </p>
          </div>

          <div className={styles.calculatorCard}>
            {/* Formulario de Medidas */}
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Ciudad de Destino en Guinea Ecuatorial</label>
                <select
                  className="form-select"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value as 'Malabo' | 'Bata')}
                >
                  <option value="Malabo">Malabo (Isla de Bioko) - Centro Logístico</option>
                  <option value="Bata">Bata (Litoral Continental) - Centro de Distribución</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo / Categoría de Mercancía</label>
                <select
                  className="form-select"
                  value={cargoCategory}
                  onChange={(e) => setCargoCategory(e.target.value)}
                >
                  <option value="GENERAL">Paquetería y Compras Online Estándar</option>
                  <option value="FURNITURE_APPLIANCES">Mobiliario y Electrodomésticos</option>
                  <option value="CONSTRUCTION_MATERIALS">Baldosas y Material de Construcción</option>
                  <option value="VEHICLES_CARS">Vehículos y Camiones</option>
                  <option value="HEAVY_MACHINERY">Maquinaria de Gran Tonelaje</option>
                  <option value="HAZARDOUS_ADR">Mercancías Peligrosas (ADR)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Peso Real en Báscula (kg)</label>
                <div className="input-suffix">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    className="form-input"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  />
                  <span className="suffix-label">kg</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Dimensiones del Bulto (Largo x Ancho x Alto en cm)</label>
                <div className={styles.dimensionsGrid}>
                  <div className="input-suffix">
                    <input
                      type="number"
                      min="5"
                      placeholder="Largo"
                      className="form-input"
                      value={lengthCm}
                      onChange={(e) => setLengthCm(parseFloat(e.target.value) || 0)}
                    />
                    <span className="suffix-label">L</span>
                  </div>
                  <div className="input-suffix">
                    <input
                      type="number"
                      min="5"
                      placeholder="Ancho"
                      className="form-input"
                      value={widthCm}
                      onChange={(e) => setWidthCm(parseFloat(e.target.value) || 0)}
                    />
                    <span className="suffix-label">A</span>
                  </div>
                  <div className="input-suffix">
                    <input
                      type="number"
                      min="5"
                      placeholder="Alto"
                      className="form-input"
                      value={heightCm}
                      onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                    />
                    <span className="suffix-label">H</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Métricas Volumétricas en Tiempo Real */}
            {quoteResult && (
              <div className={styles.volumetricMetrics}>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Peso Volumétrico IATA</span>
                  <span className={styles.metricVal}>
                    {quoteResult.weights.volumetric_weight_kg} kg
                  </span>
                  <span className={styles.metricSub}>(Largo x Ancho x Alto) / 5000</span>
                </div>

                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Volumen Marítimo</span>
                  <span className={styles.metricVal}>
                    {quoteResult.dimensions.volume_m3} m³
                  </span>
                  <span className={styles.metricSub}>Para contenedor compartido</span>
                </div>

                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Peso Facturable Aéreo</span>
                  <span className={styles.metricVal} style={{ color: '#f5a623' }}>
                    {quoteResult.weights.chargeable_air_weight_kg} kg
                  </span>
                  <span className={styles.metricSub}>Mayor entre báscula y volumen</span>
                </div>
              </div>
            )}

            {/* Opciones Comparativas de Tarifas */}
            {quoteResult && (
              <div className={styles.optionsGrid}>
                {quoteResult.options.map((option: QuoteOption, idx: number) => (
                  <div
                    key={idx}
                    className={`${styles.optionCard} ${option.recommended ? styles.recommended : ''}`}
                  >
                    {option.recommended && (
                      <div className={styles.recommendedTag}>Recomendado</div>
                    )}

                    <div>
                      <div className={styles.optionHeader}>
                        <div className={styles.iconWrap}>
                          {option.service_type.startsWith('AIR') ? (
                            <Plane size={24} />
                          ) : (
                            <Ship size={24} />
                          )}
                        </div>
                        <div>
                          <h4>{option.title}</h4>
                          <span className={styles.days}>⏱ {option.estimated_days}</span>
                        </div>
                      </div>

                      <p className={styles.optionDesc}>{option.description}</p>
                      
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        Base de cálculo: <strong>{option.chargeable_measure}</strong> + Despacho ({option.handling_fee_eur} €)
                      </div>
                    </div>

                    <div>
                      <div className={styles.pricingRow}>
                        <span className={styles.priceLabel}>Precio Estimado:</span>
                        <div className={styles.priceAmount}>
                          <div className={styles.eur}>{formatPrice(option.total_eur)}</div>
                          <div className={styles.xaf}>
                            {Math.round(option.total_eur * quoteResult.exchange_rate_xaf).toLocaleString()} XAF
                          </div>
                        </div>
                      </div>

                      <a
                        href={quoteResult.whatsapp_links.spain}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-gold"
                        style={{ width: '100%', marginTop: '1.25rem' }}
                      >
                        <span>Reservar esta Opción</span>
                        <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botón Central Enviar Cotización Completa por WhatsApp */}
            {quoteResult && (
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <a
                  href={quoteResult.whatsapp_links.spain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}
                >
                  <MessageCircle size={20} />
                  <span>Enviar Cotización Completa a WhatsApp España (+34 661 532 115)</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
