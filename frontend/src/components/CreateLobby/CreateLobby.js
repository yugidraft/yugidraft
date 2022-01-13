import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { PORT } from ".../server.js";
import styled from "styled-components";

function handleCreateLobby({ e, history, set, setError, setLoading }) {
  e.preventDefault();
  setLoading("createLobby");

  axios
    .post(`${PORT}/api/getSet`, { set })
    .then((res) => {
      if (res.data) {
        setLoading(false);
        setError("");
        createRandomRoom({
          history,
          set,
          setError,
          setLoading,
        });
      } else {
        setError("This pack could not be found.");
      }
    })
    .catch((err) => {
      setLoading(false);
      setError("This pack does not exist.");
      console.error(err);
    });
}

function getQueries({ set }) {
  let queryString = "";

  if (set) {
    queryString += `?set=${set}`;
  }

  return queryString;
}

function createRandomRoom({ history, set, setError, setLoading }) {
  const random = (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  ).substr(0, 5);

  // check server to make sure random room doesn't already exist
  axios
    .post(`${PORT}/api/checkAvailableRooms`, { roomName: random })
    .then((res) => {
      setLoading(false);
      setError("");

      if (!res.data) {
        history.push(`/l/${random}${getQueries({ set })}`);
      } else {
        createRandomRoom({
          history,
          set,
          setError,
          setLoading,
        });
      }
    })
    .catch((err) => {
      setError("There was an error on the server. Please try again.");
      console.error(err);
    });
}

const handlePublicSetClick = ({ name, set, setSet }) => {
  name = set.set_name;
  if (set === name) {
    return setSet("");
  }
  setSet(name);
};

const CreateLobby = () => {
  const history = useHistory();
  const [set, setSet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [publicSets, setPublicSets] = useState([]);
  useEffect(() => {
    axios.get(`${PORT}/api/getApprovedPublicSets`).then((res) => {
      setPublicSets(res.data);
    });
  }, []);

  return (
    <>
      <h2>Create lobby</h2>
      <form
        onSubmit={(e) =>
          handleCreateLobby({
            e,
            history,
            set,
            setError,
            setLoading,
          })
        }
      >
        {publicSets && (
          <List>
            {publicSets.map(({ name }) => (
              <ListItem key={name}>
                <PublicSetButton
                  type="button"
                  onClick={() => handlePublicSetClick({ name, set, setSet })}
                  style={{ color: name === set ? "#2cce9f" : null }}
                >
                  {name.replace(/-/g, " ")}
                </PublicSetButton>
              </ListItem>
            ))}
          </List>
        )}
        <Flex>
          <button to="/">Back</button>
          <button>Create</button>
        </Flex>
      </form>
    </>
  );
};

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const ListItem = styled.li`
  color: #fff;
  border-bottom: 1px solid rgb(44, 206, 159);
`;

const PublicSetButton = styled.button`
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

const List = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
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

export default CreateLobby;
