const BoardLayout = ({children}) => {
    return (
        <div className="h-full grid grid-cols-8 px-48 py-16 md:px-64 md:py-24 lg:px-80 lg:py-32 xl:px-96 xl:py-32">
            {children}
        </div>
    )
}

export default BoardLayout
