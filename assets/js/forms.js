/**
 * forms.js — NutriNest Form Handling & WhatsApp Integration
 *
 * Captures form submission data, formats it into a clean structured message,
 * and opens WhatsApp pointing to +91 99457 56377.
 */

import { qsa, qs } from './utils.js';

const TARGET_WHATSAPP_NUMBER = '919945756377'; // +91 99457 56377

export function initForms() {
  // Initialize custom select components to prevent native select menu window overflow
  initCustomSelects();

  // Bind change listeners to selects to toggle "Something else" specify box
  qsa('select').forEach(select => {
    select.addEventListener('change', () => {
      const form = select.closest('form');
      const val  = (select.value || '').toLowerCase();
      const isElse = val.includes('something else') || val.includes('something-else') || val.includes('other');

      const wrap = select.closest('.field')?.parentElement?.querySelector('.field--something-else') ||
                   select.parentElement.querySelector('.field--something-else') ||
                   qs('#booking-something-else-wrap', form) ||
                   qs('.field--something-else', form);

      if (!wrap) return;

      if (isElse) {
        wrap.removeAttribute('hidden');
        const input = qs('input, textarea', wrap);
        if (input) input.focus();
      } else {
        wrap.setAttribute('hidden', '');
      }
    });
  });

  qsa('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const getVal = (...keys) => {
        for (const k of keys) {
          if (data[k] && String(data[k]).trim() !== '') return String(data[k]).trim();
        }
        return 'Not provided';
      };

      const name     = getVal('booking-name', 'name', 'magnet-1-name', 'magnet-2-name');
      const email    = getVal('booking-email', 'email', 'magnet-1-email', 'magnet-2-email');
      const phone    = getVal('booking-phone', 'booking-phone-or-whatsapp-number', 'phone', 'phone-number');
      const city     = getVal('booking-city', 'booking-city-and-time-zone', 'city', 'location');
      let help       = getVal('booking-help', 'booking-what-you-would-like-help-with', 'help-with', 'program');
      const elseText = getVal('booking-something-else-detail', 'something-else-detail');
      const time     = getVal('booking-time', 'booking-preferred-consultation-time', 'preferred-time');
      const notes    = getVal('booking-notes', 'booking-anything-we-should-know-before-the-call', 'notes', 'message', 'comments');

      if (help.toLowerCase().includes('something else') && elseText !== 'Not provided') {
        help = `Something else: "${elseText}"`;
      }

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

      const note = qs('[data-form-note]', form);
      if (note) {
        note.textContent = '✓ Opening WhatsApp to send your booking details...';
        note.style.color = 'var(--leaf-ink)';
        note.style.fontWeight = '600';
      }

      const btn = qs('[type="submit"]', form);
      if (btn) {
        btn.textContent = 'Opening WhatsApp... ✓';
      }

      window.open(whatsappUrl, '_blank');
    });
  });
}

/**
 * Custom Select Component Initializer
 * Replaces native <select> popups with bounded custom dropdown menus that
 * never overflow the window boundary and wrap long option text cleanly.
 */
function initCustomSelects() {
  qsa('.field select').forEach(select => {
    if (select.closest('.cselect-wrap')) return;

    const parent = select.parentElement;
    const wrap = document.createElement('div');
    wrap.className = 'cselect-wrap';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'cselect__trigger';
    trigger.setAttribute('aria-expanded', 'false');

    const label = document.createElement('span');
    label.className = 'cselect__label';
    const activeOpt = select.options[select.selectedIndex] || select.options[0];
    label.textContent = activeOpt ? activeOpt.textContent : '';

    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrow.setAttribute('class', 'cselect__arrow');
    arrow.setAttribute('viewBox', '0 0 24 24');
    arrow.setAttribute('fill', 'none');
    arrow.setAttribute('stroke', 'currentColor');
    arrow.setAttribute('stroke-width', '2.2');
    arrow.setAttribute('stroke-linecap', 'round');
    arrow.setAttribute('stroke-linejoin', 'round');
    arrow.innerHTML = '<path d="m6 9 6 6 6-6"/>';

    trigger.appendChild(label);
    trigger.appendChild(arrow);

    const menu = document.createElement('div');
    menu.className = 'cselect__menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;

    Array.from(select.options).forEach((opt, idx) => {
      const optionEl = document.createElement('div');
      optionEl.className = `cselect__option${idx === select.selectedIndex ? ' is-selected' : ''}`;
      optionEl.setAttribute('role', 'option');
      optionEl.dataset.value = opt.value;
      optionEl.textContent = opt.textContent;

      optionEl.addEventListener('click', (e) => {
        e.stopPropagation();
        select.selectedIndex = idx;
        label.textContent = opt.textContent;
        qsa('.cselect__option', menu).forEach(o => o.classList.remove('is-selected'));
        optionEl.classList.add('is-selected');

        closeMenu();

        // Dispatch native change event
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });

      menu.appendChild(optionEl);
    });

    function openMenu() {
      qsa('.cselect-wrap.is-open').forEach(other => {
        if (other !== wrap) {
          other.classList.remove('is-open');
          const m = qs('.cselect__menu', other);
          const t = qs('.cselect__trigger', other);
          if (m) m.hidden = true;
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });

      wrap.classList.add('is-open');
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      wrap.classList.remove('is-open');
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menu.hidden) openMenu();
      else closeMenu();
    });

    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) {
        closeMenu();
      }
    });

    parent.insertBefore(wrap, select);
    wrap.appendChild(trigger);
    wrap.appendChild(menu);
    wrap.appendChild(select);
  });
}
