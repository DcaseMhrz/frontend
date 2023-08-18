import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Dashboard from "../../components/Layout/Dashboard";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { CircularProgress, Box } from "@mui/material";

export default function Page() {
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center" // for horizontal centering
          alignItems="center" // for vertical centering
          height="100vh" // take the full viewport height
        >
          <CircularProgress sx={{ minWidth: "200px", minHeight: "200px" }} />
        </Box>
      ) : (
        <>
          <Dashboard title="Dashboard">Hello</Dashboard>
        </>
      )}
    </>
  );
}

export const getStaticProps = () => {
  return {
    props: {},
  };
};
