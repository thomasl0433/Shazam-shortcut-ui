// import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import axios from 'axios';

function App() {
  const [token, setToken] = useState("");
  const [expired, setExpired] = useState("");

  const scope = "playlist-modify-public"
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_ENV === "DEV" ? "http://localhost:3000" : "https://shazam-shortcut.vercel.app";
  const RESPONSE_TYPE = "token";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";

  const loginString = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}&response_type=${RESPONSE_TYPE}`

  useEffect(() => {
    // cache token
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
    sendToExpress(token);
  }, [])

  const logout = () => {
    setToken("");
    setExpired(null)
    window.localStorage.removeItem("token");
  }

  const sendToExpress = async (token) => {
    // prod url ---> https://shazam-shortcut-pqymwrjaca-uc.a.run.app
    const url = process.env.REACT_APP_ENV === "DEV" ? "http://localhost:8080/receive-token" : "https://shazam-shortcut-pqymwrjaca-uc.a.run.app/receive-token"
    console.log(url)

    await axios.get(url, {
      params: {
        data: token
      }
    }).then((res) => {
      console.log(`Response status: ${res.status}`)
    })
  }

  return (
    <div className="App container flex flex-col mx-auto items-center p-8">
      <h1 className="text-3xl font-bold mb-8 py-4">Shazam Shortcut Login Portal</h1>
      { !token && !expired ?
        <a href={loginString} className="rounded-full p-3 text-gray-100 bg-spotify-green">Login to Spotify</a> 
        : <button className="rounded-full p-3 text-gray-100 bg-spotify-green" onClick={logout}>Logout</button>
      }

      <div className='lg:m-10 m-4 lg:w-1/3'>
        <div className="bg-gray-200 rounded-xl p-6 mb-5 shadow-lg">
                <h3 className="font-bold text-gray-700 mb-2">🚨 Note:</h3>
                <p className="text-gray-500">To use the Shazam shortcut, you must login to Spotify here which will allow you to use the tool as many times as you want for ONE hour ⏳
                </p>
            </div>
      </div>
      
    </div>
  );
}

export default App;
