export function formatError(msg) {
  return `<span class="cli-error">${msg}</span>`;
}

export function escapeHTML(str) {
  return str.replace(/[&<>"']/g, s =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s])
  );
}
