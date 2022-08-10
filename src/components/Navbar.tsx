import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const links = [
  {
    name: "Dashboard",
    to: "/",
  },
  {
    name: "Categories",
    to: "/categories",
  },
  {
    name: "Transactions",
    to: "/transactions",
  },
];

const Navbar = () => {
  const { logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <nav className="flex justify-between items-center max-w-7xl mx-auto py-6">
      <Link to="/" className="text-3xl font-bold text-green-400">
        Finances
      </Link>
      <ul className="flex items-center space-x-6">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.to}
              className={`${
                pathname === link.to
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "text-gray-500 hover:text-gray-400"
              } px-4 py-3 rounded-md text-white font-medium`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <button className="btn btn-error normal-case" onClick={logout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
