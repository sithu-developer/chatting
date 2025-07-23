import { useRouter } from "next/router";
import { useEffect } from "react";


export default function Home() {

  const router = useRouter();

  useEffect(() => {
      if(router) {
        router.push("/happy-chatting/login");
      }
  } , [router]);

  return (
    <>
      main page
    </>
  );
}
