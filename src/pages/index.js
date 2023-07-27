import { useRouter } from "next/router";
import { createCookie, deleteCookie, getCookies } from "../utils/cookies";
import { createRandomKey, encrypt, decrypt } from "../utils/crypto";

// Configure your cookie time to live in seconds
const cookieTtl = 5;

export default function Home({ encryptionKey, error }) {
  const router = useRouter();

  const onSubmit = async (event) => {
    // Prevent page reload
    event.preventDefault();

    // Get email from form
    const formData = new FormData(event.target);
    const { email } = Object.fromEntries(formData);

    // No submit when email is blank
    if (!email) return;

    // Encrypt the email
    const encryptedEmail = await encrypt(email, encryptionKey);

    // Reload the page with the encrypted email in the query string
    const url = new URL(location.href);
    url.searchParams.set("e", encryptedEmail);
    router.replace(url);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input name="email" type="email" />
        <button type="submit">Submit</button>
      </form>
      <pre>{error}</pre>
    </>
  );
}

export async function getServerSideProps(context) {
  // Set a name for our cookie
  const cookieName = "EncryptionKey";

  // Set props to populate later
  const props = {};

  // Get the encrypted email from query string
  // It will only exist after user submit the form
  const encryptedEmail = context?.query?.e;

  // When user submits the form,
  // it will send back the httpOnly cookie we set on page load.
  const cookies = getCookies(context);
  const encryptionKeyFromCookie = cookies[cookieName];

  if (encryptedEmail && encryptionKeyFromCookie) {
    try {
      // Decrypt the encrypted email using the encryption key from the httpOnly cookie
      const email = decrypt(encryptedEmail, encryptionKeyFromCookie);
      console.log({ email });

      // Delete the cookie.
      // The cookie wil be overwritten on failure
      context.res.setHeader("Set-Cookie", deleteCookie(cookieName));

      // Send the user to the next route
      return {
        redirect: {
          destination: "/success",
          permanent: false,
        },
      };
    } catch (error) {
      console.log({ error });
      // Set the error for this demo
      props.error = error.message ? error.message : error;
    }
  }

  // The httpOnly cookie has expired
  if (encryptedEmail && !encryptionKeyFromCookie) {
    props.error = "Try again";
  }

  // Generate a one time use key
  const encryptionKey = createRandomKey();

  // Create and Set HttpOnly Cookie on page load.
  // Yes, the process will break if the user does not submit the form before maxAge.
  context.res.setHeader(
    "Set-Cookie",
    createCookie(cookieName, encryptionKey, { maxAge: cookieTtl })
  );

  return { props: { encryptionKey, ...props } };
}
