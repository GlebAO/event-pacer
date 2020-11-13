export function phoneIsValid(phoneString: string) {
    return phoneString.length === 12 && /^((\+)+[0-9]+)$/.test(phoneString);
}