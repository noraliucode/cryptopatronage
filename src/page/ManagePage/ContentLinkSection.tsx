import { Button, TextField } from "@mui/material";
import { useState } from "react";
import {
  Title,
  TitleWrapper,
  Wrapper,
  Text,
  InputWrapper,
} from "../../page/ManagePage";
import { publishLink } from "../../utils/main";
import { ISupporter } from "../../utils/types";

type IProps = {
  creator: string;
  supporters: ISupporter[];
};

const ContentLinkSection = ({ creator, supporters }: IProps) => {
  const [state, setState] = useState({ title: "", link: "" });
  const { title, link } = state;
  const setStateValue = (key: string, value: string) => {
    setState({ ...state, [key]: value });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log("name", name);

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

  return (
    <>
      <TitleWrapper>
        <Title>Publish Content Link</Title>
      </TitleWrapper>
      <TextField
        fullWidth
        value={title}
        id="standard-basic"
        label="Content Title"
        variant="standard"
        placeholder={"The Three Transitions"}
        onChange={handleInputChange}
      />
      <TextField
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
      <InputWrapper>
        <Button variant="contained" onClick={_publishLink}>
          Publish Content Link
        </Button>
      </InputWrapper>
    </>
  );
};

export default ContentLinkSection;
