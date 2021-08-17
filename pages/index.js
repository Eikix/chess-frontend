import Board from "../components/chess/Board"
import * as Chess from "chess.js";
import { useEffect, useState } from "react";


const Home = () => {
  const [chess, setChess] = useState();
  const [chessBoard, setChessBoard] = useState([]);
  const [isWhiteTurn, setWhiteTurn] = useState(true);

  const handleTurnChange = () => {
    setWhiteTurn(prevTurn => !prevTurn);
  }

  const loadChess = () => {
    setChess( () => {
      const newChess = new Chess();
      // console.log(newChess);
      return (
        newChess
      );
    });
  }

  useEffect( () => {
    setChessBoard(() =>{
      if (chess) return chess.board();
    });
  }, [chess, isWhiteTurn])

  return (
    <>
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-6 border-b shadow-sm">Choooss</h1>

      {(chess && chess?.game_over()) && 
        <div className="text-3xl cursor-pointer bg-blue-100 text-gray-800 rounded-full p-6 font-light text-center mt-6 animate-pulse">
          <p>Game over!</p>
        </div>
      }

      {!chessBoard && <button className="bg-blue-50 p-3 lg:p-6 xl:p-8 focus-within:text-center font-light text-xl md:text-3xl lg:text-4xl rounded-lg mt-6 md:mt-24 lg:mt-48" onClick={loadChess}>Load state of game</button>}
      {chessBoard && <Board chessMatrix={chessBoard} chess={chess} isWhiteTurn={isWhiteTurn} handleTurnChange={handleTurnChange}/>}


      {/* {console.log(chess)}
      {console.log(chessBoard)} */}
      
    </div>
    <div className="flex items-center justify-center mb-6 lg:mb-12">
      {chessBoard && <button className="bg-blue-50 p-3 rounded-lg" onClick={loadChess}>Reset state of game</button> }
    </div>
    </>
  )
}

export default Home
