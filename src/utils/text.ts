import { truncateMiddle } from './string';

export function findUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
  return text.match(urlRegex) || [];
}

export function replaceUrlsWithLinks(text: string): string {
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
  return text.replace(urlRegex, (url) => {
    const displayUrl = truncateMiddle(url, 50);
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 hover:underline break-all" title="${url}">${displayUrl}</a>`;
  });
}