// URL detection regex pattern
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export interface DetectedURL {
  url: string;
  startIndex: number;
  endIndex: number;
}

export function detectURLs(text: string): DetectedURL[] {
  const urls: DetectedURL[] = [];
  let match;

  while ((match = URL_REGEX.exec(text)) !== null) {
    urls.push({
      url: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return urls;
}

export function extractURLs(text: string): string[] {
  const matches = text.match(URL_REGEX);
  return matches || [];
}

