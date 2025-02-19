import Nav from "./Nav";

const Layout = ({ children, showNav = true }) => {
  return (
    <div className="flex flex-col w-full max-w-xs md:max-w-lg lg:max-w-xl mx-auto py-3">
      {showNav && <Nav />}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
