import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BsBarChartFill, BsArrowLeftRight } from "react-icons/bs";
import { FaWallet } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";

const links = [
  {
    icon: <BsBarChartFill className="h-4 w-4" />,
    name: "Dashboard",
    to: "/",
  },
  {
    icon: <FaWallet className="h-4 w-4" />,
    name: "Categories",
    to: "/categories",
  },
  {
    icon: <BsArrowLeftRight className="h-4 w-4" />,
    name: "Transactions",
    to: "/transactions",
  },
];

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="block lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 z-50">
      <ul className="flex items-center justify-between space-x-6 p-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.to}
              className={`${
                pathname === link.to ? "text-white" : "text-gray-500"
              } rounded-md text-sm md:text-md font-medium flex flex-col items-center gap-2`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
