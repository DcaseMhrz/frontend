import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
const api = require("@/../../apiCalls");

const Callback = () => {
  const router = useRouter();

  const authenticate = async (token: string) => {
    // If the token is valid set the user and token in the local storage
    if (token) {
      Cookies.set("token", token, { expires: 365 });
      router.push("/dashboard");
    } else {
      Cookies.set("token", "");
      router.push("/");
    }
  };
  useEffect(() => {
    const token = router.query.token;

    if (token) {
      console.log(token);
      authenticate(token as string);
    }
  }, [router.query.token]);

  return <div>Authenticating...</div>;
};

export default Callback;
