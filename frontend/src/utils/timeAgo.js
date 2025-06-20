export default function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = [
    { label: 'año', secs: 31536000 },
    { label: 'mes', secs: 2592000 },
    { label: 'día', secs: 86400 },
    { label: 'hora', secs: 3600 },
    { label: 'minuto', secs: 60 },
  ];

  for (const i of intervals) {
    const count = Math.floor(seconds / i.secs);
    if (count >= 1) {
      return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'justo ahora';
}
