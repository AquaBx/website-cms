// place files you want to import through the `$lib` alias in this folder.

import { env } from '$env/dynamic/public';

export function getMediaUrl(url: string | null | undefined) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${env.PUBLIC_CMS_URL || 'http://localhost:3001'}/${url}`;
}