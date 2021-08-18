import Board from "../components/chess/Board"
import * as Chess from "chess.js";
import { useEffect, useState } from "react";
import {socket} from "../utils/socket/socket";



const Home = () => {
  const [chess, setChess] = useState();
  const [chessBoard, setChessBoard] = useState([]);
  const [isWhiteTurn, setWhiteTurn] = useState(true);
  const [roomId, setRoomId] = useState("");
  const [playerColor, setPlayerColor] = useState(null);

  const handleTurnChange = () => {
    setWhiteTurn(prevTurn => !prevTurn);
  }

  const joinChessRoom = (event) => {
    event.preventDefault();
    console.log(roomId);
    socket.emit("join_room", roomId);
  }

  const handleRoomId = (event) => {
    const currentRoomId = event.target.value;
    setRoomId(currentRoomId);
  }

  useEffect( () => {
    setChessBoard(() =>{
      if (chess) return chess.board();
    });
  }, [chess, isWhiteTurn]);

  useEffect(() => {
    socket.on("game_start", res => {
      console.log("Game Starting: ", chess);
      if (!res.error && chess === undefined) {
        const newChess = new Chess();
        setChess(newChess);
      }
    });

    socket.on("on_join", msg => {
      console.log(msg);
      setPlayerColor(msg.color);
    });
  }, [])
  


  return (
      <div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-6 border-b shadow-sm">Eiki's Chess</h1>

          {(chess && chess?.game_over()) && 
            <div className="text-3xl cursor-pointer bg-blue-100 text-gray-800 rounded-full p-6 font-light text-center mt-6 animate-pulse">
              <p>Game over!</p>
            </div>
          }

          {!chessBoard && 
            <form className="flex flex-col justify-center items-center mt-24 space-y-4 md:space-y-6" onSubmit={joinChessRoom}>
              <label htmlFor="roomId">Room Id</label>
              <input type="text" id="roomId" name="roomId" value={roomId} onChange={handleRoomId} className="p-3 rounded-lg font-light"/>
              <button type="submit" className="bg-blue-50 p-3 lg:p-6 xl:p-8 rounded-lg ">Join Room</button>
            </form>
            }
          {(chess && chessBoard) && <Board chessMatrix={chessBoard} chess={chess} isWhiteTurn={isWhiteTurn} handleTurnChange={handleTurnChange} playerColor={playerColor}/>}


          {/* {console.log(chess)}
          {console.log(chessBoard)} */}
          
        </div>
        {/* <div className="flex items-center justify-center mb-6 lg:mb-12">
          {chessBoard && <button className="bg-blue-50 p-3 rounded-lg" onClick={startChessGame}>Reset game</button> }
        </div> */}
      </div>
  )
}

export default Home
