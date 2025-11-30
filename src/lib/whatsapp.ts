import { Scheme, LeadFormData } from '../types';

/**
 * Generate WhatsApp message from scheme template and form data
 */
export function generateWhatsAppMessage(scheme: Scheme, formData: LeadFormData): string {
  let message = scheme.whatsappTemplate;

  // Replace placeholders with actual values
  Object.entries(formData).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    let displayValue: string;

    if (typeof value === 'boolean') {
      displayValue = value ? 'ಹೌದು/Yes' : 'ಇಲ್ಲ/No';
    } else {
      // For select fields, try to find the display label
      const field = scheme.fields.find((f) => f.id === key);
      if (field?.options) {
        const option = field.options.find((o) => o.value === value);
        if (option) {
          displayValue = `${option.label.kn} / ${option.label.en}`;
        } else {
          displayValue = String(value);
        }
      } else {
        displayValue = String(value);
      }
    }

    message = message.replace(placeholder, displayValue);
  });

  return message;
}

/**
 * Open WhatsApp with pre-filled message
 */
export function openWhatsApp(message: string, whatsappNumber?: string): void {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;

  // Open in new tab/window
  window.open(whatsappUrl, '_blank');
}

/**
 * Combined function to generate message and open WhatsApp
 */
export function sendToWhatsApp(scheme: Scheme, formData: LeadFormData, whatsappNumber?: string): void {
  const message = generateWhatsAppMessage(scheme, formData);
  openWhatsApp(message, whatsappNumber);
}
