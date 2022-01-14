import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { SERVER_URL } from '../../constants'


const Lobby = () => {
  const [pack, setPack] = useState([])

  // this.roomId = this.props.location.pathname.replace("/g/", "");
//  const deckQueryString = queryString.parse(this.props.location.search).deck;
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
      <p>dis is da lobby yaya</p>

      {pack && (
        <div>
          {pack.map(({name, img}) => (
            <div>
              <img src={img} alt={name}/>
            </div>
          ))}
        </div>
      )}
    </>
  )

}
export default Lobby