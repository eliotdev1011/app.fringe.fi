import { Box } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
import { useStyles } from "./useStyles";

export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 30,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "green",
  },
}));

const IncentivesBar = () => {
  const classes = useStyles();
  const line1 = process.env.REACT_APP_INCENTIVE_LINE_1;
  const line2 = process.env.REACT_APP_INCENTIVE_LINE_2;
  const line3 = process.env.REACT_APP_INCENTIVE_LINE_3;
  const line4 = process.env.REACT_APP_INCENTIVE_LINE_4;
  const percent = process.env.REACT_APP_INCENTIVE_PERCENT;
  const percentText = process.env.REACT_APP_INCENTIVE_PERCENT_TEXT;

  const space = window.innerWidth < 550 ? "&nbsp;&nbsp;" : "&nbsp;&nbsp;&nbsp;&nbsp;";
  const percentTextHtml = percentText.replace(/^ +/, (match) => match.replace(/ /g, space));

  return (
    <Box className={classes.rootContainer}>
      <Box className={classes.title}>{line1}</Box>
      <Box className={classes.line2}>{line2}</Box>
      <Box className={classes.line3}>{line3}</Box>
      <Box className={classes.progressBarContainer}>
        <Box className={classes.progressBar}>
          <BorderLinearProgress variant="determinate" value={percent} />
        </Box>
        <Box
          className={classes.progressBarPercent}
          dangerouslySetInnerHTML={{
            __html: percentTextHtml,
          }}
        />
      </Box>
      <Box className={classes.line4} dangerouslySetInnerHTML={{ __html: line4 }} />
    </Box>
  );
};

export default IncentivesBar;
