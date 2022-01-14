import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { SERVER_URL } from '../../constants'
import styled, { createGlobalStyle } from 'styled-components'
import FileSaver from 'file-saver';

const Lobby = () => {
  const [pack, setPack] = useState([])
  const [cardList, setCardList] = useState([])
  const [cardName, setCardName] = useState('')


  const handleClick = e => {
    // setCardName(e.target.alt)
    setCardList([...cardList, { cardName: e.target.alt }]);
    console.log(cardList)
  }

  const handleDownload = () => {
    const deck = Object.values(cardList)
    var blob = new Blob([JSON.stringify(deck)], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "deck.txt");
  }

  useEffect(() => {
    axios
      .post(`${SERVER_URL}/api/getInitialCards`, {
        deckName: "2013 Collectible Tins Wave 2",
        roomId: "mfqsc",
      })
      .then((res) => {

        setPack(res.data);
      });

  }, []);


  return (
    <>
      <GlobalStyle/>
      <Container>
        <Heading>Create your deck!</Heading>
        <Flex>
          <Subtitle>Pick your cards</Subtitle>
          {pack && (
            <CardFlex>
              {pack.map(({name, img }) => (
                  <Image src={img} alt={name} onClick={(e) => handleClick(e)}/>
              ))}
            </CardFlex>
          )}
        </Flex>
        <List>
          {cardList.map((x,i) => (
            <ListItem key={i}>
              {x.cardName}
            </ListItem>
          ))}
        </List>
        <Button onClick={() => handleDownload()}>Download</Button>
      </Container>
    </>
  )

}

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
    height: 88vh;
  }
`;

const Container = styled.div`
  margin: 20px;
  display: grid;
  grid-template-columns: 30% 30% 10% 25%;
  grid-template-rows: auto;
  gap: 15px 10px;
  grid-template-areas:
    "h h . d"
    "c c . s"
    "c c . s"
    "c c . s";
`
const Heading = styled.h1`
  grid-area: h;
  width: 100%;
  position: relative;
  margin: 0 0 1rem;
  padding: 0 1rem;
  color: white;
`;

const List = styled.ul`
  grid-area: s;
  list-style: none;
  padding: 0;
  margin: 0;
  border: 3px solid #2cce9f;
  border-radius: 8px;
  overflow: scroll;
  max-height: 640px;
`;

const ListItem = styled.li`
  color: #fff;
  padding: 5px;
  border-bottom: 3px solid rgb(44, 206, 159);
`;

const CardFlex = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  height: 70vh;
  overflow: scroll;
`;

const Flex = styled.div`
  grid-area: c;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 3px solid;
  border-image: linear-gradient(130deg, rgb(248,54,116), rgb(246,224,105), rgb(50,63,152) ) 1;
  `;

const Image = styled.img`
  max-width: 250px;
  height: auto;
  margin: auto;
  margin-bottom: 20px;
  &:hover {
    cursor: pointer;
  }
`
const Subtitle = styled.p`
  font-size: 1.5em;
  color: #fff;
`;

const Button = styled.button`
  grid-area: d;
  background: rgb(64, 224, 208);
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
  cursor: pointer;

  &:hover,
  &:focus,
  &:disabled {
    opacity: 0.5;
    outline: 0;
  }
`;


export default Lobby