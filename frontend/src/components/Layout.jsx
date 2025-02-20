import Nav from "./Nav";

const Layout = ({
  children,
  showNav = true,
  backButton,
  noShow,
  showLeft = true, // 왼쪽 버튼 표시 여부 추가
  showRight = true, // 오른쪽 버튼 표시 여부 추가
}) => {
  return (
    <div className="flex flex-col w-full max-w-xs md:max-w-lg lg:max-w-xl mx-auto py-3">
      {showNav && <Nav backButton={backButton} noShow={noShow} showLeft={showLeft} showRight={showRight} />}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
