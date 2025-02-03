import Nav from "./Nav";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col w-full max-w-xs md:max-w-lg lg:max-w-xl mx-auto">
      <Nav />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
