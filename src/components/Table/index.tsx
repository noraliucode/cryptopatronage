import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  IProxyParsedSupporter,
  IProxyParsedSupporters,
} from "../../utils/types";
import { Button } from "@mui/material";
import { renderAddress } from "../../utils/helpers";

export default function BasicTable({
  pull,
  network,
  committedSupporters,
}: {
  pull: (isCommitted: boolean, supporter?: IProxyParsedSupporter) => void;
  network: string;
  committedSupporters: IProxyParsedSupporters;
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell align="right">Balance</TableCell>
            {/* <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell> */}
            <TableCell align="right">Pull Payment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {committedSupporters.map((row: IProxyParsedSupporter) => (
            <TableRow
              key={row.supporter}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.supporter && renderAddress(row.supporter, network, 6)}
              </TableCell>
              <TableCell align="right">{row.pureBalance}</TableCell>
              {/* <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell> */}
              <TableCell align="right">
                <Button onClick={() => pull(true, row)} variant="contained">
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
