export function formatPhoneNumber(value: string): string {
  let digits = value.replace(/\D/g, "");

  // Accept pasted US numbers beginning with country code 1.
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 10);

  if (digits.length > 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length > 3) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return digits;
  }
}
