export const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://yugidraft.herokuapp.com/";

export const CLIENT_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://yugidraft.herokuapp.com/";

export const MAX_PLAYERS = 8;
