import DOMPurify from "dompurify";

function escapeHTML(html: string) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function processContent(content: string, shouldParseLinks: boolean) {
  const safeText = escapeHTML(content);

  if (!shouldParseLinks) {
    return safeText;
  }

  const urlRegex = /(https?:\/\/[^\s<>"']+)/g;

  const withLinks = safeText.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-text">${url}</a>`;
  });

  const cleanHTML = DOMPurify.sanitize(withLinks);
  return cleanHTML;
}
