import parse from "html-react-parser";
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
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  if (!shouldParseLinks) {
    return escapeHTML(content);
  }

  const processedContent = content.replace(urlRegex, (url) => {
    const cleanUrl = url.replace(/<[^>]*>/g, "");
    return `<a href="${cleanUrl}" target="_blank" class="link-text">${cleanUrl}</a>`;
  });

  const cleanHTML = DOMPurify.sanitize(processedContent);

  return parse(cleanHTML);
}