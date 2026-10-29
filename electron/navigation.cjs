function navigationTarget(value, origin) {
  let url;
  try { url = new URL(value); } catch { return null; }
  if (url.username || url.password) return null;
  if (url.origin === origin) return { kind: 'internal', url: url.href };
  if (url.protocol === 'https:') return { kind: 'external', url: url.href };
  return null;
}

module.exports = { navigationTarget };
