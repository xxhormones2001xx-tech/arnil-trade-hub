// Shared brand styles for Arnil Etrade auth emails
export const brand = {
  main: { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' },
  container: {
    padding: '32px 28px',
    maxWidth: '560px',
    margin: '0 auto',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  },
  header: {
    borderBottom: '3px solid #0A2540',
    paddingBottom: '16px',
    marginBottom: '24px',
  },
  brandName: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    color: '#0A2540',
    margin: '0',
    letterSpacing: '0.5px',
  },
  brandTag: {
    fontSize: '11px',
    color: '#10B981',
    margin: '4px 0 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
    fontWeight: 'bold' as const,
  },
  h1: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    color: '#0A2540',
    margin: '0 0 20px',
  },
  text: {
    fontSize: '15px',
    color: '#374151',
    lineHeight: '1.6',
    margin: '0 0 20px',
  },
  link: { color: '#0A2540', textDecoration: 'underline' },
  button: {
    backgroundColor: '#0A2540',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 'bold' as const,
    borderRadius: '8px',
    padding: '14px 28px',
    textDecoration: 'none',
    display: 'inline-block',
  },
  code: {
    fontFamily: 'Courier, monospace',
    fontSize: '28px',
    fontWeight: 'bold' as const,
    color: '#0A2540',
    backgroundColor: '#f3f4f6',
    padding: '16px 24px',
    borderRadius: '8px',
    letterSpacing: '6px',
    textAlign: 'center' as const,
    margin: '0 0 30px',
  },
  divider: {
    borderTop: '1px solid #e5e7eb',
    margin: '30px 0 20px',
  },
  footer: {
    fontSize: '12px',
    color: '#6b7280',
    lineHeight: '1.5',
    margin: '20px 0 0',
    textAlign: 'center' as const,
  },
  footerBrand: {
    fontSize: '11px',
    color: '#9ca3af',
    margin: '8px 0 0',
    textAlign: 'center' as const,
  },
}

export const BRAND_NAME = 'ARNIL ETRADE'
export const BRAND_TAG = 'Trade • Invest • Grow'
