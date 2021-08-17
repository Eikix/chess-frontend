const Tile = ({color, children}) => {
    const myColor = color;
    return (
        <div className={`flex justify-center cursor-pointer items-center h-9 w-9 md:h-12 md:w-12 lg:h-16 lg:w-16 xl:h-20 xl:w-20 border ${color === "blue" ? "bg-blue-100" : (color === "gray" ? "bg-gray-100" : "bg-green-100")}`}>
            {children}
        </div>
    )
}

export default Tile
