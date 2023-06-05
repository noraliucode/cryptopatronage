import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  IHistory,
  IHistoryList,
  INetwork,
  ISupporter,
} from "../../utils/types";
import { Button } from "@mui/material";
import {
  formatTimestamp,
  formatUnit,
  renderAddress,
} from "../../utils/helpers";
import { DECIMALS } from "../../utils/constants";

export default function BasicTable({
  network,
  committedSupporters,
  uncommittedSupporters,
  pullPaymentHistory,
  pull,
}: {
  network: INetwork;
  committedSupporters?: ISupporter[];
  uncommittedSupporters?: ISupporter[];
  pullPaymentHistory?: IHistoryList;
  pull?: (isCommitted: boolean, supporter?: ISupporter) => void;
}) {
  if (committedSupporters) {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell align="right">Pure Proxy</TableCell>
              <TableCell align="right">Pure Proxy Balance</TableCell>
              <TableCell align="right">Pull Payment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {committedSupporters.map((row: ISupporter) => (
              <TableRow
                key={row.address}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.address && renderAddress(row.address, network, 6)}
                </TableCell>
                <TableCell align="right">
                  {row.pureProxy && renderAddress(row.pureProxy, network, 6)}
                </TableCell>
                <TableCell align="right">
                  {formatUnit(Number(row.pureBalance), DECIMALS[network])}{" "}
                  {network}
                </TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => pull && pull(true, row)}
                    variant="contained"
                  >
                    Pull Payment
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  if (uncommittedSupporters) {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell align="right">Supporter Balance</TableCell>
              <TableCell align="right">Pull Payment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {uncommittedSupporters.map((row: ISupporter) => (
              <TableRow
                key={row.address}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.address && renderAddress(row.address, network, 6)}
                </TableCell>
                <TableCell align="right">
                  {formatUnit(Number(row.supporterBalance), DECIMALS[network])}{" "}
                  {network}
                </TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => pull && pull(true, row)}
                    variant="contained"
                  >
                    Pull Payment
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  if (pullPaymentHistory) {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell align="right">Pure Proxy</TableCell>
              <TableCell align="right">Pure Proxy Balance</TableCell>
              <TableCell align="right">Pull Payment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pullPaymentHistory.map((row: IHistory) => (
              <TableRow
                key={row.supporter}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.supporter && renderAddress(row.supporter, network, 6)}
                </TableCell>
                <TableCell align="right">
                  {row.pure && renderAddress(row.pure, network, 6)}
                </TableCell>
                <TableCell align="right">{formatTimestamp(row.time)}</TableCell>
                <TableCell align="right">
                  {formatUnit(Number(row.amount), DECIMALS[network])} {network}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  return <></>;
}
