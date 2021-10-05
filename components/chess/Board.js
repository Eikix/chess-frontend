import { useState, useEffect } from 'react';
import BoardLayout from './BoardLayout';
import Piece from './Piece';
import Tile from './Tile';
import { socket } from '../../utils/socket/socket';

// Handling Sound Effects
import useSound from 'use-sound';
import moveSfx from '../../public/sounds/move.mp3';
import castleSfx from '../../public/sounds/castling.mp3';
import captureSfx from '../../public/sounds/capture.mp3';
import gameOverSfx from '../../public/sounds/gameOver.mp3';
import checkSfx from '../../public/sounds/isInCheck.mp3';

const Board = ({
    chessMatrix,
    chess,
    isWhiteTurn,
    handleTurnChange,
    playerColor,
}) => {
    // Loading sound effects
    const [moveSound] = useSound(moveSfx);
    const [castleSound] = useSound(castleSfx);
    const [captureSound] = useSound(captureSfx);
    const [gameOverSound] = useSound(gameOverSfx);
    const [checkSound] = useSound(checkSfx);
    const handleSoundOnMove = moveFlag => {
        const moveSounds = ['n', 'b', 'p', 'pc'];
        const castleSounds = ['k', 'q'];
        const captureSounds = ['e', 'c'];
        if (moveSounds.includes(moveFlag)) moveSound();
        if (castleSounds.includes(moveFlag)) castleSound();
        if (captureSounds.includes(moveFlag)) captureSound();
    };

    const notMoving = {
        isMoving: false,
        pieceType: null,
        allowedMoves: [],
        startingCoord: '',
    };
    const [pieceIsMoving, setPieceIsMoving] = useState(notMoving);

    const moveStartEnd = (coord, colType, colColor) => {
        if (!pieceIsMoving.isMoving) startMove(coord, colType, colColor);
        if (pieceIsMoving.isMoving) endMove(coord, colType, colColor);
    };

    const startMove = (coord, colType, colColor) => {
        if (playerColor === 'b' && isWhiteTurn) return;
        if (playerColor === 'w' && !isWhiteTurn) return;
        if (playerColor === 'b' && colColor === 'w') return;
        if (playerColor === 'w' && colColor === 'b') return;
        if (colType === null) return;
        if (
            (colColor === 'b' && isWhiteTurn) ||
            (colColor === 'w' && !isWhiteTurn)
        )
            return;
        const moves = chess.getLegalMoves(coord);
        if (!pieceIsMoving.isMoving)
            setPieceIsMoving({
                isMoving: true,
                pieceType: colType?.toString().toUpperCase(),
                allowedMoves: moves,
                startingCoord: coord,
            });
        console.log('Start coords: ', coord);
        console.log('Allowed moves: ', moves);
    };

    const endMove = coord => {
        if (!pieceIsMoving.isMoving) return;
        if (pieceIsMoving.isMoving) {
            let potentialFrom;
            let potentialTo;
            // if (
            //     pieceIsMoving.pieceType === 'P' &&
            //     ['a1', 'b1', 'c1', 'e1', 'f1', 'g1', 'h1'].includes(endCoords)
            // ) {
            //     potentialMove = {
            //         from: pieceIsMoving.startingCoord,
            //         to: endCoords,
            //         promotion: 'q',
            //     };
            // } else {
            //     potentialMove = {
            //         from: pieceIsMoving.startingCoord,
            //         to: endCoords,
            //     };
            // }
            potentialFrom = pieceIsMoving.startingCoord;
            potentialTo = coord;
            console.log(`Wanted move: from ${potentialFrom} to ${potentialTo}`);
            const move = chess.moveFromTo(potentialFrom, potentialTo);
            if (move) {
                socket.emit('game_update', {
                    from: potentialFrom,
                    to: potentialTo,
                });
                setPieceIsMoving(notMoving);
                handleTurnChange();
                console.log('Move : ', move);
            } else {
                setPieceIsMoving(notMoving);
                console.log('Move not allowed');
            }
        }
    };

    const getTileColor = coord => {
        let tileColor;
        const reg = /[0-9]+/g;
        const [row, col] = coord.match(reg);
        const rowIndex = parseInt(row);
        const colIndex = parseInt(col);
        if (pieceIsMoving.isMoving && pieceIsMoving.allowedMoves.length > 0) {
            const allowedCoordArray = [];
            pieceIsMoving.allowedMoves.map(allowedMove => {
                allowedCoordArray.push(allowedMove.to);
            });
            tileColor = allowedCoordArray.includes(coord)
                ? 'purple'
                : (colIndex + (rowIndex % 2) + 1) % 2 === 0
                ? 'gray'
                : 'blue';
        } else {
            tileColor =
                (colIndex + (rowIndex % 2) + 1) % 2 === 0 ? 'gray' : 'blue';
        }
        return tileColor;
    };

    const handleGameUpdate = (from, to) => {
        const move = chess.moveFromTo(from, to);
        console.log('Move returned bool: ', move);
        if (move) {
            handleTurnChange();
            console.log('Moved');
        }
    };

    useEffect(() => {
        socket.on('on_game_update', res => {
            handleGameUpdate(res.from, res.to);
        });
    }, []);

    return (
        <div>
            <h3 className="text-center text-lg md:text-xl lg:text-2xl xl:text-2xl mt-6 border-b shadow-sm">
                {isWhiteTurn ? "White's turn" : "Black's turn"}
            </h3>
            <h3 className="text-center text-md md:text-lg lg:text-xl xl:text-xl mt-3 border-b shadow-sm">{`You are playing ${
                playerColor === 'w' ? 'White' : 'Black'
            }`}</h3>
            <BoardLayout>
                {chessMatrix &&
                    chess &&
                    Object.keys(chessMatrix).map(coord => {
                        const tileColor = getTileColor(coord);
                        return (
                            <div
                                key={coord}
                                onClick={() =>
                                    moveStartEnd(
                                        coord,
                                        chessMatrix[coord].piece?.type,
                                        chessMatrix[coord].piece?.color
                                    )
                                }
                            >
                                <Tile color={tileColor}>
                                    <Piece
                                        pieceType={
                                            chessMatrix[coord].piece?.type
                                        }
                                        pieceColor={
                                            chessMatrix[coord].piece?.color
                                        }
                                    />
                                </Tile>
                            </div>
                        );
                    })}
            </BoardLayout>
        </div>
    );
};

export default Board;
