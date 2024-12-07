import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Box, LinearProgress as MuiLinearProgress } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  loading: {
    "& .MuiLinearProgress-barColorPrimary": {
      backgroundColor: "#8f9194",
    },
  },
}));

const LinearProgress = ({ variant }) => {
  const classes = useStyles();
  return (
    <Box>
      <div className={classes.loading}>
        <MuiLinearProgress variant={variant} />
      </div>
    </Box>
  );
};

LinearProgress.propTypes = {
  variant: PropTypes.string,
};

LinearProgress.defaultProps = {
  variant: "query",
};

export default LinearProgress;
