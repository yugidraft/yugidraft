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
  joinGameInputRef,
  history,
  setErrorMsg,
}) {
  e.preventDefault();
  if (joinGameInputRef.current.value.length < MIN_ROOM_NAME_CHARS) {
    setErrorMsg({
      type: "join",
      message: `Room name must be at least ${MIN_ROOM_NAME_CHARS} characters long.`,
    });
    return;
  }
  if (joinGameInputRef.current.value.length > MAX_ROOM_NAME_CHARS) {
    setErrorMsg({
      type: "join",
      message: `Room name must be no longer than ${MAX_ROOM_NAME_CHARS} characters.`,
    });
    return;
  }
  setLoading("join");
  axios
    .post(`${SERVER_URL}/api/checkAvailableRooms`, {
      roomName: joinGameInputRef.current.value,
    })
    .then((res) => {
      setLoading("");

      // if no response, game doesn't exist, so ask if they want to create it
      if (!res.data) {
        setErrorMsg({ type: "join" });
      } else {
        history.push(`/g/${joinGameInputRef.current.value}`);
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

const Landing = () => {
  const history = useHistory();
  const joinGameInputRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState({});
  const [loading, setLoading] = useState("");
  return (
    <LandingWrapper>
      <GlobalStyle />
      <Heading>
        Yugidraft
      </Heading>
      <Form
        onSubmit={(e) =>
          handleJoinGame({
            e,
            setLoading,
            joinGameInputRef,
            history,
            setErrorMsg,
          })
        }
      >
        <JoinGameLabel htmlFor="joingame">GOT THE LOBBY CODE?</JoinGameLabel>
        <JoinGameInput
          ref={joinGameInputRef}
          id="joingame"
          minLength={MIN_ROOM_NAME_CHARS}
          maxLength={MAX_ROOM_NAME_CHARS}
          text="text"
          required
        />
        <GreenButton type="submit" disabled={loading === "join"}>
          Join Lobby
        </GreenButton>
        {errorMsg.type === "join" && !errorMsg.message ? (
          <GameExistsMessage>
            Lobby doesn't exist. Would you like to{" "}
            <Link to={`/g/${joinGameInputRef.current.value}`}>create it?</Link>
          </GameExistsMessage>
        ) : (
          errorMsg.type === "join" &&
          errorMsg.message && <ErrorText>{errorMsg.message}</ErrorText>
        )}
        <OrTextWrap>
          <OrText>OR</OrText>
        </OrTextWrap>
        <BlueButton type="button" to="/games">
          Public Lobbies
        </BlueButton>
      </Form>
      <OrangeButton to="/create-lobby">Create Lobby</OrangeButton>
    </LandingWrapper>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    text-align: center;
    border: 1em solid;
    border-image: linear-gradient(90deg, rgb(64,224,208), rgb(255,140,0), rgb(255,0,128) ) 1;
    background: #000;
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

const LandingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  background-color: #000;
  padding: 2em;
`;
const Heading = styled.h1`
  width: 100%;
  position: relative;
  margin: 0 0 1rem;
  padding: 0 1rem;
  color: white;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.8rem;
`;

const GameExistsMessage = styled.p`
  color: #fff;

  a {
    color: #2cce9f;
  }
`;

const OrangeButton = styled(Link)`
  display: block;
  background: rgb(255, 140, 0);
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

const GreenButton = styled.button`
  display: block;
  appearance: none;
  background: #2cce9f;
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
const BlueButton = styled(Link)`
  display: block;
  appearance: none;
  background: rgb(64, 224, 208);
  color: #000;
  font-size: 1em;
  border: 0;
  padding: 0.7em 1em;
  border-radius: 8px;
  margin: 1em 0 0.75em;
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
  background: #000;
  padding: 0 0.5em;
`;

const JoinGameInput = styled.input`
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
const JoinGameLabel = styled.label`
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

export default Landing;
