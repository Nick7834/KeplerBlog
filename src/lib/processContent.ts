import parse from 'html-react-parser';

export function processContent(content: string, shouldParseLinks: boolean) {

    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const processedContent = content.replace(urlRegex, (url) => {
        const cleanUrl = url.replace(/<[^>]*>/g, '');

        return `<a href="${cleanUrl}" target="_blank" class="link-text">${cleanUrl}</a>`;
    });

    if (!shouldParseLinks) {
        return processedContent;
    }

    return parse(processedContent);
}