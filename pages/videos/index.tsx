// Redirect /videos -> /videos/page/1
import type { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: "/videos/page/1", permanent: false } }
}

export default function VideosIndexRedirect() {
  return null
}
