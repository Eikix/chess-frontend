const Tile = ({color, children}) => {
    return (
        <div className={`flex justify-center cursor-pointer items-center h-4 w-4 md:h-8 md:w-8 lg:h-12 lg:w-12 xl:h-16 xl:w-16 border bg-${color}-100`}>
            {children}
        </div>
    )
}

export default Tile
