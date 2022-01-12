import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import {PORT} from '.../server.js'
import styled from "styled-components"

function handleCreateLobby({
  e,
  history,
  pack,
  setError,
  setLoading,
}) {
  e.preventDefault()
  setLoading('createLobby')

  axios
    .post(`${PORT}/api/getPack`, {pack})
    .then((res) => {
      if (res.data) {
        setLoading(false)
        setError('')
        createRandomRoom({
          history,
          pack,
          setError,
          setLoading,
        })
      } else {
        setError('This pack could not be found.')
      }
    })
    .catch((err) => {
      setLoading(false)
      setError('This pack does not exist.')
      console.error(err)
    })
}

function getQueries({pack}) {
  let queryString = ''

  if (pack) {
    queryString += `?pack=${pack}`
  }

  return queryString;
}

function createRandomRoom({
  history,
  pack,
  setError,
  setLoading,
}) {
  const random = (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  ).substr(0, 5)

  // check server to make sure random room doesn't already exist
  axios
    .post(`${PORT}/api/checkAvailableRooms`, {roomName: random})
    .then((res) => {
      setLoading(false)
      setError('')

      if (!res.data) {
        history.push(`/l/${random}${getQueries({pack})}`)
      } else {
        createRandomRoom({
          history,
          pack,
          setError,
          setLoading,
        })
      }
    })
    .catch((err) => {
      setError('There was an error on the server. Please try again.')
      console.error(err)
    })
}

const handlePublicPackClick = ({name, pack, setPack}) => {
  if (pack === name) {
    return setPack('')
  }
  setPack(name)
}

const CreateLobby = () => {
  const history = useHistory();
  const [pack, setPack] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [publicPacks, setPublicPacks] = useState([]);
  useEffect(() => {
    axios.get(`${PORT}/api/getApprovedPublicPacks`).then((res) => {
      setPublicPacks(res.data);
    })
  }, [])

  return (
    <>
      <h2>Create lobby</h2>
      <form
        onSubmit={(e) =>
          handleCreateLobby({
            e,
            history,
            pack,
            setError,
            setLoading,
          })
        }
      >
        {publicPacks && (
          <List>
            {publicPacks.map(({name}) => (
              <ListItem key={name}>
                <PublicPackButton
                  type="button"
                  onClick={() => handlePublicPackClick({name, pack, setPack})}
                  style={{color: name === pack ? '#2cce9f' : null}}
                >
                  {name.replace(/-/g, ' ')}
                </PublicPackButton>
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
  )
}

const Flex = styled.div`
  display: flex;
  align-items: center;
`

const ListItem = styled.li`
  color: #fff;
  border-bottom: 1px solid rgb(44, 206, 159);
`

const PublicPackButton = styled.button`
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
`

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
`

export default CreateLobby