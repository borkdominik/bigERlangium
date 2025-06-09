export function startsWithUppercaseLetter(str: string): boolean {
    return /[A-Z]/.test(str[0]);
}
