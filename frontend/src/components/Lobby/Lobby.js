import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { SERVER_URL } from '../../constants'


const Lobby = () => {
  const [pack, setPack] = useState([])

  useEffect(() => {
    axios.get(`${SERVER_URL}/api/getInitialCards`).then((res) => {
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