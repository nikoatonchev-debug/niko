/* Kleine Inline-SVG-Icons, damit die Seite auch ohne eigene Bilder schon
 * fertig aussieht. Sobald echte Fotos/Logos da sind, können die
 * product-image-Boxen und der Header-Logo-Platzhalter einfach ersetzt werden. */

const SFIcons = {
  // Icons für „Wer wir sind“ – aus Googles Material Symbols (Apache-Lizenz 2.0)
  aboutTeam: `<svg aria-hidden="true" focusable="false" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M40-190v-130q0-29 20.5-49.5T110-390h141q17 0 32.5 8.5T310-358q29 42 74 65t96 23q51 0 96-23t75-65q11-15 26-23.5t32-8.5h141q29 0 49.5 20.5T920-320v130q0 13-8.5 21.5T890-160H690q-13 0-21.5-8.5T660-190v-89q-36 33-82.5 51T480-210q-51 0-97-18t-83-51v89q0 13-8.5 21.5T270-160H70q-13 0-21.5-8.5T40-190Zm440-140q-35 0-67.5-16.5T360-392q-16-23-38.5-37T273-448q29-30 91-46t116-16q54 0 116.5 16t91.5 46q-26 5-48.5 19T601-392q-20 29-52.5 45.5T480-330ZM160-460q-45 0-77.5-32.5T50-570q0-46 32.5-78t77.5-32q46 0 78 32t32 78q0 45-32 77.5T160-460Zm640 0q-45 0-77.5-32.5T690-570q0-46 32.5-78t77.5-32q46 0 78 32t32 78q0 45-32 77.5T800-460ZM480-580q-45 0-77.5-32.5T370-690q0-46 32.5-78t77.5-32q46 0 78 32t32 78q0 45-32 77.5T480-580Z"/></svg>`,
  aboutPrint: `<svg aria-hidden="true" focusable="false" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-84 32-157t87.5-127q55.5-54 130-85T489-880q79 0 150 26.5T763.5-780q53.5 47 85 111.5T880-527q0 108-63 170.5T650-294h-75q-18 0-31 14t-13 31q0 20 14.5 38t14.5 43q0 26-24.5 57T480-80ZM282-469q15-15 15-35t-15-35q-15-15-35-15t-35 15q-15 15-15 35t15 35q15 15 35 15t35-15Zm126-170q15-15 15-35t-15-35q-15-15-35-15t-35 15q-15 15-15 35t15 35q15 15 35 15t35-15Zm214 0q15-15 15-35t-15-35q-15-15-35-15t-35 15q-15 15-15 35t15 35q15 15 35 15t35-15Zm131 170q15-15 15-35t-15-35q-15-15-35-15t-35 15q-15 15-15 35t15 35q15 15 35 15t35-15Z"/></svg>`,
  aboutHand: `<svg aria-hidden="true" focusable="false" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M484-120q-17 0-29-12t-12-29q0-7 3-14.5t9-13.5l175-175q5-5 5-10.5t-5-10.5q-5-5-10.5-5t-10.5 5L434-210q-6 6-13 9t-15 3q-17 0-28.5-11.5T366-238q0-10 3-16.5t8-11.5l175-175q5-5 5-10.5t-5-10.5q-5-5-10.5-5t-10.5 5L356-288q-6 6-13 9t-16 3q-16 0-28-12t-12-28q0-8 3-15t9-13l175-175q5-5 5-10.5t-5-10.5q-5-5-10.5-5t-10.5 5L279-365q-5 5-12 8t-17 3q-17 0-28.5-11T210-393q0-8 3-15t9-13l204-204q8-8 19.5-7.5T465-624l107 107q11 11 24.5 18.5T629-491q32 0 54-20.5t22-55.5q0-14-5.5-27.5T681-621L540-762q-14-14-16-33t12-32q11-10 24-14.5t27-4.5q23 0 46.5 11t42.5 30l169 170q18 18 26.5 40t8.5 51q0 20-9 40.5T845-466L512-132q-8 8-14 10t-14 2ZM122-442q-23-20-34.5-46T76-542q0-26 9.5-49.5T115-635l169-170q17-17 37.5-26t43.5-9q25 0 48.5 9t40.5 26l205 205q7 7 11.5 15t4.5 18q0 19-13.5 32.5T629-521q-11 0-20-5t-17-13L486-645q-17-17-42-17t-42 17L195-438q-14 14-35 12t-38-16Z"/></svg>`,
  aboutPlant: `<svg aria-hidden="true" focusable="false" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M458.5-138.5Q450-147 450-160v-279h-20q-64 0-120.5-24.5T209-533q-44-45-66.5-104T120-760v-50q0-13 8.5-21.5T150-840h48q62 0 119 24.5T419-746q33 34 54.5 76t30.5 89q8-12 17-23t19-22q45-45 102-69.5T762-720h48q13 0 21.5 8.5T840-690v50q0 64-24 123t-68 104q-45 45-101.5 69T528-320h-18v160q0 13-8.5 21.5T480-130q-13 0-21.5-8.5Z"/></svg>`,

  logo: `<svg aria-hidden="true" focusable="false" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#e0632c"/>
    <path d="M15 18c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6v2l4 3-2 4-3-1v11a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V26l-3 1-2-4 4-3v-2z" fill="#faf5ea"/>
    <circle cx="24" cy="19" r="3.2" fill="#e0632c"/>
  </svg>`,

  hoodie: (rawColor) => {
    const color = /^#[0-9a-f]{6}$/i.test(String(rawColor)) ? rawColor : "#2c6e6b";
    return `<svg aria-hidden="true" focusable="false" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 8c-6 2-16 8-18 20l10 8 4-8v54a4 4 0 0 0 4 4h40a4 4 0 0 0 4-4V28l4 8 10-8C86 16 76 10 70 8l-8 8H38l-8-8z" fill="${color}"/>
    <path d="M38 8l6 10h12l6-10" stroke="#faf5ea" stroke-width="2" fill="none"/>
    <circle cx="50" cy="46" r="10" fill="#faf5ea" opacity="0.85"/>
    <path d="M45 46l3.5 3.5L56 42" stroke="${color}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  },

  pin: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" fill="currentColor"/>
    <circle cx="12" cy="9" r="2.5" fill="#fff"/>
  </svg>`,

  cash: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="12" rx="2" fill="currentColor"/>
    <circle cx="12" cy="12" r="3.2" fill="#fff"/>
  </svg>`,

  clock: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="currentColor"/>
    <path d="M12 7v5l3.5 2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>`,

  print: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="3" width="16" height="7" rx="1.5" fill="currentColor"/>
    <rect x="4" y="14" width="16" height="7" rx="1.5" fill="currentColor" opacity="0.5"/>
    <rect x="2" y="9" width="20" height="6" rx="1.5" fill="currentColor"/>
  </svg>`,

  team: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="9" r="3.2" fill="currentColor"/>
    <circle cx="17" cy="9" r="2.6" fill="currentColor" opacity="0.6"/>
    <path d="M2 20c0-3.6 2.9-6.3 6-6.3s6 2.7 6 6.3" fill="currentColor"/>
    <path d="M13.5 14.2c2.6.3 4.5 2.6 4.5 5.8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
  </svg>`,

  cart: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 4h2l2.6 12.4A2 2 0 0 0 9.5 18H18a2 2 0 0 0 2-1.6L21.5 8H6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="10" cy="21" r="1.6" fill="currentColor"/>
    <circle cx="18" cy="21" r="1.6" fill="currentColor"/>
  </svg>`,

  gear: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" stroke-width="1.6" fill="none"/>
    <path d="M19.4 13a7.4 7.4 0 0 0 0-2l2-1.5-2-3.4-2.3.9a7.6 7.6 0 0 0-1.7-1l-.3-2.5H10.9l-.3 2.5a7.6 7.6 0 0 0-1.7 1l-2.3-.9-2 3.4L6.6 11a7.4 7.4 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9c.5.4 1.1.75 1.7 1l.3 2.5h3.2l.3-2.5a7.6 7.6 0 0 0 1.7-1l2.3.9 2-3.4-2-1.5z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/>
  </svg>`,

  lock: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="16" height="10" rx="2" fill="currentColor"/>
    <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" stroke-width="2" fill="none"/>
    <circle cx="12" cy="15" r="1.6" fill="#fff"/>
  </svg>`,

  sprout: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21V11" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M12 12c0-4 3-6 8-6 0 5-3 7-8 6z" fill="currentColor"/>
    <path d="M12 15c0-3.2-2.4-4.8-6.4-4.8 0 4 2.4 5.6 6.4 4.8z" fill="currentColor" opacity="0.65"/>
  </svg>`,

  camera: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8a2 2 0 0 1 2-2h1.5l1-1.6c.2-.3.5-.4.8-.4h5.4c.3 0 .6.1.8.4l1 1.6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" fill="currentColor"/>
    <circle cx="12" cy="13" r="3.6" fill="#fff"/>
    <circle cx="12" cy="13" r="1.7" fill="currentColor"/>
  </svg>`,
};
