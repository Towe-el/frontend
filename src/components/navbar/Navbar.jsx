import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-slate-50 z-50 h-8 flex items-center justify-between px-6 p-4">
        <div className="text-2xl font-light text-grey-800">Namo</div>
        <div className="space-x-6">
            <Link to="/info" className="text-grey-700 hover:text-blue-500 text-2xl font-light">INFO</Link>
            {/* <Link to="/history">History</Link> */}
        </div>
    </nav>
  )
}

export default Navbar