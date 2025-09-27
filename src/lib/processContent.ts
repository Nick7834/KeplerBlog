import DOMPurify from "dompurify";

function escapeHTML(html: string) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function containsDangerousTagsOrAttrs(html: string) {
  const dangerousTags =
    /<(script|iframe|object|embed|style|img|video|audio|form|input|button)[\s>]/i;
  if (dangerousTags.test(html)) return true;

  const dangerousAttrs = /on\w+="[^"]*"/i;
  if (dangerousAttrs.test(html)) return true;

  return false;
}

export function processContent(content: string, shouldParseLinks: boolean) {
  if (containsDangerousTagsOrAttrs(content)) {
    let escaped = escapeHTML(content);

    if (shouldParseLinks) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      escaped = escaped.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-text">${url}</a>`;
      });
    }

    return escaped;
  }

  let processed = content;

  if (shouldParseLinks) {
    const urlRegex = /(https?:\/\/[^\s<>"']+)/g;
    processed = processed.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-text">${url}</a>`;
    });
  }

  return DOMPurify.sanitize(processed, { ADD_ATTR: ["target"] });
}

///////////

function escapeAttribute(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHTML2(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isSafeUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export function processContentDraft(content: string, shouldParseLinks: boolean) {
  if (!shouldParseLinks) return content;

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const processedContent = content.replace(urlRegex, (rawUrl) => {
    const cleanUrl = rawUrl.replace(/<[^>]*>/g, "");

    if (!isSafeUrl(cleanUrl)) {
      return escapeHTML2(cleanUrl);
    }

    const safeHref = escapeAttribute(cleanUrl);
    const displayText = escapeHTML2(cleanUrl);

    return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="link-text">${displayText}</a>`;
  });

  const safeHTML = DOMPurify.sanitize(processedContent, { ADD_ATTR: ["target"] });

  return safeHTML;
}