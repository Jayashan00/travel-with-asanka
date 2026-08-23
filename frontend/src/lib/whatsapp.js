/**
 * Helpers for opening WhatsApp with a message already written.
 * A pre-filled message means the customer only has to press send,
 * and Shan can see straight away what they are asking about.
 */

export const DEFAULT_WHATSAPP = '94764412050'

/** Strip spaces, plus signs and dashes: wa.me needs digits only. */
export function cleanNumber(number) {
  return String(number || DEFAULT_WHATSAPP).replace(/[^0-9]/g, '') || DEFAULT_WHATSAPP
}

/** Build a wa.me link with an optional pre-written message. */
export function waLink(number, message) {
  const base = `https://wa.me/${cleanNumber(number)}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/** A sensible opening message for the page the visitor is on. */
export function messageForPath(pathname = '') {
  if (pathname.startsWith('/tours/')) return 'Hi, I would like to ask about a tour package I saw on your website.'
  if (pathname.startsWith('/tours')) return 'Hi, I would like to ask about your tour packages.'
  if (pathname.startsWith('/vehicles/')) return 'Hi, I would like to ask about a vehicle I saw on your website.'
  if (pathname.startsWith('/vehicles')) return 'Hi, I would like to ask about your vehicles and rates.'
  if (pathname.startsWith('/blog')) return 'Hi, I am planning a trip to Sri Lanka and would like some advice.'
  if (pathname.startsWith('/contact')) return 'Hi, I would like to plan a trip in Sri Lanka.'
  return 'Hi, I found your website and would like to plan a trip in Sri Lanka.'
}

/** Message for a specific tour package. */
export function messageForTour(title) {
  return `Hi, I am interested in the "${title}" tour package. Could you tell me more?`
}

/** Message for a specific vehicle. */
export function messageForVehicle(name) {
  return `Hi, I would like to ask about hiring the ${name}. Could you tell me the rates?`
}