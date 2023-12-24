import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  InputLabel,
  List,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import Dashboard from "../../components/Layout/Dashboard";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { CheckBox, Label } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
const api = require("@/../../apiCalls");

const columns: GridColDef[] = [
  { field: "id", headerName: "HFC#", width: 70 },
  { field: "name", headerName: "Full Name", width: 130 },
  { field: "email", headerName: "Email", width: 150 },
  { field: "phone", headerName: "Phone", width: 100 },
  { field: "cname", headerName: "Collector's Name", width: 130 },
  { field: "cemail", headerName: "Collector's Email", width: 130 },
  { field: "cphone", headerName: "Collector's Phone", width: 130 },
  {
    field: "item",
    headerName: "Item Details",
    type: "number",
    width: 90,
  },
  {
    field: "verified",
    headerName: "Verified?",
    type: "boolean",
    width: 100,
  },
  {
    field: "collected",
    headerName: "Collected?",
    type: "boolean",
    width: 100,
  },
];

type hfcType = {
  id: number;
  name: string;
  phone: string;
  email: string;
  cname: string;
  cphone: string;
  cemail: string;
  item: string;
  verified: boolean;
  collected: boolean;
  verified_by: string;
  given_by: string;
  note: string;
  created_at: string;
  location: string;
};

export const ComponentToPrint = React.forwardRef<
  HTMLDivElement,
  { hfcontent: hfcType }
>(({ hfcontent }, ref) => {
  const formattedDate = new Date(hfcontent.created_at).toLocaleString("en-AU", {
    timeZone: "Australia/Sydney",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div
      ref={ref}
      style={{
        minHeight: "100vh", // Full page height
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "0px",
        }}
      >
        <h1 style={{ margin: 0 }}>Sofitel Sydney Wentworth</h1>
        <p>
          61-101 Phillip Street, Sydney, NSW, 2000 <br />
          Phone: 02 9228 9182, 0493 442 438
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h2 style={{ margin: 0 }}>Hold for Collection</h2>
      </div>

      {/* <hr style={{ border: "1px solid #ddd", margin: "10px 0" }} /> */}

      {/* Item Details section */}
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          border: "10px solid black",
        }}
      >
        <h1 style={{ fontSize: "60px" }}>HFC # {hfcontent.id}</h1>
      </div>

      <h2>Item Details</h2>
      <table
        border={1}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <tbody>
          <tr>
            <th>Date:</th>
            <td>{formattedDate}</td>
          </tr>
          <tr>
            <th>Item Description:</th>
            <td>{hfcontent.item}</td>
          </tr>
          <tr>
            <th>Accepted By:</th>
            <td>{hfcontent.verified_by}</td>
          </tr>
          <tr>
            <th rowSpan={2}>Note:</th>
            <td>{hfcontent.note}</td>
          </tr>
        </tbody>
      </table>

      {/* <hr style={{ border: "1px solid #ddd", margin: "10px 0" }} /> */}

      {/* Guest Details section */}
      <h2>Guest Information</h2>
      <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <th>Full Name:</th>
            <td>{hfcontent.name}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>{hfcontent.email}</td>
          </tr>
          <tr>
            <th>Phone:</th>
            <td>{hfcontent.phone}</td>
          </tr>
        </tbody>
      </table>

      {/* Collector Details section */}
      <h2>Collector Information</h2>
      {/* <hr style={{ border: "1px solid #ddd", margin: "10px 0" }} /> */}
      <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <th>Name:</th>
            <td>{hfcontent.cname}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>{hfcontent.cemail}</td>
          </tr>
          <tr>
            <th>Phone:</th>
            <td>{hfcontent.cphone}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});
ComponentToPrint.displayName = "ComponentToPrint";

const namesList = [
  "Ricardo Oliva Farrarons",
  "Jimmy Pongkapan",
  "James Thurman",
  "Josh Aronov",
  "Vasile Soaita",
  "Charles Manglicmot",
  "Dikesh Maharjan",
  "Jackson Denneen",
  "Kushal Rawat",
  "Prabin Chaulegain",
  "Ashanna Bomzan",
  "Gabriel Rodriguez",
  "Grégoire Loyer",
  "KC",
  "Nicholas Clough",
  "Pranisha Karki",
  "Ram Giri",
  "Tej Kaway",
  "Tyler Tolentino",
  "Valentina Rodriguez",
  "Romane Rosselin",
  "Richard Coote",
  "Simeon Osullivan",
  "Ragen Maharjan",
  "Kashif Aftab",
  "Alexander Ossipov",
  "Nikesh Maharjan",
];

