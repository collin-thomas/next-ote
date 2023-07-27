import Link from "next/link";
import { getCookies } from "../utils/cookies";

export default function Success() {
  return (
    <>
      <h1>Success</h1>
      <Link href={"/"}>Back</Link>
    </>
  );
}
export async function getServerSideProps(context) {
  // Get cookies as a test
  // There should not be any cookies after successful submittal of the form
  const cookies = getCookies();
  console.log({ cookies });
  return { props: {} };
}
