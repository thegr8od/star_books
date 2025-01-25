import { Outlet } from 'react-router-dom';
import './Layout.css';
import Header from '../Header';
import ThreeBackground from '../ThreeBackground';


function Layout() {
  return (
    <div className="layout-container">
      <ThreeBackground />
      <div className="content-wrapper">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout