import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import animals from '@/data/animals.json';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getRandomAnimal(): string {
    return animals[Math.floor(Math.random() * animals.length)];
}

export function getRandomLightColor(): string {
    const hue = Math.floor(Math.random() * 360); // 0-360 : all color pallet
    const saturation = 60 + Math.floor(Math.random() * 30); // 60-90% : vivas color but not grey too
    let lightness = 70 + Math.floor(Math.random() * 20); // 70-90% : light color

    // Conversion HSL -> RGB
    lightness /= 100;
    const a = (saturation * Math.min(lightness, 1 - lightness)) / 100;
    const f = (n) => {
        const k = (n + hue / 30) % 12;
        const color = lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0'); // Convert to Hex and prefix "0" if needed
    };

    return `#${f(0)}${f(8)}${f(4)}`;
}

export function isAllowedUri(url, ctx): boolean {
    try {
        // construct URL
        const parsedUrl = url.includes(':')
            ? new URL(url)
            : new URL(`${ctx.defaultProtocol}://${url}`);

        // use default validation
        if (!ctx.defaultValidate(parsedUrl.href)) {
            return false;
        }

        // disallowed protocols
        const disallowedProtocols = ['ftp', 'file', 'mailto'];
        const protocol = parsedUrl.protocol.replace(':', '');

        if (disallowedProtocols.includes(protocol)) {
            return false;
        }

        // only allow protocols specified in ctx.protocols
        const allowedProtocols = ctx.protocols.map((p) =>
            typeof p === 'string' ? p : p.scheme
        );

        if (!allowedProtocols.includes(protocol)) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

export function shouldAutoLink(url): boolean {
    try {
        // construct URL
        const parsedUrl = url.includes(':')
            ? new URL(url)
            : new URL(`https://${url}`);

        // only auto-link if the domain is not in the disallowed list
        const disallowedDomains = [];
        const domain = parsedUrl.hostname;

        return !disallowedDomains.includes(domain);
    } catch {
        return false;
    }
}

export function setLink(editor) {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
        return;
    }

    // empty
    if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();

        return;
    }

    // update link
    try {
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url, title: 'grebgehgbejhr' })
            .run();
    } catch (e) {
        alert(e.message);
    }
}