const Admin: React.FC<{ data: any }> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [selectedHFC, setselectedHFC] = useState({} as hfcType);
  const [hfcdata, setHfcdata] = useState([]);
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState("");

  const formattedDate = new Date(selectedHFC.created_at).toLocaleString(
    "en-AU",
    {
      timeZone: "Australia/Sydney",
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

  const handleClose = () => {
    setError("");
    setOpen(false);
  };

  const handleSave = async () => {
    if (selectedHFC.verified && !selectedHFC.verified_by) {
      setError("Accepted by is required");
      return;
    }
    if (selectedHFC.verified && !selectedHFC.location) {
      setError("Location is required");
      return;
    }
    if (selectedHFC.collected && !selectedHFC.given_by) {
      setError("Given by is required");
      return;
    }
    try {
      const res = await api.updateHfcData(selectedHFC);

      getHFC();
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
      setError("");
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getHFC = async () => {
    const res = await api.getHfcData();
    setHfcdata(res);
  };

  const handleChange = (e: any, name: string) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setselectedHFC({ ...selectedHFC, [name]: value });
  };

  //searching function

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = async () => {
    const res = await api.searchHFCData(searchTerm);
    setHfcdata(res);
  };

  useEffect(() => {
    getHFC();
  }, []);

  if (data.errors) {
    Cookies.remove("token");
    window.location.href = "/";
  }
  if (data.request === "UnAuthorized")
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <p>Oops! You are Unauthorized to view this page</p>
        </Grid>
      </Grid>
    );
  else
    return (
      <Dashboard title="HFC Data">
        <Box>
          <TextField
            id="search"
            label="Search HFC"
            variant="outlined"
            sx={{ width: "100%" }}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            value={searchTerm}
          />
        </Box>
        <Box sx={{ mt: "1rem" }}>
          <div style={{ height: "60vh", width: "100%" }}>
            <DataGrid
              rows={hfcdata}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 50, 100]}
              onRowDoubleClick={(row) => {
                setOpen(true);
                setselectedHFC(row.row);
              }}
            />
          </div>
          <Box sx={{ width: "100vw" }}>
            <Dialog
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  width: "100%",
                  maxWidth: "1320px!important",
                  maxHeight: "85vh",
                  height: "100%",
                },
              }}
            >
              <DialogTitle>
                <Box sx={{ justifyContent: "space-between", display: "flex" }}>
                  <Box>
                    <Typography variant="h6">
                      HFC <strong>{selectedHFC.id} </strong>
                      Item for {selectedHFC.cname}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                        color: "primary.main",
                      },
                    }}
                    onClick={() => {
                      handlePrint();
                    }}
                  >
                    <Box sx={{ display: "none" }}>
                      <ComponentToPrint
                        ref={componentRef}
                        hfcontent={selectedHFC}
                      />
                    </Box>

                    <PrintIcon />
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ my: "1rem" }}>
                  Details of the HFC
                  {error && (
                    <p
                      style={{
                        color: "red",
                        justifyContent: "center",
                        display: "flex",
                      }}
                    >
                      {error}
                    </p>
                  )}
                </DialogContentText>
                <form>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            label="Name"
                            value={selectedHFC.name}
                            fullWidth
                            onChange={(e) => handleChange(e, "name")}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Collector's Person Name"
                            value={selectedHFC.cname}
                            fullWidth
                            onChange={(e) => handleChange(e, "cname")}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            label="Phone"
                            value={selectedHFC.phone}
                            fullWidth
                            onChange={(e) => handleChange(e, "phone")}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Collector Person Phone"
                            value={selectedHFC.cphone}
                            fullWidth
                            onChange={(e) => handleChange(e, "cphone")}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Email"
                            value={selectedHFC.email}
                            fullWidth
                            onChange={(e) => handleChange(e, "email")}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            label="Collector's Person Email"
                            value={selectedHFC.cemail}
                            fullWidth
                            onChange={(e) => handleChange(e, "cemail")}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Item"
                            value={selectedHFC.item}
                            multiline
                            rows={3}
                            fullWidth
                            onChange={(e) => handleChange(e, "item")}
                          />
                        </Grid>
                      </Grid>
                      <Divider sx={{ my: 2 }} />
                      <Grid item xs={12}>
                        The item was left by {selectedHFC.name} on{" "}
                        {formattedDate} for {selectedHFC.cname} to collect.{" "}
                        {selectedHFC.verified &&
                          `The item was Accepted by ${selectedHFC.verified_by}.`}{" "}
                        {selectedHFC.verified &&
                          selectedHFC.location &&
                          `The item was placed in ${selectedHFC.location}.`}
                        {selectedHFC.collected &&
                          selectedHFC.verified &&
                          `The item has been Collected and given by ${
                            selectedHFC.given_by ?? ""
                          }.`}
                      </Grid>
                    </Grid>
                    <Grid item xs={6}>
                      <Grid container spacing={2}>
                        <FormControlLabel
                          control={<Checkbox checked={selectedHFC.verified} />}
                          label="Item Verified"
                          onChange={(e) => handleChange(e, "verified")}
                          sx={{ display: "none" }}
                        />
                        <Grid item xs={12}>
                          <Button
                            sx={{
                              p: 2,
                              marginRight: 0,
                              width: "100%",
                              pointerEvents: selectedHFC.verified
                                ? "none"
                                : "auto",
                            }}
                            variant={
                              selectedHFC.verified ? "contained" : "outlined"
                            }
                            color={selectedHFC.verified ? "success" : "error"}
                            onClick={() => {
                              setselectedHFC({
                                ...selectedHFC,
                                verified: !selectedHFC.verified,
                              });
                            }}
                          >
                            {selectedHFC.verified
                              ? "Accepted and Verified"
                              : "Mark as Accepted"}
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <InputLabel
                            htmlFor="accepted-by-select"
                            sx={{
                              display: selectedHFC.verified ? "block" : "none",
                              my: 1,
                            }}
                          >
                            Accepted By
                          </InputLabel>
                          <Select
                            disabled={!selectedHFC.verified}
                            value={selectedHFC.verified_by}
                            required={selectedHFC.verified}
                            fullWidth
                            sx={{
                              display: selectedHFC.verified ? "block" : "none",
                            }}
                            onChange={(e) => handleChange(e, "verified_by")}
                          >
                            <MenuItem value="" disabled>
                              Select Verified By
                            </MenuItem>
                            {namesList.map((name) => (
                              <MenuItem key={name} value={name}>
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                        <Grid item xs={5}>
                          <InputLabel
                            htmlFor="location-select"
                            sx={{
                              display: selectedHFC.verified ? "block" : "none",
                              my: 1,
                            }}
                          >
                            Location
                          </InputLabel>
                          <Select
                            disabled={!selectedHFC.verified}
                            value={selectedHFC.location}
                            fullWidth
                            onChange={(e) => handleChange(e, "location")}
                            sx={{
                              display: selectedHFC.verified ? "block" : "none",
                            }}
                          >
                            <MenuItem value="" disabled>
                              Select Location
                            </MenuItem>
                            <MenuItem value="Storage 1">Storage 1</MenuItem>
                            <MenuItem value="Luggage RoomHanger">
                              Luggage Room Hanger
                            </MenuItem>
                            <MenuItem value="Luggage Room Bay 0">
                              Luggage Room Bay 0
                            </MenuItem>
                            <MenuItem value="Luggage Room Bay 1">
                              Luggage Room Bay 1
                            </MenuItem>
                            <MenuItem value="DM Safe">DM safe</MenuItem>
                            <MenuItem value="Key Bag">Key Bag</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item xs={11}>
                          <TextField
                            label="Enter notes if required (optional)"
                            value={selectedHFC.note}
                            fullWidth
                            multiline
                            rows={3}
                            onChange={(e) => handleChange(e, "note")}
                            sx={{
                              display: selectedHFC.verified ? "block" : "none",
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sx={{
                            display: selectedHFC.verified ? "block" : "none",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox checked={selectedHFC.collected} />
                            }
                            label="Item Collected"
                            onChange={(e) => handleChange(e, "collected")}
                            sx={{ display: "none" }}
                          />
                          <Button
                            sx={{
                              p: 2,
                              marginRight: 0,
                              width: "100%",
                              pointerEvents: selectedHFC.collected
                                ? "none"
                                : "auto",
                            }}
                            variant={
                              selectedHFC.collected ? "contained" : "outlined"
                            }
                            color={selectedHFC.collected ? "success" : "error"}
                            onClick={() => {
                              setselectedHFC({
                                ...selectedHFC,
                                collected: !selectedHFC.collected,
                              });
                            }}
                          >
                            {selectedHFC.collected
                              ? "Collected"
                              : "Mark as Collected"}
                          </Button>
                        </Grid>

                        <Grid item xs={11}>
                          <InputLabel
                            htmlFor="given-by-select"
                            sx={{
                              display: selectedHFC.collected ? "block" : "none",
                              my: 1,
                            }}
                          >
                            Given By
                          </InputLabel>
                          <Select
                            id="given-by-select"
                            disabled={!selectedHFC.collected}
                            value={selectedHFC.given_by}
                            required={selectedHFC.collected}
                            fullWidth
                            onChange={(e) => handleChange(e, "given_by")}
                            sx={{
                              display:
                                selectedHFC.verified && selectedHFC.collected
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <MenuItem value="" disabled>
                              Select Given By
                            </MenuItem>
                            {namesList.map((name) => (
                              <MenuItem key={name} value={name}>
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave} sx={{ px: 5 }} variant="contained">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      </Dashboard>
    );
};
export default Admin;

export async function getServerSideProps(context: any) {
  const cookie = context.req.cookies["token"];
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/verify`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookie}`,
    },
  });
  const data = await res.json();
  console.log(data);

  // Pass data to the page via props
  return { props: { data } };
}
