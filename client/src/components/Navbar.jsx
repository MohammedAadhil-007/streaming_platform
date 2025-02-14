import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="p-4 bg-gray-800 text-white flex justify-between">
            <Link to="/" className="text-lg font-bold">Video Stream</Link>
            <div className="space-x-4">
                <Link to="/">Home</Link>
                <Link to="/admin">Admin</Link>
            </div>
        </nav>
    );
};

export default Navbar;
