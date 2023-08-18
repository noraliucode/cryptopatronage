import {
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  styled,
} from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { ChangeEvent, useCallback, useState } from "react";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { useApi } from "../../hooks/useApi";
import {
  DECIMALS,
  IS_COMMITTED,
  IS_DELAYED,
  SYMBOL,
} from "../../utils/constants";
import {
  formatTimestamp,
  formatUnit,
  getReserveAmount,
} from "../../utils/helpers";
import { subscribe } from "../../utils/main";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { Modal } from "../Modal";
import { CheckWrapper, DisabledText, Text } from "../../page/ManagePage";
import { useTranslation } from "react-i18next";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import { usePureProxy } from "../../hooks/usePureProxy";

type IProps = {
  open: boolean;
  onClose: () => void;
  selectedCreator: string;
  rate: string | undefined;
  tokenUsdPrice: number;
  isSubscriber: boolean;
  isUsd: boolean;
};

type IState = {
  isCommitted: boolean;
  isDelayed: boolean;
  isSubscribing: boolean;
  isSubscribingSucceeded: boolean;
  isNoFundsExclusivelyConfirmed: boolean;
  isModalOpen: boolean;
  proxyDepositBase: number;
  months: number;
  expiryDate: number;
};

export const HintText = styled("div")(() => ({
  color: "gray",
  fontSize: 11,
}));
const Wrapper = styled("div")(() => ({
  width: 400,
  height: 110,
}));
const WarningText = styled("div")(() => ({
  fontSize: 14,
  lineHeight: 2,
  color: "red",
}));

