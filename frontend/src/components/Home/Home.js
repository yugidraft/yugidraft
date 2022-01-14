import React, { useRef, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../constants.js";
// import { LogoIcon } from "../icons";
import styled, { createGlobalStyle } from "styled-components";

const MIN_ROOM_NAME_CHARS = 2;
const MAX_ROOM_NAME_CHARS = 16;

function handleJoinGame({
  e,
  setLoading,
  joinLobbyInputRef,
  history,
  setErrorMsg,
}) {
  e.preventDefault();
  if (joinLobbyInputRef.current.value.length < MIN_ROOM_NAME_CHARS) {
    setErrorMsg({
      type: "join",
      message: `Room name must be at least ${MIN_ROOM_NAME_CHARS} characters long.`,
    });
    return;
  }
  if (joinLobbyInputRef.current.value.length > MAX_ROOM_NAME_CHARS) {
    setErrorMsg({
      type: "join",
      message: `Room name must be no longer than ${MAX_ROOM_NAME_CHARS} characters.`,
    });
    return;
  }
  setLoading("join");
  axios
    .post(`${SERVER_URL}/api/checkAvailableRooms`, {
      roomName: joinLobbyInputRef.current.value,
    })
    .then((res) => {
      setLoading("");

      // if no response, game doesn't exist, so ask if they want to create it
      if (!res.data) {
        setErrorMsg({ type: "join" });
      } else {
        history.push(`/l/${joinLobbyInputRef.current.value}`);
      }
    })
    .catch((err) => {
      setErrorMsg({
        type: "join",
        message: "There was an error on the server. Please try again.",
      });
      console.error(err);
    });
}

const Home = () => {
  const history = useHistory();
  const joinLobbyInputRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState({});
  const [loading, setLoading] = useState("");
  return (
    <LandingWrapper>
        <GlobalStyle />
        <Heading>
          Yugidraft
        </Heading>
        <Subtitle>Draft and create your own Yu-Gi-Oh! decks</Subtitle>
        <Divider/>
        {/* <Image src={yugi}/> */}
        <Form
          onSubmit={(e) =>
            handleJoinGame({
              e,
              setLoading,
              joinLobbyInputRef,
              history,
              setErrorMsg,
            })
          }
        >
          <JoinLobbyLabel htmlFor="joinlobby">GOT THE LOBBY CODE?</JoinLobbyLabel>
          <JoinLobbyInput
            ref={joinLobbyInputRef}
            id="joinlobby"
            minLength={MIN_ROOM_NAME_CHARS}
            maxLength={MAX_ROOM_NAME_CHARS}
            text="text"
            required
          />
          <PinkButton type="submit" disabled={loading === "join"}>
            Join Lobby
          </PinkButton>
          {errorMsg.type === "join" && !errorMsg.message ? (
            <LobbyExistsMessage>
              Lobby doesn't exist. Would you like to{" "}
              <Link to={`/g/${joinLobbyInputRef.current.value}`}>create it?</Link>
            </LobbyExistsMessage>
          ) : (
            errorMsg.type === "join" &&
            errorMsg.message && <ErrorText>{errorMsg.message}</ErrorText>
          )}
          <OrTextWrap>
            <OrText>OR</OrText>
          </OrTextWrap>
          {/* <BlueButton type="button" to="/games">
            Public Lobbies
          </BlueButton> */}
        </Form>
        <YellowButton to="/create-lobby">Create Lobby</YellowButton>
    </LandingWrapper>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    text-align: center;
    border: 1em solid;
    border-image: linear-gradient(130deg, rgb(50,63,152), rgb(246,224,105), rgb(248,54,116) ) 1;
    background: linear-gradient(129deg, rgba(14,17,40,1) 0%, rgba(40,9,19,1) 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0;
    height: 95vh;
  }
  button,
  input {
    appearance: none;
    border: 0;
  }
`;

const Divider = styled.hr`
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  width: 200px;
  margin-bottom: 2rem;
`

const LandingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  background: linear-gradient(129deg, rgba(14,17,40,1) 0%, rgba(40,9,19,1) 100%);
  padding: 2em;
`;

const Heading = styled.h1`
  width: 100%;
  position: relative;
  margin: 0 0 0.5rem;
  padding: 0 1rem;
  color: white;
  font-size: 2.5rem;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.8rem;
`;

const LobbyExistsMessage = styled.p`
  color: #fff;

  a {
    color: #2cce9f;
  }
`;

const Subtitle = styled.p`
  font-size: 1em;
  color: #fff;
`;

const YellowButton = styled(Link)`
  display: block;
  background: rgb(246,224,105);
  appearance: none;
  color: #000;
  font-size: 1em;
  border: 0;
  padding: 0.7em 1em;
  border-radius: 8px;
  margin: 0.75em 0;
  font-weight: bold;
  transition: opacity 0.25s;
  text-decoration: none;

  &:hover,
  &:focus,
  &:disabled {
    opacity: 0.5;
    outline: 0;
  }
`;

const PinkButton = styled.button`
  display: block;
  appearance: none;
  background: rgb(248,54,116);
  color: #000;
  font-size: 1em;
  border: 0;
  padding: 0.7em 1em;
  border-radius: 8px;
  margin: 1em 0.5em;
  font-weight: bold;
  transition: opacity 0.25s;

  &:hover,
  &:focus,
  &:disabled {
    opacity: 0.5;
    outline: 0;
  }
`;
// const BlueButton = styled(Link)`
//   display: block;
//   appearance: none;
//   background: rgb(64, 224, 208);
//   color: #000;
//   font-size: 1em;
//   border: 0;
//   padding: 0.7em 1em;
//   border-radius: 8px;
//   margin: 1em 0 0.75em;
//   font-weight: bold;
//   transition: opacity 0.25s;
//   text-decoration: none;

//   &:hover,
//   &:focus,
//   &:disabled {
//     opacity: 0.5;
//     outline: 0;
//   }
// `;
const OrTextWrap = styled.p`
  position: relative;
  font-style: italic;
  color: #fff;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-top: 1px solid #fff;
    width: 70px;
    height: 1px;
  }
`;

const OrText = styled.span`
  position: relative;
  background: linear-gradient(129deg, rgba(14,17,40,1) 0%, rgba(40,9,19,1) 100%);
  padding: 0 0.5em;
`;

const JoinLobbyInput = styled.input`
  appearance: none;
  border-radius: 8px;
  padding: 0.35em 0.25em;
  border: 2px solid transparent;
  text-align: center;
  transition: border-color 0.25s;
  max-width: 120px;
  font-size: 1em;

  &:focus {
    outline: 0;
    border-color: #2cce9f;
  }
`;
const JoinLobbyLabel = styled.label`
  display: block;
  text-align: left;
  text-transform: uppercase;
  font-size: 0.813em;
  color: #fff;
  margin-bottom: 0.5em;
`;

const Form = styled.form`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default Home;
