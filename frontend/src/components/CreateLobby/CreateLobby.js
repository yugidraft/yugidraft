import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../constants";
import PrivacyCheck from "../PrivacyCheck/PrivacyCheck";
import styled, { createGlobalStyle } from "styled-components";

function handleCreateLobby({
  e,
  history,
  deck,
  setError,
  setLoading,
  isPrivate,
}) {
  e.preventDefault();
  setLoading("createLobby");

  axios
    .post(`${SERVER_URL}/api/getDeck`, { deck })
    .then((res) => {
      if (res.data) {
        setLoading(false);
        setError("");
        createRandomRoom({
          history,
          deck,
          setError,
          setLoading,
          isPrivate,
        });
      } else {
        setError("This deck could not be found.");
      }
    })
    .catch((err) => {
      setLoading(false);
      setError("This deck does not exist.");
      console.error(err);
    });
}

function getQueries({ deck, isPrivate }) {
  let queryString = "";

  if (deck) {
    queryString += `?deck=${deck}`;
  }
  if (isPrivate) {
    if (deck) {
      queryString += "&private=1";
    } else {
      queryString += "?private=1";
    }
  }

  return queryString;
}

function createRandomRoom({
  history,
  deck,
  setError,
  setLoading,
  isPrivate,
}) {
  const random = (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  ).substring(0, 5);

  // check server to make sure random room doesn't already exist
  axios
    .post(`${SERVER_URL}/api/checkAvailableRooms`, { roomName: random })
    .then((res) => {
      console.log('were in here', res)
      setLoading(false);
      setError('');

      if (!res.data) {
        history.push(`/l/${random}${getQueries({ deck, isPrivate })}`);
      } else {
        createRandomRoom({
          history,
          deck,
          setError,
          setLoading,
          isPrivate,
        });
      }
    })
    .catch((err) => {
      setError("There was an error on the server. Please try again.");
      console.error(err);
    });
}

const handlePublicDeckClick = ({ name, deck, setDeck }) => {
  if (deck === name) {
    return setDeck("");
  }
  setDeck(name);
};

const CreateLobby = () => {
  const history = useHistory();
  const [deck, setDeck] = useState("safe-for-work");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [publicDecks, setPublicDecks] = useState([]);
  useEffect(() => {
    axios.post(`${SERVER_URL}/api/getPublicDecks`).then((res) => {
      console.log(res.data);
      setPublicDecks(res.data);
    });
  }, []);
  return (
    <Wrapper>
      <GlobalStyle />
      <MainHeading>Create Lobby</MainHeading>
      <Form
        onSubmit={(e) =>
          handleCreateLobby({
            e,
            history,
            deck,
            setError,
            setLoading,
            isPrivate,
          })
        }
      >
        <Subtitle>
          Choose a pack
        </Subtitle>
        {publicDecks && (
          <List>
            {publicDecks.map(({ name }) => (
              <ListItem key={name}>
                <PublicDeckButton
                  type="button"
                  onClick={() => handlePublicDeckClick({ name, deck, setDeck })}
                  style={{ color: name === deck ? "#2cce9f" : null }}
                >
                  {name.replace(/-/g, " ")}
                </PublicDeckButton>
              </ListItem>
            ))}
          </List>
        )}
        <Subtitle>
          Search for pack
        </Subtitle>
        <Divider>
          <Input
            id="nameOfDeck"
            type="text"
            onKeyUp={(e) => setDeck(e.target.value)}
            maxLength="20"
          />
        </Divider>
        {error && <ErrorText>{error}</ErrorText>}
        <PrivacyCheck
          setIsPrivate={setIsPrivate}
          title="game"
          toastText="If checked, this game will not be listed under public lobbies."
        />
        <Flex>
          <WhiteButton to="/">Back</WhiteButton>
          <GreenButton>Create</GreenButton>
        </Flex>
      </Form>
    </Wrapper>
  );
};

const GlobalStyle = createGlobalStyle`
  html {
    position: static;
    overflow: visible;
  }
  body {
    text-align: center;
    background: linear-gradient(129deg, rgba(14,17,40,1) 0%, rgba(40,9,19,1) 100%);
    border: 1em solid;
    border-image: linear-gradient(130deg, rgb(50,63,152), rgb(246,224,105), rgb(248,54,116) ) 1;
    padding: 2em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 95vh;
  }
  button,
  input {
    appearance: none;
    border: 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  appearance: none;
  font-size: 1em;
  border: 0;
  margin: 0;
  padding: 0.5em 0 0.3em;
  background: transparent;
  border-bottom: 1px solid #fff;
  transition: border-color 0.25s;
  border-radius: 0;
  color: #fff;

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-text-fill-color: #fff;
    -webkit-box-shadow: 0 0 0px 1000px #000 inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  &:hover,
  &:focus {
    outline: 0;
    border-color: #2cce9f;
  }
`;

const Divider = styled.div`
  margin-bottom: 1em;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  width: 150%;
  max-width: 300px;
  max-height: 175px;
  overflow: auto;
  margin: 0;
  border: 1px solid #2cce9f;
  border-radius: 8px;
  max-height: 139px;
  overflow: auto;
  margin-bottom: 1em;
  min-height: 145px;
`;

const ListItem = styled.li`
  color: #fff;
  border-bottom: 1px solid rgb(44, 206, 159);
`;

const PublicDeckButton = styled.button`
  apperance: none;
  font-size: 1em;
  background: 0;
  color: #fff;
  padding: 0.5em 0;
  text-transform: capitalize;
  transition: color 0.25s;
  width: 100%;

  &:hover,
  &:focus {
    outline: 0;
    color: #2cce9f;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5em;
  color: #fff;
`;

const MainHeading = styled.h1`
  color: #fff;
  margin: 0 0 1em;
  font-weight: normal;
  font-size: 2em;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.8rem;
`;

const Wrapper = styled.div`
  min-height: 100%;
  background: linear-gradient(129deg, rgba(14,17,40,1) 0%, rgba(40,9,19,1) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WhiteButton = styled(Link)`
  display: block;
  appearance: none;
  background: #fff;
  color: #000;
  font-size: 1em;
  border: 0;
  padding: 0.7em 1em;
  border-radius: 8px;
  margin: 1em 0.5em;
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

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

export default CreateLobby;
