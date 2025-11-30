import { IssueFormData } from './issueApi';
import { getCategoryName } from '../data/issueCategories';

export function sendIssueToWhatsApp(data: IssueFormData, whatsappNumber?: string): void {
  const number = whatsappNumber || '919876543210';
  const categoryName =
    data.category === 'other' && data.customCategory
      ? data.customCategory
      : getCategoryName(data.category, 'en');

  let message = `🚨 *Issue Report*

*Name:* ${data.name}
*Mobile:* ${data.mobile}
*Category:* ${categoryName}
*Location:* ${data.locationText}`;

  if (data.latitude && data.longitude) {
    message += `
*GPS:* ${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}
*Map:* https://maps.google.com/?q=${data.latitude},${data.longitude}`;
  }

  message += `

*Description:*
${data.description}`;

  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}
