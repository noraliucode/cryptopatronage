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

type IProps = {
  network: INetwork;
  publishLink: (link: string, title: string) => void;
  hasSupporter: boolean;
  links: IContentLinks;
  loading: boolean;
  updateContent: (_: IContent) => void;
  title: string;
  link: string;
};

const ContentLinkSection = ({
  network,
  publishLink,
  hasSupporter,
  links,
  loading,
  updateContent,
  title,
  link,
}: IProps) => {
  const setStateValue = (key: string, value: string) => {
    const contentTitle = key === "title" ? value : title;
    const contentLink = key === "link" ? value : link;

    updateContent({ contentTitle, contentLink });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setStateValue(name, value);
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
            onClick={() => publishLink(link, title)}
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
