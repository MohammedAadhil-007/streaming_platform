import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";

const adminEmails = ["admin@example.com", "youradminemail@gmail.com"];

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsAdmin(adminEmails.includes(currentUser.email));
            } else {
                setUser(null);
                setIsAdmin(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <nav className="p-4 bg-gray-800 text-white flex justify-between">
            <Link to="/home" className="text-lg font-bold">Video Stream</Link>
            <div className="space-x-4">
                <Link to="/home">Home</Link>
                {isAdmin && <Link to="/admin-dashboard">Admin Dashboard</Link>}
                <button
                    className="bg-red-500 px-3 py-1 rounded"
                    onClick={() => auth.signOut()}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
