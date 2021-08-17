import Image from 'next/image';
import pieces from '../../utils/game/assets/pieces';

const Piece = ({pieceType, pieceColor}) => {
    return (
        <div>
            {(pieces && pieceType && pieceColor) && <Image src={`${pieces[pieceType][pieceColor]}`} width={30} height={30}/>}
        </div>
    )
}

export default Piece
