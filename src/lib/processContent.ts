import DOMPurify from "dompurify";

function simpleEscape(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function processContent(content: string, shouldParseLinks: boolean) {
  let safeText = simpleEscape(content);

  if (shouldParseLinks) {
    const urlRegex = /(https?:\/\/[^\s<]+)/g;

    safeText = safeText.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-text">${url}</a>`;
    });
  }
  return DOMPurify.sanitize(safeText, {
    ALLOWED_TAGS: ["a"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });
}

export function processContentPost(html: string, shouldParseLinks: boolean) {
  if (!html) return "";

  let cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li", "span"],
    ALLOWED_ATTR: [],
  });

  if (shouldParseLinks) {
    const urlRegex = /(https?:\/\/[^\s<]+)/g;

    cleanHtml = cleanHtml.replace(urlRegex, (url) => {
      const safeUrl = url.replace(/["']/g, "");
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="link-text">${safeUrl}</a>`;
    });
  }

  return DOMPurify.sanitize(cleanHtml, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li", "span", "a"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
    ADD_ATTR: ["target"],
  });
}
