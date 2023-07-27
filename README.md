# Next.js - One Time Encryption (OTE)

This Proof of Concept demonstrates the ability to send encrypted data from a form to the Next.js backend.

- Not suspectable to replay attacks.
  - An encryption key can only be used once.
  - An encryption key is deleted after use.
  - An encryption key is generated on each page load.
- An attacker can steal the key from the browser's memory but cannot use it on another machine.
  - Decryption happens server-side via a Secure HTTP cookie.
- Does not send data in plaintext.
  - Data is encrypted on client
  - Does not use an API
  - Encrypted data is sent via a query string parameter and utilizes SSR to decrypt the data.
- Cannot be brute forced.
  - Even valid encrypted strings can be decrypted with the presence of the Secure HTTP Cookie.

## When to use OTE

Use OTE when you need to get data from the user on the frontend to the backend, but the user is in an unauthenticated state, and exposing an API would garner too much risk.

## How it Works

When the page loads, Server Side Rendering (SSR) starts.

First the process checks for the `e` query string variable to be populated with an encrypted data.

Then it checks if the Secure HTTP Cookie exists.

Since this is the first time the page is loading, neither will exist.

A random encryption key is generated.

The Secure HTTP Cookie is created with the value set to the encryption key.

The encryption key is set on the `getServerSideProps` `props`.

The page loads.

Now when the user submits the form, the data is encrypted with the encryption key from the `page props`.

The page is reloaded using Next.js `router.replace()` with the query `e` set to the encrypted data.

The page's SSR starts again.

This time, the `e` query string is populated with the encrypted data and the Secure HTTP Cookie contains the encryption key that was used to encrypt the data.

The data is decrypted and then whatever processing of the data can happen and the user can be routed to the next page using a redirect or allow the page to render again.

In the demo, the user is redirected via response headers to the `/success` page where it uses SSR to verify that the Secure HTTP Cookie was deleted after successful use.

### Error Handling

If the encrypted data exists but the Secure HTTP Cookie does not, a new encryption key is generated. In the demo, the error is passed down to the web page via `page props`

When a failure occurs, a new encryption key is generated. In the demo, the error is passed down to the web page via `page props`
