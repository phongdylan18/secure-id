import base32 from 'hi-base32';

// Browser-compatible TOTP implementation using Web Crypto API
export function generateTOTP(secret, timeStep = 30, digits = 6) {
  return new Promise(async (resolve) => {
    try {
      console.log('Generating TOTP with:', { secret, timeStep, digits });
      
      // Clean the secret - remove spaces and ensure it's uppercase
      const cleanSecret = secret.replace(/\s/g, '').toUpperCase();
      console.log('Clean secret:', cleanSecret);
      
      // Decode base32 secret
      const secretBytes = base32.decode.asBytes(cleanSecret);
      const key = new Uint8Array(secretBytes);
      
      // Calculate time counter
      const time = Math.floor(Date.now() / 1000 / timeStep);
      const timeBuffer = new ArrayBuffer(8);
      const timeView = new DataView(timeBuffer);
      timeView.setUint32(4, time, false); // big-endian
      
      // Import key for HMAC
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
      );
      
      // Generate HMAC
      const signature = await crypto.subtle.sign('HMAC', cryptoKey, timeBuffer);
      const hmac = new Uint8Array(signature);
      
      // Dynamic truncation
      const offset = hmac[hmac.length - 1] & 0x0f;
      const code = ((hmac[offset] & 0x7f) << 24) |
                   ((hmac[offset + 1] & 0xff) << 16) |
                   ((hmac[offset + 2] & 0xff) << 8) |
                   (hmac[offset + 3] & 0xff);
      
      // Generate OTP
      const otp = (code % Math.pow(10, digits)).toString().padStart(digits, '0');
      console.log('Generated token:', otp);
      
      resolve(otp);
    } catch (error) {
      console.error('TOTP generation error:', error);
      console.error('Error details:', error.message);
      resolve('------');
    }
  });
}

export function getTimeRemaining(period = 30) {
  const periodAsNumber = Number(period);
  return periodAsNumber - Math.floor(Date.now() / 1000) % periodAsNumber;
}