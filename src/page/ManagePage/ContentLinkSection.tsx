import { Button, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import {
  Title,
  TitleWrapper,
  InputWrapper,
  Wrapper,
  LoadingContainer,
  Content,
  Text,
} from "../../page/ManagePage";
import { publishLink } from "../../utils/main";
import { INetwork, ISupporter } from "../../utils/types";
import { useContentLinks } from "../../hooks/useContentLinks";
import BasicTable from "../../components/Table";

type IProps = {
  creator: string;
  supporters: ISupporter[];
  network: INetwork;
};

const ContentLinkSection = ({ creator, supporters, network }: IProps) => {
  const [state, setState] = useState({ title: "", link: "" });
  const { title, link } = state;
  const setStateValue = (key: string, value: string) => {
    setState({ ...state, [key]: value });
  };

  const { links, loading, getContentLinks } = useContentLinks(creator);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setStateValue(name, value);
  };

  const _publishLink = () => {
    publishLink(
      creator,
      link,
      title,
      supporters.map((supporter) => supporter.address)
    );
  };

  const hasSupporter = supporters.length > 0;

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
            onClick={_publishLink}
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
          <BasicTable network={network} contentLinks={links} />
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
