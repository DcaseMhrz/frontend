import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  Paper,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
const api = require("../../apiCalls");
import useLocalStorage from "../../hooks/useLocalStorage";
import Head from "next/head";

type hfcType = {
  name: string;
  phone: string;
  email: string;
  cname: string;
  cphone: string;
  cemail: string;
  item: string;
};

const steps = ["Your details", "Collector details", "Item details"];

const getStepContent = (
  step: number,
  hfc: hfcType,
  setHfc: React.Dispatch<React.SetStateAction<hfcType>>, // Added missing comma here
  handleTermsChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  termsAccepted: boolean
) => {
  const handleChange =
    (prop: keyof hfcType) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setHfc(
        (prev) =>
          ({
            ...prev,
            [prop]: value,
          } as hfcType)
      );
    };
  switch (step) {
    case 0:
      return (
        <>
          <Typography variant="caption">Please fill in your details</Typography>
          <InputLabel sx={{ mt: 2, mb: 2 }}>Your Name</InputLabel>
          <TextField
            required
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            onChange={handleChange("name")}
            value={hfc.name || ""} // added value prop here
          />
          <InputLabel>Email </InputLabel>
          <TextField
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            onChange={handleChange("email")}
            value={hfc.email || ""} // added value prop here
          />
          <InputLabel>Phone Number (optional)</InputLabel>
          <TextField
            required
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            onChange={handleChange("phone")}
            value={hfc.phone || ""} // added value prop here
          />
        </>
      );
    case 1:
      return (
        <>
          <Typography variant="caption">
            Please fill in the Details of the person collecting
          </Typography>
          <InputLabel sx={{ mt: 2, mb: 2 }}>Collector&apos;s Name</InputLabel>
          <TextField
            required
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            onChange={handleChange("cname")}
            value={hfc.cname || ""} // added value prop here
          />
          <InputLabel>Collector&apos;s Email (Optional)</InputLabel>
          <TextField
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            onChange={handleChange("cemail")}
            value={hfc.cemail || ""} // added value prop here
          />
          <InputLabel>Collector&apos;s Phone Number (Optional)</InputLabel>
          <TextField
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            onChange={handleChange("cphone")}
            value={hfc.cphone || ""} // added value prop here
          />
        </>
      );
    case 2:
      return (
        <Box mb={3}>
          <InputLabel sx={{ mb: 2 }}>Item Details</InputLabel>
          <TextField
            placeholder="blue bag, small cardboard box, bag with clothes..."
            multiline
            rows={4}
            fullWidth
            onChange={handleChange("item")}
            value={hfc.item || ""} // added value prop here
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            <ul>
              <li>
                The establishment agrees to hold the item for collection for up
                to 3 months only. If the item is not collected within this
                3-month period, it will be disposed of without warning.{" "}
              </li>
              <li>
                Perishable food items will be destroyed after 24 hours only.{" "}
              </li>
              <li>
                The guest is required to understand and agree to these terms &
                conditions.
              </li>
            </ul>
            Please note the item is to be collected in the specified time frame
            to avoid any inconvenience.
          </Typography>
          <FormControlLabel
            control={
              <Checkbox checked={termsAccepted} onChange={handleTermsChange} />
            }
            label="I agree to the terms & conditions."
          />
        </Box>
      );
    default:
      return "Unknown step";
  }
};

export default function HorizontalNonLinearStepper() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>(
    {}
  );
  const [hfc, setHfc] = useLocalStorage("hfc", {} as hfcType); // Moved up to this component
  const [hfcId, setHfcId] = React.useState(); // Moved up to this component
  const [termsAccepted, setTermsAccepted] = React.useState(false);

  const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(event.target.checked);
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = async (hfc: hfcType) => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();

    if (completedSteps() === totalSteps()) {
      setIsLoading(true);
      try {
        const res = await api.sendHfcData(hfc);
        console.log(res.id);
        setHfcId(res.id);
        setHfc({} as hfcType);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
      // Make the API call when the "Finish" button is clicked
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Head>
        <title>HFC - Sofitel Sydney Wentworth</title>
      </Head>
      <Typography variant={"h5"} textAlign={"center"} marginBottom={"2vh"}>
        Sofitel Sydney Wentworth - Concierge
      </Typography>
      <Stepper nonLinear activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>

      <div>
        {allStepsCompleted() ? (
          <>
            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    flexGrow: 1,
                    overflow: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "3vh",
                  }}
                >
                  <CheckCircleIcon fontSize="large" sx={{ color: "green" }} />
                </Box>
                <Typography sx={{ mt: 2, mb: 1 }} textAlign={"center"}>
                  Done. Please show the below code to the Concierge for
                  <strong> verification</strong>. Once the Concierge has
                  verified the code, you will receive a confirmation email.
                  Thank you!.{" "}
                </Typography>
                <Typography
                  sx={{ mt: 2, mb: 1 }}
                  variant="h2"
                  textAlign={"center"}
                >
                  HFC#{hfcId}
                </Typography>
              </>
            )}
          </>
        ) : (
          <Box sx={{ flexGrow: 1, overflow: "auto", marginTop: "1vh" }}>
            <Box
              sx={{
                flexGrow: 1,
                overflow: "auto",
              }}
            >
              <Paper
                sx={{
                  padding: "1rem",
                  boxShadow: "1rem",
                  marginY: "2rem",
                  marginX: "1rem",
                }}
                elevation={1}
              >
                {getStepContent(
                  activeStep,
                  hfc,
                  setHfc,
                  handleTermsChange,
                  termsAccepted
                )}
              </Paper>
            </Box>
            <Box
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                display: "flex",
                marginBottom: "1rem",
                justifyContent: "space-around", // change this line
              }}
            >
              <Button
                variant="contained"
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ width: "40%" }}
              >
                Back
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Button variant="contained" sx={{ width: "40%" }} disabled>
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleComplete(hfc);
                    }}
                    disabled={!termsAccepted && activeStep === 2}
                    sx={{ width: "40%" }}
                  >
                    {completedSteps() === totalSteps() - 1 ? "Finish" : "Next"}
                  </Button>
                ))}
            </Box>
          </Box>
        )}
      </div>
    </Box>
  );
}
