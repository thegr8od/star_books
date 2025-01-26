import { Outlet } from 'react-router-dom';
import Header from '../Header';
import ThreeBackground from '../ThreeBackground';


function Layout() {
  return (
    <>
      <ThreeBackground />
      <Header />
      <Outlet />
    </>
  );
}

export default Layout