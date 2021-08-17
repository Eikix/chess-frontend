const BoardLayout = ({children}) => {
    return (
        <div className="h-full grid grid-cols-8 px-6 py-16 md:px-32 lg:px-46 xl:px-80">
            {children}
        </div>
    )
}

export default BoardLayout
