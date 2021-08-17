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
      <h1 className="text-center text-2xl mt-6 border-b shadow-sm">Chess is Cool</h1>

      {!chessBoard && <button className="bg-blue-50 p-3 rounded-lg" onClick={loadChess}>Load state of game</button>}
      {chessBoard && <Board chessMatrix={chessBoard} chess={chess} isWhiteTurn={isWhiteTurn} handleTurnChange={handleTurnChange}/>}


      {/* {console.log(chess)}
      {console.log(chessBoard)} */}
      
    </div>
    <div className="flex items-center justify-center">
      {chessBoard && <button className="bg-blue-50 p-3 rounded-lg" onClick={loadChess}>Reset state of game</button> }
    </div>
    </>
  )
}

export default Home
