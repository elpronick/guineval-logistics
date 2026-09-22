import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'EUR' | 'XAF';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  formatPrice: (eurAmount: number) => string;
  eurToXafRate: number;
}

const EUR_TO_XAF_RATE = 655.9570; // Paridad oficial Banco de los Estados de África Central (BEAC)

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('guineval_currency');
    return (saved === 'EUR' || saved === 'XAF') ? saved : 'EUR';
  });

  useEffect(() => {
    localStorage.setItem('guineval_currency', currency);
  }, [currency]);

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'EUR' ? 'XAF' : 'EUR'));
  };

  /**
   * Formatea un importe en euros a la divisa activa (EUR o Francos CFA)
   */
  const formatPrice = (eurAmount: number): string => {
    if (currency === 'EUR') {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 2,
      }).format(eurAmount);
    } else {
      const xafAmount = Math.round(eurAmount * EUR_TO_XAF_RATE);
      return `${new Intl.NumberFormat('es-ES').format(xafAmount)} XAF`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        formatPrice,
        eurToXafRate: EUR_TO_XAF_RATE,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency debe usarse dentro de un CurrencyProvider');
  }
  return context;
};
