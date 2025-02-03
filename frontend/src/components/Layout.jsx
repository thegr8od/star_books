import Nav from "./Nav";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-screen bg-gradient-to-b from-[#000054] to-[#010121] p-4">
      <div className="flex flex-col w-full max-w-xs md:max-w-lg lg:max-w-xl mx-auto">
        <Nav />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
