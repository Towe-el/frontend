import { Link } from 'react-router-dom';
import LogoHeader from "../../assets/LogoHeader.png"

function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white z-50 h-8 flex items-center space-x-12 p-8">
        <div className="p-4">
            <img
            src={LogoHeader}
            alt="logo image"
            className="h-8"
            />
        </div>
        <div className="space-x-6">
            <Link to="/history" className="text-grey-700 hover:text-blue-500 text-xl font-light">My emotions</Link>
            <Link to="/info" className="text-grey-700 hover:text-blue-500 text-xl font-light">About</Link>
        </div>
    </nav>
  )
}

export default Navbar