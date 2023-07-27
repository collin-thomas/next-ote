import { randomBytes, createDecipheriv } from "crypto";

/**
 * Create a random key for encryption
 * @returns An encryption key in base64
 */
export const createRandomKey = () => {
  // Generate a random 256-bit key
  // Convert the key to a base64-encoded string
  return randomBytes(32).toString("base64");
};

/**
 * Written with the Web Crypto API for the browser.
 * @param {String} str String to encrypt
 * @param {String} base64Key The encryption key in base64
 * @returns {String} The encrypted string
 */
export const encrypt = async (str, base64Key) => {
  // Convert the key from a base64 string to a Uint8Array
  const keyBytes = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));

  // Generate a random initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  // Convert the text to be encrypted to a Uint8Array
  const textBytes = new TextEncoder().encode(str);

  // Define the encryption algorithm
  const algorithm = {
    name: "AES-CBC",
    iv: iv,
  };

  // Import the key
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    keyBytes,
    algorithm,
    false,
    ["encrypt"]
  );

  // Encrypt the text
  const cipherText = await window.crypto.subtle.encrypt(
    algorithm,
    cryptoKey,
    textBytes
  );

  // Convert the ciphertext to a hex string
  const cipherTextBytes = new Uint8Array(cipherText);
  const cipherTextHex = Array.from(cipherTextBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Convert the iv to a hex string
  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Return the iv and cipherText as a colon-separated hex string
  return `${ivHex}:${cipherTextHex}`;
};

/**
 * Written with Node.js crypto module for the server.
 * @param {String} encryptedString The encrypted string
 * @param {String} base64Key The encryption key in base64
 * @returns {String} The decrypted string
 */
export const decrypt = (encryptedString, base64Key) => {
  // Split the input into the IV and the cipher text
  const [ivHex, cipherTextHex] = encryptedString.split(":");

  // Convert the IV and the cipher text from hex strings to buffers
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(cipherTextHex, "hex");

  // Convert the base64-encoded key to a buffer
  const key = Buffer.from(base64Key, "base64");

  // Create a decipher object
  const decipher = createDecipheriv("aes-256-cbc", key, iv);

  // Decrypt the cipher text
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // Test failure
  //throw new Error("test error decrypt");

  // Convert the decrypted buffer to a string
  return decrypted.toString("utf8");
};
