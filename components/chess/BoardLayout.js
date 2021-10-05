const BoardLayout = ({ children }) => {
    return (
        <div className="h-full grid grid-cols-10 px-1 py-16 sm:px-3 md:px-32 lg:px-46 xl:px-80">
            {children}
        </div>
    );
};

export default BoardLayout;
