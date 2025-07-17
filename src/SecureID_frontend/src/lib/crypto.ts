// Crypto utilities for client-side encryption
export class CryptoUtils {
  private static encoder = new TextEncoder()
  private static decoder = new TextDecoder()

  static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    )
  }

  static async encrypt(data: string, key: CryptoKey): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encodedData = this.encoder.encode(data)
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedData
    )
    
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encrypted), iv.length)
    
    return this.arrayBufferToHex(combined)
  }

  static async decrypt(encryptedData: string, key: CryptoKey): Promise<string> {
    const combined = this.hexToArrayBuffer(encryptedData)
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encrypted
    )
    
    return this.decoder.decode(decrypted)
  }

  static async exportKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', key)
    return this.arrayBufferToHex(exported)
  }

  static async importKey(keyData: string): Promise<CryptoKey> {
    const keyBuffer = this.hexToArrayBuffer(keyData)
    return await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    )
  }

  private static arrayBufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  private static hexToArrayBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
    }
    return bytes.buffer
  }
}