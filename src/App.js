import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import idl from './idl.json';
import "./App.css";

// Mude isso para seu Twitter se quiser.
const TWITTER_HANDLE = "thiagoxvIII";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  "https://media.giphy.com/media/xLzOrO1e19V3q/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnR2a3pkMDR5cWttdG9vYjk5NW1uMW4xNjJxanlwcTJqZjB2dW5tcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/12K8GGWstl229G/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2hrMW13ODBwdTYzaHpjZXBqMTdld3J3d3Bwcm5ocXJvdDZ5dmY3eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LjaHsegnkiCNRZsEXF/giphy.gif",
  "https://media.giphy.com/media/ZPNDQPf9vRYV9h6WZ2/giphy.gif",
];;

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const [gifList, setGifList] = useState([]);
  /*
   * Essa função possui a lógica para definir se a Phantom Wallet
   * está conectada ou não
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet encontrada!");

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
          "Conectado com a Chave Pública:",
          response.publicKey.toString()
        );
        /*
        * Define a chave pública do usuário no estado para ser usado posteriormente!
        */
        setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Objeto Solana não encontrado! Instale a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
  
    if (solana) {
      const response = await solana.connect();
      console.log(
        "Conectado com a Chave Pública:",
        response.publicKey.toString()
      );
      setWalletAddress(response.publicKey.toString());
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log("Gif link:", inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue("");
    } else {
      console.log("Input vazio. Tente novamente.");
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Conecte sua carteira
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Entre com o link do gif!!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Enviar
        </button>
      </form>
      <div className="gif-grid">
        {/* Map através da 'gifList' ao invés da 'TEST_GIFS' */}
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Obtendo lista de GIFs...");
  
      // Chama o programa da Solana aqui.
  
      // Define o estado
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">Encontre o One Piece</p>
          <p className="sub-text">A última ilha se encontra no metaverso</p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`feito com ❤️ por @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;