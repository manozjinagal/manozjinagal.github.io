// ═══════════════════════════════════════════════════
// emailjs.js — Visitor notifications + Contact form
// ═══════════════════════════════════════════════════
import { CONFIG } from '../config.js';

const { publicKey, serviceId, templateId, toEmail } = CONFIG.emailjs;
const CONFIGURED = publicKey !== 'YOUR_PUBLIC_KEY';

// Init EmailJS SDK (loaded via CDN in HTML)
export function initEmailJS() {
  if (!CONFIGURED || typeof emailjs === 'undefined') return;
  emailjs.init(publicKey);
}

// Collect visitor metadata via ipapi.co
async function getVisitorInfo() {
  let city = 'Unknown', country = 'Unknown', ip = 'Unknown';
  try {
    const r = await fetch('https://ipapi.co/json/');
    const d = await r.json();
    city    = d.city    || 'Unknown';
    country = d.country_name || 'Unknown';
    ip      = d.ip      || 'Unknown';
  } catch (_) { /* silent fail — privacy-preserving */ }

  const ua = navigator.userAgent;
  const browser = ua.includes('Chrome') && !ua.includes('Edg') ? 'Chrome'
    : ua.includes('Safari') && !ua.includes('Chrome') ? 'Safari'
    : ua.includes('Firefox') ? 'Firefox'
    : ua.includes('Edg') ? 'Edge' : 'Other';

  return {
    ip, city, country,
    device:   ua.includes('Mobile') ? '📱 Mobile' : '💻 Desktop',
    browser,
    time:     new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' }),
    referrer: document.referrer || 'Direct / Instagram bio',
    page:     window.location.href,
  };
}

// Send visitor notification on page load
export async function notifyVisit() {
  if (!CONFIGURED || typeof emailjs === 'undefined') return;
  try {
    const v = await getVisitorInfo();
    await emailjs.send(serviceId, templateId, {
      to_email:         toEmail,
      subject:          '👁️ New visitor on your portfolio!',
      message_type:     'Page Visit',
      visitor_ip:       v.ip,
      visitor_city:     v.city,
      visitor_country:  v.country,
      visitor_device:   v.device,
      visitor_browser:  v.browser,
      visitor_time:     v.time,
      visitor_referrer: v.referrer,
      page_url:         v.page,
      from_name: '—', from_email: '—', message: '—',
    });
  } catch (_) { /* silent */ }
}

// Send contact form message
export async function sendContactForm({ name, email, message }) {
  if (!CONFIGURED) {
    return { ok: false, msg: '// EmailJS not configured — see src/config.js' };
  }
  if (typeof emailjs === 'undefined') {
    return { ok: false, msg: '// EmailJS SDK not loaded' };
  }
  try {
    await emailjs.send(serviceId, templateId, {
      to_email:         toEmail,
      subject:          `💌 Transmission from ${name}`,
      message_type:     'Contact Form',
      from_name:        name,
      from_email:       email,
      message,
      visitor_time:     new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      visitor_ip: '—', visitor_city: '—', visitor_country: '—',
      visitor_device: '—', visitor_browser: '—', visitor_referrer: '—', page_url: '—',
    });
    return { ok: true, msg: '// Transmission successful — will respond shortly' };
  } catch (err) {
    console.error('EmailJS error:', err);
    return { ok: false, msg: '// Transmission failed — please retry' };
  }
}
