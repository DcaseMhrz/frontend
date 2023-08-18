import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InboxIcon from "@mui/icons-material/InboxOutlined";
import HomeIcon from "@mui/icons-material/Home";
import { WorkHistory } from "@mui/icons-material";
import Logout from "../Logout";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mdikesh.vercel.app/">
        Dcase Mhrz
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const itemLists = [
  {
    name: "Home",
    link: "/",
    icon: <HomeIcon sx={{ height: 40, width: 40 }} />,
  },
  {
    name: "Sofitel Hotel",
    link: "/sofitel",
    icon: <WorkHistory sx={{ height: 40, width: 40 }} />,
  },
  {
    name: "profile match",
    link: "/dashboard",
    icon: <HomeIcon sx={{ height: 40, width: 40 }} />,
  },
  {
    name: "settings",
    link: "/dashboard",
    icon: <HomeIcon sx={{ height: 40, width: 40 }} />,
  },
];

const drawerWidth: number = 300;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

interface DashboardProps {
  children: React.ReactNode;
  title: string;
}
export default function Dashboard(props: DashboardProps) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {props.title}
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Logout />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            {" "}
            <Box
              display="flex"
              justifyContent="start" // for horizontal centering
              alignItems="center" // for vertical centering
              // take the full viewport height
            >
              <Typography variant="h5">Welcome Dikesh</Typography>
            </Box>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            {itemLists.map((item, index) => (
              <Link
                href={item.link}
                sx={{
                  color: "inherit", // or any color you prefer
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "none",
                  },
                }}
              >
                <ListItem
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                      "& .MuiListItemIcon-root": {
                        color: "#2E94F4", // replace with your desired color
                      },
                      "& .MuiListItemText-root": {
                        color: "#2E94F4", // replace with your desired color
                        "& a": {
                          // targeting the anchor tag within ListItemText
                          textDecoration: "none",
                        },
                      },
                    },
                  }}
                  // onClick={() => handleItemClick(item.name)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{ textDecoration: "none" }}
                  />
                </ListItem>
                <Divider />
              </Link>
            ))}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {props.children}
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
