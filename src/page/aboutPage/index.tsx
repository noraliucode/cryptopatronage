import React from "react";
import { Root } from "../creatorsPage";
import styled from "@emotion/styled";

export const Container = styled("div")(() => ({
  maxWidth: 700,
  margin: "auto",
  textAlign: "left",
}));
export const Title = styled("div")(() => ({
  color: "white",
  fontSize: 28,
  fontWeight: 500,
  marginBottom: 20,
}));
export const Subtitle = styled("div")(() => ({
  color: "white",
  fontSize: 20,
  fontWeight: 800,
  marginBottom: 20,
}));
export const Text = styled("div")(() => ({
  color: "white",
  fontSize: 18,
  fontWeight: 500,
  marginBottom: 50,
  lineHeight: 1.5,
}));
export const ItalicStyle = styled("div")(() => ({
  fontStyle: "italic",
}));

export const AboutPage = () => {
  const embedIds = ["Z3Fk3_9zS64", "crj_SqbczMk"];

  return (
    <Root>
      <Container>
        <Title>About CryptoPatronage</Title>
        <Text>
          CryptoPatronage is a platform that helps creators build a membership
          program by offering their followers exclusive content and a closer
          connection with their community.
        </Text>

        <Subtitle>Why This Exists</Subtitle>
        <Text>
          In early 2022, we started an experiment that would turn into the
          Shokunin Network, with a core premise that resource distribution in
          the Kusama Network ecosystem was too centralized and bottlenecked on
          majority agreement.
          <br />
          <br />
          Shokunin was fun while it’s limited resources lasted and supported a
          handful of notable projects and builders in their early stages, but it
          was still very much limited in it’s potential reach due to the fact
          that it was pulling from a finite pool of resources - it didn’t solve
          the problem it set out to solve, it was not sustainable.
          <br />
          <br />
          CryptoPatronage takes the lessons learned from running Shokunin and
          moves a step further towards it’s initial goals using the same
          techniques, but significantly more automation and accessibility.
          Instead of a collective treasury to fund multiple creators, the
          CryptoPatronage platform allows anyone to securely (and revokably)
          earmark funds to support creators and builders for the long term, and
          it allows creators to tap on their supporters for consistent funding,
          instead of intermittent and unreliable comission/NFT/contract based
          work.
          <br />
          <br />
          Think Patreon, OnlyFans et al., but without the hassle of a company
          controlling who is allowed to use their platform. CryptoPatronage is
          not unmoderatable, and does not intend to be unmoderated, but the
          underlying protocol it uses is entirely open and public, and does not
          require using our frontend.
        </Text>
        <Subtitle>For Patrons</Subtitle>
        <Text>
          <ul>
            <li>
              Publicly show your support and commitment to your chosen creators.
            </li>
            <li>
              Have confidence that your support will go directly to a creator
              with no middleman, and that you will spend no more than you have
              committed.
            </li>
            <li>
              Become known to those you support - and potentially be rewarded
              for it.
            </li>
          </ul>
          <ItalicStyle>
            We do not yet provide a service to support with cash or
            credit/debit, so if that is what the creators you support want or
            need, we are likely not the right solution for them, or you!
          </ItalicStyle>
        </Text>
        <Subtitle>For Creators</Subtitle>
        <Text>
          There are many options in the cryptocurrency ecosystem to monetize
          your work and make an income regardless of where you are and what you
          do - CryptoPatronage simply tries to provide a more human and
          considerate approach, based on the needs of real creators, instead of
          assuming all of your work can be tokenized as an NFT.
          <br />
          <br />
          CryptoPatronage is similar to token streaming protocols that already
          exist, but with permissionless discovery that allows potential
          supporters to discover your profile and support you on-platform,
          alongside ways to link directly to your profile from off-platform,
          similarly to our non-blockchain-based equivalents.
          <br />
          <br />
          By default, we take no platform fees, and you only pay blockchain
          transaction fees when pulling your earnings from supporters - which,
          on the networks we operate on, are negligible, even for creators not
          based in affluent locales.
          <br />
          <br />
          If you want to have an experience similar to traditional crowdfunding
          websites, we (will soon) provide automatic payment execution as an
          always-optional, fee-added service, at a rate that outcompetes all
          comparable non-blockchain-based equivalents.
          <br />
          <br />
          <ItalicStyle>
            We do not yet provide any service to cash out your crypto to fiat
            money, so, in practice if you do not already have affordable
            channels available for you to do so, we are likely not a solution
            that is right for you!{" "}
          </ItalicStyle>
          <br />
          CryptoPatronage is more useful, however, if you are based in any
          jurisdiction that has ready access to physical ways to cash out your
          crypto, has a community that accepts crypto for payment, or you simply
          want to get paid in and hold cryptocurrency instead of cash.
        </Text>
        {embedIds.map((id) => (
          <div className="videowrapper">
            <iframe
              src={`https://www.youtube.com/embed/${id}?cc_load_policy=1`}
              allowFullScreen
              title="Embedded youtube"
            />
          </div>
        ))}
      </Container>
    </Root>
  );
};
