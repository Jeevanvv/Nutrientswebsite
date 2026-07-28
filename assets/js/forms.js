/**
 * forms.js — NutriNest Form Handling & WhatsApp Integration
 *
 * Captures form submission data, formats it into a clean structured message,
 * and opens WhatsApp pointing to +91 99457 56377.
 */

import { qsa, qs } from './utils.js';

const TARGET_WHATSAPP_NUMBER = '919945756377'; // +91 99457 56377

export function initForms() {
  qsa('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Helper to safely get field value by multiple potential field names
      const getVal = (...keys) => {
        for (const k of keys) {
          if (data[k] && String(data[k]).trim() !== '') return String(data[k]).trim();
        }
        return 'Not provided';
      };

      const name     = getVal('booking-name', 'name', 'magnet-1-name', 'magnet-2-name');
      const email    = getVal('booking-email', 'email', 'magnet-1-email', 'magnet-2-email');
      const phone    = getVal('booking-phone-or-whatsapp-number', 'phone', 'phone-number');
      const city     = getVal('booking-city-and-time-zone', 'city', 'location');
      const help     = getVal('booking-what-you-would-like-help-with', 'help-with', 'program');
      const time     = getVal('booking-preferred-consultation-time', 'preferred-time');
      const notes    = getVal('booking-anything-we-should-know-before-the-call', 'notes', 'message', 'comments');

      // Construct formatted text for WhatsApp
      let msgLines = [
        `*New Consultation Booking — NutriNest*`,
        ``,
        `👤 *Name:* ${name}`,
        `✉️ *Email:* ${email}`
      ];

      if (phone !== 'Not provided') msgLines.push(`📞 *Phone/WhatsApp:* ${phone}`);
      if (city !== 'Not provided')  msgLines.push(`📍 *City & Timezone:* ${city}`);
      if (help !== 'Not provided')  msgLines.push(`🎯 *Help Needed:* ${help}`);
      if (time !== 'Not provided')  msgLines.push(`⏰ *Preferred Time:* ${time}`);
      if (notes !== 'Not provided') msgLines.push(`📝 *Notes:* ${notes}`);

      msgLines.push(``);
      msgLines.push(`_Sent via nutrinest.in booking form_`);

      const fullMessage = msgLines.join('\n');
      const whatsappUrl = `https://wa.me/${TARGET_WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`;

      // Show in-form status message
      const note = qs('[data-form-note]', form);
      if (note) {
        note.textContent = '✓ Opening WhatsApp to send your booking details...';
        note.style.color = 'var(--leaf-ink)';
        note.style.fontWeight = '600';
      }

      // Update submit button
      const btn = qs('[type="submit"]', form);
      if (btn) {
        btn.textContent = 'Opening WhatsApp... ✓';
      }

      // Open WhatsApp in a new tab / app
      window.open(whatsappUrl, '_blank');
    });
  });
}
