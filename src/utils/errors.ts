export function firstError(errs: Record<string, string[] | string> = {}): string {
    const key = Object.keys(errs)[0];
    if (!key) return '';
    const messages = (errs as any)[key];
    if (Array.isArray(messages)) return messages[0] ?? '';
    return messages ? String(messages) : '';
}
