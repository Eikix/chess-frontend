import { useState, useEffect } from "react";
import BoardLayout from "./BoardLayout";
import Piece from "./Piece";
import Tile from "./Tile";
import {socket} from "../../utils/socket/socket";

// Handling Sound Effects
import useSound from "use-sound";
import moveSfx from "../../public/sounds/move.mp3";
import castleSfx from "../../public/sounds/castling.mp3";
import captureSfx from "../../public/sounds/capture.mp3";
import gameOverSfx from "../../public/sounds/gameOver.mp3";
import checkSfx from "../../public/sounds/isInCheck.mp3";

const Board = ({chessMatrix, chess, isWhiteTurn, handleTurnChange, playerColor}) => {

    // Loading sound effects
    const [moveSound] = useSound(moveSfx);
    const [castleSound] = useSound(castleSfx);
    const [captureSound] = useSound(captureSfx);
    const [gameOverSound] = useSound(gameOverSfx);
    const [checkSound] = useSound(checkSfx);
    const handleSoundOnMove = (moveFlag) => {
        const moveSounds = ["n", "b", "p", "pc"];
        const castleSounds = ["k", "q"];
        const captureSounds = ["e","c"];
        if (moveSounds.includes(moveFlag)) moveSound();
        if (castleSounds.includes(moveFlag)) castleSound();
        if (captureSounds.includes(moveFlag)) captureSound();
    } 


    const notMoving = {
        isMoving: false,
        pieceType: null,
        allowedMoves: [],
        startingCoord: ""
    }
    const [pieceIsMoving, setPieceIsMoving] = useState(notMoving)

    const convertRowColIndexToCoord = (rowIndex, colIndex) => {
        const numbersArray = ["8", "7", "6", "5", "4", "3", "2", "1"];
        const numberCoord = numbersArray[rowIndex];
        const lettersArray = ["a", "b", "c", "d", "e", "f", "g", "h"];
        const letterCoord = lettersArray[colIndex];
        return `${letterCoord}${numberCoord}`;

    }

    const moveStartEnd = (rowIndex, colIndex, colType) => {
        if (!pieceIsMoving.isMoving) startMove(rowIndex, colIndex, colType);
        if (pieceIsMoving.isMoving) endMove(rowIndex, colIndex, colType);

    }


    const startMove = (rowIndex, colIndex, colType, colColor) => {
        if (playerColor === "Black" && isWhiteTurn) return;
        if (playerColor === "White" && !isWhiteTurn) return;
        if (playerColor === "Black" && colColor === "w") return;
        if (playerColor === "White" && colColor === "b") return;
        if (colType === null) return;
        if ((colColor === "b" && isWhiteTurn) || (colColor === "w" && !isWhiteTurn)) return;
        const startCoords = convertRowColIndexToCoord(rowIndex, colIndex);
        const moves = chess.moves({square: startCoords, verbose: true});
        if (!pieceIsMoving.isMoving) setPieceIsMoving({
            isMoving: true,
            pieceType: colType?.toString().toUpperCase(),
            allowedMoves: moves,
            startingCoord: startCoords
        });
        console.log("Start coords: ", startCoords);
        console.log("Allowed moves: ", moves);
    }

    const endMove = (rowIndex, colIndex) => {
        const endCoords = convertRowColIndexToCoord(rowIndex, colIndex);
        if (!pieceIsMoving.isMoving) return;
        if (pieceIsMoving.isMoving) {
            let potentialMove;
            if(pieceIsMoving.pieceType === "P" && ["a1", "b1", "c1", "e1", "f1", "g1", "h1"].includes(endCoords)) {
                potentialMove = {from: pieceIsMoving.startingCoord, to: endCoords, promotion: "q"}
            } else {
                potentialMove = {from: pieceIsMoving.startingCoord, to: endCoords}
            }
            console.log("Wanted Move: ", potentialMove);
            const move = chess.move(potentialMove);
            if (move) {
                socket.emit("game_update", potentialMove);
                setPieceIsMoving(notMoving);
                handleTurnChange();
                if (move.flags) handleSoundOnMove(move.flags);
                console.log("Move : ", move);
            } else {
                setPieceIsMoving(notMoving);
                console.log("Move not allowed");
            }
        }
    }

    const getTileColor = (rowIndex, colIndex) => {
        let tileColor;
        if (pieceIsMoving.isMoving && pieceIsMoving.allowedMoves.length > 0) {
            const allowedCoordArray = [];
            pieceIsMoving.allowedMoves.map(allowedMove => {allowedCoordArray.push(allowedMove.to)})
            tileColor = (allowedCoordArray.includes(convertRowColIndexToCoord(rowIndex, colIndex))) ? "purple" : ( ( (colIndex+(rowIndex % 2)) % 2 === 0) ) ? "gray" : "blue";
        } else {
            tileColor = ( ( (colIndex+(rowIndex % 2)) % 2 === 0) ) ? "gray" : "blue";
        }
        return tileColor;
        
    }
    
    const handleGameUpdate = (playerMove) => {
        const move = chess.move(playerMove);
        console.log("Move: ", move)
        if (move) {
            handleTurnChange();
            console.log("Moved");
        }
    }

    useEffect(() => {
        socket.on("on_game_update", playerMove => {
         handleGameUpdate(playerMove);
        });
    }, []);

 
    return (
        <div>
        <h3 className="text-center text-lg md:text-xl lg:text-2xl xl:text-2xl mt-6 border-b shadow-sm">{isWhiteTurn ? "White's turn" : "Black's turn"}</h3>
        <h3 className="text-center text-md md:text-lg lg:text-xl xl:text-xl mt-3 border-b shadow-sm">{`You are playing ${playerColor}`}</h3>
        <BoardLayout >
            {chessMatrix && chessMatrix.map((row, rowIndex) => {
                return (
                    row.map((col, colIndex) => {
                        const tileColor = getTileColor(rowIndex, colIndex);
                        return (
                            <div onClick={() => moveStartEnd(rowIndex, colIndex, col?.type, col?.color)}>
                                <Tile  key={`row${rowIndex}col${colIndex}`} color={tileColor}>
                                    {col && <Piece pieceType = {col?.type} pieceColor = {col?.color}/>}
                                </Tile>
                            </div>
                        )                  
                    })
                )
            })}
        </BoardLayout>
        </div>
    )
}

export default Board
