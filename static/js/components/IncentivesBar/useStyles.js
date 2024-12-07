import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
  rootContainer: {
    fontFamily: "Mulish",
    fontSize: 18,
    color: "white",
    textAlign: "center",
    lineHeight: "24px",
    paddingBottom: 20,
  },
  title: {
    fontWeight: "700",
  },
  line2: {},
  line3: {},
  line4: {
    fontSize: 14,
    "& a": {
      color: "#29b6f6",
      "&:hover": {
        color: "#2979ff",
      },
    },
  },
  progressBarContainer: {
    height: "auto",
    margin: "0 auto",
    marginTop: 10,
    maxWidth: 550,
  },
  progressBar: {},
  progressBarPercent: {
    marginTop: 5,
    fontSize: 14,
    color: "#AECEA1",
    textAlign: "start",
  },
}));
