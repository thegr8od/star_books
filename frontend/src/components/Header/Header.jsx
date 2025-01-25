import { Link } from 'react-router-dom';
import Nav from '../Nav'
function Header() {
  return (
    <header>
      <Link to="">Home</Link>
      <Nav/>
    </header>
  );
}

export default Header