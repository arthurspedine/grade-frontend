export function encodeText(text: string): string {
  const base64 = Buffer.from(text, 'utf-8').toString('base64')

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeText(encoded: string): string {
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')

  while (base64.length % 4) {
    base64 += '='
  }

  return Buffer.from(base64, 'base64').toString('utf-8')
}
