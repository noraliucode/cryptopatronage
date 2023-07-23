import { Button, CircularProgress, TextField } from "@mui/material";
import {
  Title,
  TitleWrapper,
  InputWrapper,
  Wrapper,
  LoadingContainer,
  Content,
  Text,
} from "../../page/ManagePage";
import { IContent, IContentLinks, INetwork } from "../../utils/types";
import BasicTable from "../../components/Table";
import {
  convertToCSV,
  downloadBackupCode,
  getUserTempKey,
} from "../../utils/helpers";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { useState } from "react";

type IProps = {
  publishLink: (link: string, title: string, callback: () => void) => void;
  hasSupporter: boolean;
  links: IContentLinks;
  loading: boolean;
};

const ContentLinkSection = ({
  publishLink,
  hasSupporter,
  links,
  loading,
}: IProps) => {
  const [state, setState] = useState({
    title: "",
    link: "",
  });
  const setStateValue = (key: string, value: string) => {
    setState({ ...state, [key]: value });
  };

  const { signer, network } = useWeb3ConnectedContext();
  const { title, link } = state;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setStateValue(name, value);
  };

  const _downloadBackupCode = async () => {
    if (!signer) return;
    downloadBackupCode(signer?.address);
  };

  const resetLinkInfo = () => {
    setState({ ...state, title: "", link: "" });
  };

  return (
    <>
      <TitleWrapper>
        <Title>Publish Content Link</Title>
      </TitleWrapper>
      <TextField
        name={"title"}
        fullWidth
        value={title}
        id="standard-basic"
        label="Content Title"
        variant="standard"
        placeholder={"The Three Transitions"}
        onChange={handleInputChange}
      />
      <TextField
        name={"link"}
        fullWidth
        value={link}
        id="standard-basic"
        label="Content Link"
        variant="standard"
        placeholder={
          "https://vitalik.eth.limo/general/2023/06/09/three_transitions.html"
        }
        onChange={handleInputChange}
      />
      <Wrapper>
        <InputWrapper>
          <Button
            variant="contained"
            onClick={() => publishLink(link, title, resetLinkInfo)}
            disabled={!hasSupporter}
          >
            Publish Content Link
          </Button>
        </InputWrapper>
      </Wrapper>

      <TitleWrapper>
        <Title>Published Content Links</Title>
      </TitleWrapper>

      <Wrapper>
        {loading ? (
          <LoadingContainer>
            <CircularProgress size={30} thickness={5} />
          </LoadingContainer>
        ) : links.length > 0 ? (
          <BasicTable
            downloadBackupCode={_downloadBackupCode}
            network={network}
            contentLinks={links}
          />
        ) : (
          <Content>
            <Text>N/A</Text>
          </Content>
        )}
      </Wrapper>
    </>
  );
};

export default ContentLinkSection;
