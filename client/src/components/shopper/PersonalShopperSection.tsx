import React, { useState } from 'react';
import { MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import { ApiService } from '@/services/api';
import { useCurrency } from '@/context/CurrencyContext';
import styles from './PersonalShopperSection.module.scss';

export const PersonalShopperSection: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [destinationCity, setDestinationCity] = useState<'Malabo' | 'Bata'>('Malabo');
  const [itemName, setItemName] = useState('');
  const [storeName, setStoreName] = useState('Amazon España');
  const [productUrl, setProductUrl] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(80);
  const [shippingType, setShippingType] = useState('AIR_REGULAR');

  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);

  const { formatPrice, eurToXafRate } = useCurrency();

  // Cálculo en tiempo real: Importe + 10% comisión + estimación de envío
  const itemTotal = (estimatedPrice || 0) * (quantity || 1);
  const commission = Math.max(itemTotal * 0.10, 5.00);
  const shippingEstimate = shippingType.startsWith('AIR') ? 25.00 : 50.00;
  const totalEstimatedEur = Number((itemTotal + commission + shippingEstimate).toFixed(2));
  const totalEstimatedXaf = Math.round(totalEstimatedEur * eurToXafRate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !itemName) {
      alert('Por favor complete su nombre, teléfono y producto deseado.');
      return;
    }

    setLoading(true);
    try {
      const res = await ApiService.requestPurchase({
        customer_name: customerName,
        customer_phone: customerPhone,
        destination_city: destinationCity,
        item_name: itemName,
        store_name: storeName,
        product_url: productUrl,
        specifications,
        quantity,
        estimated_item_price_eur: estimatedPrice,
        preferred_shipping: shippingType,
      });

      setCreatedOrder(res);
      // Abrir automáticamente WhatsApp con la solicitud generada
      window.open(res.whatsapp_url, '_blank');
    } catch (err: any) {
      alert('Error al enviar solicitud: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="personal-shopper" className="section-padding">
      <div className="container">
        <div className={styles.shopperContainer}>
          {/* Banner Oficial con Lema de Exportaciones Guineval */}
          <div className={styles.banner}>
            <div className={styles.bannerQuote}>
              ★ "Elija lo que quiera por internet y nosotros lo compramos y se lo enviamos a Guinea Ecuatorial"
            </div>
            <p>
              Compre en tiendas españolas (Amazon, Zara, El Corte Inglés, recambios de coche, farmacia o informática) sin necesidad de tarjeta bancaria internacional ni trámites complejos.
            </p>
          </div>

          {/* 4 Pasos del Proceso */}
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>01</div>
              <h4>Elige tu Producto</h4>
              <p>Busca lo que necesitas en cualquier tienda online española o describe el recambio/artículo.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>02</div>
              <h4>Pega el Enlace</h4>
              <p>Indica la URL, modelo, talla y cantidad en este formulario para generar tu pre-orden.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>03</div>
              <h4>Guineval lo Compra</h4>
              <p>Nuestro equipo en Silla (Valencia) adquiere la mercancía, la inspecciona y la embala.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>04</div>
              <h4>Recíbelo en Malabo o Bata</h4>
              <p>Embarcamos tu compra por avión o barco y te avisamos por WhatsApp para su retirada.</p>
            </div>
          </div>

          {/* Formulario de Compra Asistida */}
          <div className={styles.formCard}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="badge badge-gold">
                <Sparkles size={12} /> Servicio Personal Shopper
              </span>
              <h2 style={{ marginTop: '0.5rem' }}>Solicitud de Compra en España</h2>
              <p style={{ color: '#94a3b8' }}>
                Rellena los datos del artículo y te responderemos de inmediato por WhatsApp con el presupuesto exacto.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Tu Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Esteban Nguema"
                    className="form-input"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Teléfono de Contacto / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: +240 222 334 455 o +34 600..."
                    className="form-input"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ciudad de Entrega</label>
                  <select
                    className="form-select"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value as 'Malabo' | 'Bata')}
                  >
                    <option value="Malabo">Malabo (Isla de Bioko)</option>
                    <option value="Bata">Bata (Litoral Continental)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tienda donde se encuentra</label>
                  <input
                    type="text"
                    placeholder="Ej: Amazon, Inditex/Zara, Oscaro, Farmacia..."
                    className="form-input"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Nombre del Artículo o Producto</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Zapatillas Nike Air Max 270 o Repuesto Bomba Inyectora Diésel"
                    className="form-input"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Enlace / URL del producto (Opcional si es físico)</label>
                  <div className="input-with-icon">
                    <ExternalLink size={18} className="input-icon" />
                    <input
                      type="url"
                      placeholder="https://www.amazon.es/dp/..."
                      className="form-input"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Precio Estimado en Tienda (€)</label>
                  <div className="input-suffix">
                    <input
                      type="number"
                      step="1"
                      min="1"
                      className="form-input"
                      value={estimatedPrice}
                      onChange={(e) => setEstimatedPrice(parseFloat(e.target.value) || 0)}
                    />
                    <span className="suffix-label">€</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Modalidad de Transporte Preferida</label>
                  <select
                    className="form-select"
                    value={shippingType}
                    onChange={(e) => setShippingType(e.target.value)}
                  >
                    <option value="AIR_REGULAR">Aéreo Regular (3 - 5 días)</option>
                    <option value="SEA_GROUPAGE">Marítimo Grupaje (20 - 28 días)</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Especificaciones (Talla, Color, Referencia de pieza)</label>
                  <textarea
                    rows={3}
                    placeholder="Detalla cualquier información importante para asegurarnos de comprar exactamente lo que buscas..."
                    className="form-textarea"
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                  />
                </div>
              </div>

              {/* Resumen Económico del Presupuesto */}
              <div className={styles.budgetBox}>
                <div className={styles.budgetText}>
                  <div className={styles.budgetLabel}>Presupuesto Estimado Total</div>
                  <div className={styles.budgetAmounts}>
                    <span className={styles.eur}>{formatPrice(totalEstimatedEur)}</span>
                    <span className={styles.xaf}>({totalEstimatedXaf.toLocaleString()} XAF)</span>
                  </div>
                  <div className={styles.note}>
                    Incluye compra del producto ({itemTotal} €) + Comisión de gestión 10% ({commission} €) + Envío estimado ({shippingEstimate} €).
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-whatsapp"
                  style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}
                >
                  <MessageCircle size={20} />
                  <span>{loading ? 'Procesando...' : 'Enviar Solicitud por WhatsApp'}</span>
                </button>
              </div>
            </form>

            {/* Confirmación si se generó la orden */}
            {createdOrder && (
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div>
                  <strong>¡Solicitud generada con éxito! Código: {createdOrder.request.request_code}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Si no se abrió WhatsApp automáticamente, haz clic en el botón a la derecha.
                  </div>
                </div>
                <a
                  href={createdOrder.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Abrir WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
