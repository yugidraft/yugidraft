import React, { useState, useEffect } from 'react'
// import axios from 'axios'
import { SERVER_URL } from '../../constants'


const Lobby = () => {
  const [pack, setPack] = useState(null)

  async function fetchPack() {
    const path = `${SERVER_URL}/`
    const res = await fetch(path)
    const json = await res.json()

    const img = json.img
    const name = json.name

    setPack({
      img,
      name
    })
  }

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
      <form onSubmit={e => {
        e.preventDefault()
        fetchPack()
      }}>
        <button type="submit">open pack</button>
      </form>


    </>
  )

}

export default Lobby