export const SubscribeModal = (props: IProps) => {
  const {
    onClose,
    open,
    selectedCreator,
    rate,
    tokenUsdPrice,
    isSubscriber,
    isUsd,
  } = props;

  const [state, setState] = useState<IState>({
    isCommitted: true,
    isDelayed: false,
    isSubscribing: false,
    isSubscribingSucceeded: false,
    isNoFundsExclusivelyConfirmed: false,
    isModalOpen: false,
    proxyDepositBase: 0,
    months: 6,
    expiryDate: 0,
  });

  const {
    isCommitted,
    isDelayed,
    isSubscribing,
    isSubscribingSucceeded,
    isNoFundsExclusivelyConfirmed,
    isModalOpen,
    proxyDepositBase,
    months,
    expiryDate,
  } = state;

  const { t } = useTranslation();
  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();

  const { api } = useApi(network);
  const { userPureProxy } = usePureProxy(signer?.address);

  const isSubscribDisabled = !isCommitted && !isNoFundsExclusivelyConfirmed;
  const formattedRate = formatUnit(Number(rate), DECIMALS[network]);

  const handleClose = () => {
    onClose();
  };

  const handleDelayedClick = () => {
    setState((prev) => ({
      ...prev,
      isDelayed: !prev.isDelayed,
    }));
  };

  const handleNoFundsExclusiveClick = () => {
    setState((prev) => ({
      ...prev,
      isNoFundsExclusivelyConfirmed: !prev.isNoFundsExclusivelyConfirmed,
    }));
  };

  const handleClick = useCallback((key: keyof IState) => {
    setState((prev) => {
      let valueObject = {
        [key]: !prev[key],
      };
      if (key === IS_COMMITTED) {
        valueObject = {
          ...valueObject,
          isDelayed: false,
        };
      }

      return {
        ...prev,
        ...valueObject,
      };
    });
  }, []);

  const _subscribe = async () => {
    if (isSubscribingSucceeded) {
      handleClose();
      return;
    }
    if (!injector || !api) return;
    setState((prev) => ({
      ...prev,
      isSubscribing: true,
      isSubscribingSucceeded: false,
    }));
    const setLoading = (value: boolean) => {
      setState((prev) => ({
        ...prev,
        isSubscribing: value,
      }));
    };

    const callback = async () => {
      setState((prev) => ({
        ...prev,
        isSubscribingSucceeded: true,
        isSubscribing: false,
      }));
      // await getSubscribedCreators();
    };

    if (!signer) return;
    const setExpiryDate = (value: number) => {
      if (!value) return;
      setState((prev) => ({
        ...prev,
        expiryDate: value,
      }));
    };

    const result = await subscribe(
      setExpiryDate,
      api,
      selectedCreator,
      signer?.address,
      injector,
      isCommitted,
      network,
      months,
      tokenUsdPrice,
      Number(rate),
      callback,
      setLoading,
      userPureProxy,
      isDelayed,
      isUsd
    );
    if (result?.text) {
      setState((prev) => ({
        ...prev,
        isModalOpen: true,
        proxyDepositBase: Number(result.proxyDepositBase),
      }));
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState((prev) => ({
      ...prev,
      months: Number(event.target.value),
    }));
  };

  const renderContent = () => {
    if (isSubscribingSucceeded)
      return (
        <Wrapper>
          {" "}
          {t("subscribe_modal.Subscribed")}
          <AddToCalendarButton
            name="Subscription expiry Date"
            startDate={formatTimestamp(expiryDate)}
            options={["Apple", "Google", "Yahoo", "iCal"]}
          ></AddToCalendarButton>
        </Wrapper>
      );
    if (isSubscribing)
      return <Wrapper>{t("subscribe_modal.Subscribing...")}</Wrapper>;
    return (
      <Container>
        <Wrapper>
          {isSubscriber
            ? t("subscribe_modal.text6")
            : t("subscribe_modal.text5")}
          <TextField
            fullWidth
            value={months}
            id="standard-basic"
            label="Months"
            variant="standard"
            placeholder={`Input the amount of months you would like to subscribe to this creator`}
            onChange={handleInputChange}
            defaultValue={6}
            type="number"
            inputProps={{ min: 1 }}
          />
          ≈ ${(months * tokenUsdPrice * Number(formattedRate)).toFixed(2)} USD
          <br />
          <br />
          <CheckWrapper onClick={() => handleClick(IS_COMMITTED)}>
            <Checkbox checked={isCommitted} />
            <Text>{t("subscribe_modal.text1")}</Text>
          </CheckWrapper>
          <CheckWrapper onClick={() => handleClick(IS_DELAYED)}>
            <Checkbox
              disabled
              checked={false}
              // disabled={!isCommitted}
              // checked={isCommitted && isDelayed}
            />
            <DisabledText>{t("subscribe_modal.text2")}</DisabledText>
          </CheckWrapper>
          {!isCommitted && (
            <CheckWrapper onClick={handleNoFundsExclusiveClick}>
              <Checkbox checked={isNoFundsExclusivelyConfirmed} />
              <WarningText>{t("subscribe_modal.text4")}</WarningText>
            </CheckWrapper>
          )}
        </Wrapper>
      </Container>
    );
  };

  const renderButton = () => {
    if (isSubscribing) return <CircularProgress size={30} thickness={5} />;
    if (isSubscribingSucceeded) return "Done";
    return "Subscribe";
  };

  const content = () => {
    const total = Number(rate) * months + proxyDepositBase;
    return `Rate: ${formattedRate} ${
      SYMBOL[network]
    } for ${months} months subscription, and desposits ${formatUnit(
      proxyDepositBase,
      DECIMALS[network]
    )} ${SYMBOL[network]} total transferable ${formatUnit(
      total,
      DECIMALS[network]
    )} ${
      SYMBOL[network]
    } is required for this process. Deposits are fees that will be refunded upon cancellation of the subscription.`;
  };

  const dialogPaper = {
    minHeight: "70vh",
    maxHeight: "70vh",
  };

  return (
    <Dialog
      PaperProps={{
        sx: dialogPaper,
      }}
      disableEscapeKeyDown
      onClose={handleClose}
      open={open}
    >
      <Modal
        title="Insufficient Balance"
        content={content()}
        open={isModalOpen}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            isModalOpen: false,
          }))
        }
        action={handleClose}
      />
      <DialogTitle>
        {isSubscriber
          ? t("subscribe_modal.top up")
          : t("subscribe_modal.Subscribe")}
      </DialogTitle>
      <DialogContent dividers>{renderContent()}</DialogContent>
      <DialogActions>
        <Button
          disabled={isSubscribing || isSubscribDisabled}
          style={{ width: 120 }}
          onClick={_subscribe}
          autoFocus
          variant="contained"
        >
          {renderButton()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
