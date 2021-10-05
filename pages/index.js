import Board from '../components/chess/Board';
import * as Chess from '../utils/chessLibrary/chessmythJS/chess/CMChess';
import { useEffect, useState } from 'react';
import { socket } from '../utils/socket/socket';
import piecesMoveset from '../utils/chessLibrary/chessmythJS/chess/utils/pieces/pieceTypeToMoves';

const Home = () => {
    const [chess, setChess] = useState();
    const [chessBoard, setChessBoard] = useState([]);
    const [isWhiteTurn, setWhiteTurn] = useState(true);
    const [roomId, setRoomId] = useState('');
    const [playerColor, setPlayerColor] = useState(null);
    const [isJoining, setIsJoining] = useState(false);

    const width = 10;
    const boardOptions = {
        backline: 'rnbbqkbnnr',
        frontline: 'pppppppppp',
        width: width,
        terrain: ['4;6'],
        mana: ['3;6', '7;8'],
        wKing: '6;1',
        bKing: '6;10',
    };

    const handleTurnChange = () => {
        setWhiteTurn(prevTurn => !prevTurn);
    };

    const joinChessRoom = event => {
        event.preventDefault();
        setIsJoining(true);
        // console.log(roomId);
        socket.emit('join_room', roomId);
    };

    const handleRoomId = event => {
        const currentRoomId = event.target.value;
        setRoomId(currentRoomId);
    };

    useEffect(() => {
        setChessBoard(() => {
            if (chess) return chess?.getBoard();
        });
    }, [chess, isWhiteTurn]);

    useEffect(() => {
        socket.on('game_start', res => {
            console.log('Game Starting: ', chess);
            if (!res.error && chess === undefined) {
                const newChess = new Chess(boardOptions, piecesMoveset);
                setChess(newChess);
            }
        });

        socket.on('on_join', msg => {
            console.log(msg);
            setPlayerColor(msg.color);
        });
    }, []);

    return (
        <div>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-6 border-b shadow-sm">
                    Eiki's Chess Myth
                </h1>

                {chess && chess?.isGameOver && (
                    <div className="text-3xl cursor-pointer bg-blue-100 text-gray-800 rounded-full p-6 font-light text-center mt-6 animate-pulse">
                        <p>Game over!</p>
                    </div>
                )}

                {!chessBoard && (
                    <form
                        className="flex flex-col justify-center items-center mt-24 space-y-4 md:space-y-6 text-xl lg:text-2xl xl:text-3xl font-light"
                        onSubmit={joinChessRoom}
                    >
                        <label htmlFor="roomId">Room Id</label>
                        <input
                            type="text"
                            id="roomId"
                            name="roomId"
                            value={roomId}
                            onChange={handleRoomId}
                            className="p-3 rounded-lg font-light border border-blue-900"
                            placeholder="Enter Room Id"
                        />
                        <button
                            type="submit"
                            disabled={isJoining}
                            className="bg-blue-50 p-3 lg:p-6 rounded-lg font-light"
                        >
                            {!isJoining ? 'Join Room' : 'Awaiting player 2...'}
                        </button>
                    </form>
                )}
                {chess && chessBoard && (
                    <Board
                        chessMatrix={chessBoard}
                        chess={chess}
                        isWhiteTurn={isWhiteTurn}
                        handleTurnChange={handleTurnChange}
                        playerColor={playerColor}
                    />
                )}

                {/* {console.log(chess)}
          {console.log(chessBoard)} */}
            </div>
            {/* <div className="flex items-center justify-center mb-6 lg:mb-12">
          {chessBoard && <button className="bg-blue-50 p-3 rounded-lg" onClick={startChessGame}>Reset game</button> }
        </div> */}
        </div>
    );
};

export default Home;
