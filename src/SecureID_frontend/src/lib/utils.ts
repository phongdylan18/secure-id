import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSecurePassword(
  length: number = 16,
  includeUppercase: boolean = true,
  includeLowercase: boolean = true,
  includeNumbers: boolean = true,
  includeSymbols: boolean = true
): string {
  let charset = ""
  
  if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
  if (includeNumbers) charset += "0123456789"
  if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"
  
  let password = ""
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  
  return password
}

export function calculatePasswordStrength(password: string): number {
  let score = 0
  
  // Length scoring
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1
  
  // Character type scoring
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  
  // Complexity scoring
  if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)) score += 1
  
  return Math.min(score, 10)
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp / 1000000).toLocaleString()
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function generateRandomSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let secret = ''
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return secret
}