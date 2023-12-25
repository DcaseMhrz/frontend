"use client";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Alert from "@mui/material/Alert";
import { Button, CircularProgress, Divider } from "@mui/material";
import google from "../public/googesignin.png";
import Image from "next/image";
const api = require("@/../../apiCalls");

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://sswhfc.vercel.app">
        HFC - SSW Concierge
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignInSide() {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);

    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const formData = {
      email: data.get("email"),
      password: data.get("password"),
    };
    try {
      const signin = await api.login(formData);
      if (signin.status !== 200) {
        event.preventDefault();
        console.log("Invalid Creds");
        setError(true);
        setLoading(false);
      } else {
        setError(false);
        Cookies.set("token", signin.data.token.token);
        router.push("/dashboard");
        setLoading(false);
      }
    } catch (error) {
      setError(true);
      console.log(error);
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const signin = await api.handleSignInWithGoogle();
    } catch (error) {
      setError(true);
      setGoogleLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1546942113-a6c43b63104a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyc3x8fHx8fDE2OTIxNDgzODQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            {error && (
              <Alert severity="error">
                Invalid Credentials. Failed to Login
              </Alert>
            )}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? (
                  <CircularProgress sx={{ color: "white" }} />
                ) : (
                  "Sign In"
                )}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  {/* <Link href="#" variant="body2"> */}
                  {"Don't have an account? Sign Up (disabled)"}
                  {/* </Link> */}
                </Grid>
              </Grid>
              <Divider sx={{ mt: 5, mb: 5 }} />

              <div
                onClick={handleSignIn}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#5BABF5",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  padding: "10px 15px",
                  width: "60%",
                  margin: "auto",
                }}
              >
                <Image
                  width={"80"}
                  height={"80"}
                  src={google}
                  alt="Google Icon"
                  style={{ marginRight: "10px" }}
                />
                {googleLoading ? (
                  <CircularProgress />
                ) : (
                  <>Sign in with Google</>
                )}
              </div>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
