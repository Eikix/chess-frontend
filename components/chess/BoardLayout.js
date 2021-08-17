const BoardLayout = ({children}) => {
    return (
        <div className="h-full grid grid-cols-8 px-48 py-16 md:px-64 lg:px-80 xl:px-96">
            {children}
        </div>
    )
}

export default BoardLayout
