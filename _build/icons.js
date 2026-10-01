// Icone SVG a linea (viewBox 24x24, tratto 1.5): disegnate per il sito, nessuna libreria esterna.
const T = 'M7.5 3C5 3 3.5 5 3.5 7.6c0 2 .7 3.4 1.4 4.9.6 1.3.9 2.7 1.1 4.1l.5 3.6c.1.6.6 1.1 1.2 1.1s1.1-.4 1.3-1l1.1-4.1c.2-.7.8-1.2 1.5-1.2h.8c.7 0 1.3.5 1.5 1.2l1.1 4.1c.2.6.7 1 1.3 1s1.1-.5 1.2-1.1l.5-3.6c.2-1.4.5-2.8 1.1-4.1.7-1.5 1.4-2.9 1.4-4.9C20.5 5 19 3 16.5 3c-1.7 0-2.8.9-3.6 1.4-.6.3-1.2.3-1.8 0C10.3 3.9 9.2 3 7.5 3z';
module.exports = {
  tooth: `<path d="${T}"/>`,
  igiene: `<path d="M12 21v-9.5"/><rect x="9.5" y="2.5" width="5" height="9" rx="1.6"/><path d="M9.5 5.2H7.2M9.5 7.6H7.2M9.5 10H7.2"/>`,
  conservativa: `<path d="${T}"/><path d="M10 7.2c.6.9 1.4 1.3 2 1.3s1.4-.4 2-1.3"/>`,
  ortodonzia: `<path d="${T}"/><rect x="9.6" y="7.4" width="4.8" height="3.4" rx=".8"/><path d="M3.6 9.1h6M14.4 9.1h6"/>`,
  implantologia: `<path d="M6.5 5c0-1.3 1.2-2.1 2.4-1.7l3.1.9 3.1-.9c1.2-.4 2.4.4 2.4 1.7 0 1.9-.9 3.3-1.5 4.4h-8C7.4 8.3 6.5 6.9 6.5 5z"/><path d="M9.5 9.4v1.8h5V9.4"/><path d="M10.2 11.2h3.6l-.6 9.3c0 .4-.3.7-.7.7h-1c-.4 0-.7-.3-.7-.7z"/><path d="M9.6 13.8h4.8M9.8 16.4h4.4M10.1 19h3.8"/>`,
  pedodonzia: `<path d="${T}"/><path d="M9.6 9.6c1.3 1.2 3.5 1.2 4.8 0"/><circle cx="9.6" cy="7" r=".4" fill="currentColor"/><circle cx="14.4" cy="7" r=".4" fill="currentColor"/>`,
  estetica: `<path d="${T}"/><path d="M12 6.2l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6z"/>`,
  orologio: `<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>`,
  mano: `<path d="M8 13V7a1.5 1.5 0 0 1 3 0v5M11 11.5V5.5a1.5 1.5 0 0 1 3 0v6M14 11.5V7a1.5 1.5 0 0 1 3 0v7c0 4-2.6 7-6 7-2.4 0-3.9-1.2-5.1-3.1L4.3 15.4a1.5 1.5 0 0 1 2.5-1.7L8 15.2"/>`,
  goccia: `<path d="M12 3.2s6 6.4 6 10.8a6 6 0 0 1-12 0c0-4.4 6-10.8 6-10.8z"/><path d="M9.2 14.5a2.8 2.8 0 0 0 2.8 2.8"/>`,
  cuffie: `<path d="M4.5 15v-3a7.5 7.5 0 0 1 15 0v3"/><path d="M4.5 14.5h3v5.5h-2a1 1 0 0 1-1-1zM19.5 14.5h-3v5.5h2a1 1 0 0 0 1-1z"/>`,
  respiro: `<path d="M3.5 9h10a3 3 0 1 0-3-3"/><path d="M3.5 13h14a3 3 0 1 1-3 3"/><path d="M3.5 17h6"/>`,
  parla: `<path d="M4.5 5.5h15a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4.5 3.5v-3.5h-1a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z"/><path d="M8 10h8M8 13h5"/>`,
  foto: `<rect x="3.5" y="6.5" width="17" height="13" rx="2"/><path d="M8.5 6.5l1.4-2.2h4.2l1.4 2.2"/><circle cx="12" cy="13" r="3.4"/>`,
};
