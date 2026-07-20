// In a real application, you would use Redis or a Database table to store these tokens.
// For this development version, we use an in-memory map.

interface ResetToken {
  code: string;
  expiresAt: number;
}

// Map from email to ResetToken
const resetStore = new Map<string, ResetToken>();

export function generateAndStoreCode(email: string): string {
  // Generate a random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store it with a 10-minute expiration
  const expiresAt = Date.now() + 10 * 60 * 1000;
  resetStore.set(email.toLowerCase(), { code, expiresAt });
  
  return code;
}

export function verifyCode(email: string, code: string): boolean {
  const normalizedEmail = email.toLowerCase();
  const tokenRecord = resetStore.get(normalizedEmail);
  
  if (!tokenRecord) {
    return false;
  }
  
  if (Date.now() > tokenRecord.expiresAt) {
    resetStore.delete(normalizedEmail);
    return false;
  }
  
  if (tokenRecord.code === code) {
    // Valid code, remove it so it can't be reused
    resetStore.delete(normalizedEmail);
    return true;
  }
  
  return false;
}
