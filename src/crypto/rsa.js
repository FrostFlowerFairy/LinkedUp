const { subtle } = window.crypto

const arrayBufferToBase64 = arrayBuffer => {
  const arr = new Uint8Array(arrayBuffer)
  const keyStr = String.fromCharCode(...arr)
  return btoa(keyStr)
}
const base64ToArrayBuffer = base64 => {
  const str = atob(base64)
  const buf = new ArrayBuffer(str.length)
  const bufView = new Uint8Array(buf)
  for (let i = 0, l = str.length; i < l; i += 1) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}

export const generateRsaKeyPair = async () => {
  const opts = {
    name: 'RSA-OAEP',
    modulusLength: 1024,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  }
  const keyPair = await subtle.generateKey(opts, true, ['encrypt', 'decrypt'])
  const pkcs8 = await subtle.exportKey('pkcs8', keyPair.privateKey)
  const spki = await subtle.exportKey('spki', keyPair.publicKey)
  return {
    privateKey: arrayBufferToBase64(pkcs8),
    publicKey: arrayBufferToBase64(spki),
  }
}

export const encryptData = async (data, publicKey) => {
  let pk = base64ToArrayBuffer(publicKey)
  pk = await subtle.importKey(
    'spki',
    pk,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  )
  const encoder = new TextEncoder()
  const encodedData = encoder.encode(JSON.stringify(data))
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    pk,
    encodedData
  )
  return arrayBufferToBase64(encryptedData)
}
