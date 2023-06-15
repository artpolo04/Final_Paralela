import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const JugadoresSR = () => {
  const [nombreJugador, setNombreJugador] = useState("");
  const [deckId, setDeckId] = useState("");
  const [cartaAdicional, setCartaAdicional] = useState(null);
  const [cartasDibujadas, setCartasDibujadas] = useState([]);

  const handleInputChange = (event) => {
    setNombreJugador(event.target.value);
  };

  const guardarNombreJugador = async () => {
    try {
      const response = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      const { deck_id } = response.data;
      setDeckId(deck_id);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const dibujarCartas = async () => {
    try {
      const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`;
      const response = await axios.get(url);
      const { cards } = response.data;
      setCartasDibujadas(cards);
      setCartaAdicional(null);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const pedirCartaAdicional = async () => {
    try {
      const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`;
      const response = await axios.get(url);
      const { cards } = response.data;
      const nuevaCarta = cards[0];
      setCartaAdicional(nuevaCarta);

      const ultimaCarta = cartasDibujadas[cartasDibujadas.length - 1];
      if (
        ultimaCarta &&
        nuevaCarta.value === ultimaCarta.value &&
        ((nuevaCarta.suit === "CLUBS" && ultimaCarta.suit === "DIAMONDS") ||
          (nuevaCarta.suit === "HEARTS" && ultimaCarta.suit === "SPADES") ||
          (nuevaCarta.suit === "DIAMONDS" && ultimaCarta.suit === "CLUBS ") ||
          (nuevaCarta.suit === "SPADES" && ultimaCarta.suit === "HEARTS"))
      ) {
        swal(
          "¡GANASTE!",
          "La nueva carta tiene el mismo número y una pinta contraria.",
          "success"
        );
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    if (deckId !== "") {
      dibujarCartas();
    }
  }, [deckId]);

  return (
    <div>
      <input
        type="text"
        value={nombreJugador}
        onChange={handleInputChange}
        placeholder="Ingrese el nombre del jugador"
      />
      <button onClick={guardarNombreJugador}>Guardar Jugador</button>
      {deckId && <p>Deck ID: {deckId}</p>}
      {cartasDibujadas.map((carta, index) => (
        <img
          key={index}
          src={carta.images.svg}
          alt={carta.code}
          style={{ width: "250px", height: "350px" }}
        />
      ))}
      {cartaAdicional && (
        <img
          src={cartaAdicional.images.svg}
          alt={cartaAdicional.code}
          style={{ width: "250px", height: "350px" }}
        />
      )}
      <button onClick={pedirCartaAdicional}>Pedir Carta Adicional</button>
    </div>
  );
};

export default JugadoresSR;
