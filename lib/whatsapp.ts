export function whatsappLink(message: string) {
  const phone = process.env.WHATSAPP_PHONE || "";
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${text}`;
}
