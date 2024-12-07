import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import format from "date-fns/format";

import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

import { useToggle } from "hooks";
import { NumericText } from "components";

const useStyles = makeStyles((theme) => ({
  logsTable: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(3),
  },
  tableCell: {
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(3),
  },
  buttonColumn: {
    textAlign: "center",
  },
  button: {
    marginBottom: 10,
    fontWeight: 600,
  },
  text: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 13,
    },
  },
}));

const MIN_COLLAPSE_ELEMENTS = 5;

const LogsTable = ({ logs }) => {
  const classes = useStyles();
  const [showMore, toggleShowMore] = useToggle(false);
  const [data, setData] = useState(logs.slice(0, MIN_COLLAPSE_ELEMENTS));

  useEffect(() => {
    if (showMore) {
      setData(logs);
    } else {
      setData(logs.slice(0, MIN_COLLAPSE_ELEMENTS));
    }
  }, [showMore, logs]);

  return (
    <table className={classes.logsTable}>
      {data.map(({ date, amount, asset, type }) => (
        <tr key={date}>
          <td className={classes.tableCell}>
            <Typography color="secondary" className={classes.text}>
              {format(date * 1000, "dd.MM.yyyy hh:mm a ")}
            </Typography>
          </td>
          <td className={classes.tableCell}>
            {amount ? (
              <Typography color="secondary" className={classes.text}>
                <NumericText value={amount} suffix={asset} precision={2} />
              </Typography>
            ) : (
              "-"
            )}
          </td>
          <td className={classes.tableCell}>
            <Typography color="secondary" className={classes.text}>
              {type}
            </Typography>
          </td>
        </tr>
      ))}

      {logs.length > MIN_COLLAPSE_ELEMENTS && (
        <tr>
          <td className={classes.buttonColumn} colSpan={3}>
            <Link component="button" href="/" onClick={toggleShowMore} className={classes.button}>
              {showMore ? "Show less" : "Show more"}
            </Link>
          </td>
        </tr>
      )}
    </table>
  );
};

LogsTable.propTypes = {
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      amount: PropTypes.shape({
        decimal: PropTypes.string,
      }),
      asset: PropTypes.string,
      kind: PropTypes.string,
    })
  ).isRequired,
};

export default LogsTable;
