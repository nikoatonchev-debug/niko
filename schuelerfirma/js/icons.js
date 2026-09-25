/* Kleine Inline-SVG-Icons, damit die Seite auch ohne eigene Bilder schon
 * fertig aussieht. Sobald echte Fotos/Logos da sind, können die
 * product-image-Boxen und der Header-Logo-Platzhalter einfach ersetzt werden. */

const SFIcons = {
  logo: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#e0632c"/>
    <path d="M15 18c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6v2l4 3-2 4-3-1v11a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V26l-3 1-2-4 4-3v-2z" fill="#faf5ea"/>
    <circle cx="24" cy="19" r="3.2" fill="#e0632c"/>
  </svg>`,

  hoodie: (color) => `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 8c-6 2-16 8-18 20l10 8 4-8v54a4 4 0 0 0 4 4h40a4 4 0 0 0 4-4V28l4 8 10-8C86 16 76 10 70 8l-8 8H38l-8-8z" fill="${color}"/>
    <path d="M38 8l6 10h12l6-10" stroke="#faf5ea" stroke-width="2" fill="none"/>
    <circle cx="50" cy="46" r="10" fill="#faf5ea" opacity="0.85"/>
    <path d="M45 46l3.5 3.5L56 42" stroke="${color}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  pin: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" fill="currentColor"/>
    <circle cx="12" cy="9" r="2.5" fill="#fff"/>
  </svg>`,

  cash: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="12" rx="2" fill="currentColor"/>
    <circle cx="12" cy="12" r="3.2" fill="#fff"/>
  </svg>`,

  clock: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="currentColor"/>
    <path d="M12 7v5l3.5 2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>`,

  print: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="3" width="16" height="7" rx="1.5" fill="currentColor"/>
    <rect x="4" y="14" width="16" height="7" rx="1.5" fill="currentColor" opacity="0.5"/>
    <rect x="2" y="9" width="20" height="6" rx="1.5" fill="currentColor"/>
  </svg>`,

  team: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="9" r="3.2" fill="currentColor"/>
    <circle cx="17" cy="9" r="2.6" fill="currentColor" opacity="0.6"/>
    <path d="M2 20c0-3.6 2.9-6.3 6-6.3s6 2.7 6 6.3" fill="currentColor"/>
    <path d="M13.5 14.2c2.6.3 4.5 2.6 4.5 5.8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
  </svg>`,

  cart: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 4h2l2.6 12.4A2 2 0 0 0 9.5 18H18a2 2 0 0 0 2-1.6L21.5 8H6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="10" cy="21" r="1.6" fill="currentColor"/>
    <circle cx="18" cy="21" r="1.6" fill="currentColor"/>
  </svg>`,

  gear: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" stroke-width="1.6" fill="none"/>
    <path d="M19.4 13a7.4 7.4 0 0 0 0-2l2-1.5-2-3.4-2.3.9a7.6 7.6 0 0 0-1.7-1l-.3-2.5H10.9l-.3 2.5a7.6 7.6 0 0 0-1.7 1l-2.3-.9-2 3.4L6.6 11a7.4 7.4 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9c.5.4 1.1.75 1.7 1l.3 2.5h3.2l.3-2.5a7.6 7.6 0 0 0 1.7-1l2.3.9 2-3.4-2-1.5z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/>
  </svg>`,

  lock: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="16" height="10" rx="2" fill="currentColor"/>
    <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" stroke-width="2" fill="none"/>
    <circle cx="12" cy="15" r="1.6" fill="#fff"/>
  </svg>`,

  sprout: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21V11" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M12 12c0-4 3-6 8-6 0 5-3 7-8 6z" fill="currentColor"/>
    <path d="M12 15c0-3.2-2.4-4.8-6.4-4.8 0 4 2.4 5.6 6.4 4.8z" fill="currentColor" opacity="0.65"/>
  </svg>`,

  camera: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8a2 2 0 0 1 2-2h1.5l1-1.6c.2-.3.5-.4.8-.4h5.4c.3 0 .6.1.8.4l1 1.6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" fill="currentColor"/>
    <circle cx="12" cy="13" r="3.6" fill="#fff"/>
    <circle cx="12" cy="13" r="1.7" fill="currentColor"/>
  </svg>`,
};
