import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  IContentLink,
  IContentLinks,
  IHistory,
  IHistoryList,
  INetwork,
  ISupporter,
} from "../../utils/types";
import { Button, styled } from "@mui/material";
import {
  convertToCSV,
  formatTimestampClear,
  formatUnit,
  renderAddress,
  toShortAddress,
} from "../../utils/helpers";
import { DECIMALS } from "../../utils/constants";
import { InputWrapper, Text } from "../../page/ManagePage";

export const LinkText = styled("div")(() => ({
  color: "#29b6f6",
}));

export default function BasicTable({
  network,
  committedSupporters,
  uncommittedSupporters,
  pullPaymentHistory,
  contentLinks,
  pull,
  downloadBackupCode,
}: {
  network: INetwork;
  committedSupporters?: ISupporter[];
  uncommittedSupporters?: ISupporter[];
  pullPaymentHistory?: IHistoryList;
  contentLinks?: IContentLinks;
  pull?: (isCommitted: boolean, supporter?: ISupporter) => void;
  downloadBackupCode?: () => void;
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
              <TableCell>Supporter</TableCell>
              <TableCell align="right">Pure Proxy</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Extrinsic Hash</TableCell>
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
                <TableCell align="right">
                  {formatTimestampClear(row.time)}
                </TableCell>
                <TableCell align="right">
                  {formatUnit(Number(row.amount), DECIMALS[network])} {network}
                </TableCell>
                <TableCell align="right">
                  <a
                    target="blank"
                    href={`https://${network}.subscan.io/extrinsic/${row.tx}`}
                  >
                    <LinkText>{toShortAddress(row.tx)}</LinkText>
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (contentLinks) {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="left">Content</TableCell>
              <TableCell align="left">Encrypted Content</TableCell>
              <TableCell align="left">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contentLinks.map((row: IContentLink, index: number) => (
              <TableRow
                key={`${row.title}_${index}_${row.decryptedContent}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>

                <TableCell align="left">
                  {row.decryptedContent ? (
                    <a target="blank" href={row.decryptedContent}>
                      <LinkText>{row.decryptedContent}</LinkText>
                    </a>
                  ) : (
                    <Text>Subscribe to view the content link</Text>
                  )}
                </TableCell>

                <TableCell component="th" scope="row">
                  {toShortAddress(row.encryptedContent)}
                </TableCell>

                <TableCell component="th" scope="row">
                  {formatTimestampClear(row.date)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <InputWrapper>
          <Button onClick={downloadBackupCode} variant="contained">
            Export backup code
          </Button>
        </InputWrapper>
      </TableContainer>
    );
  }
  return <></>;
}
