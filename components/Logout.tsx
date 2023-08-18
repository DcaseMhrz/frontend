import { Button } from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const Logout = () => {
  const router = useRouter();
  return (
    <Button
      variant="outlined"
      type="button"
      onClick={async () => {
        await Cookies.remove("token");
        router.push("/");
      }}
      sx={{ color: "white" }}
    >
      Logout
    </Button>
  );
};

export default Logout;
