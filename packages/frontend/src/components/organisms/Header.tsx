"use client";

import Link from "next/link";
import { useState } from "react";
import ButtonGroup from "../molecules/ButtonGroup";
import Button from "../atoms/Button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Property Vista CRM
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="#"
                className="px-3 pt-2 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-indigo-500"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="px-3 pt-2 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-indigo-500"
              >
                Properties
              </a>
              <a
                href="#"
                className="px-3 pt-2 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-indigo-500"
              >
                Clients
              </a>
            </div>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-label="Open main menu"
            >
              {/* Hamburger icon */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden mt-2 block ${
            isOpen ? "max-h-[300px]" : "max-h-0 overflow-hidden transition-all duration-300"
          }`}
        >
          <div className="pt-2 pb-3 space-y-1">
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Properties
            </a>
            <a
              href="#"
              className="block px-3 py-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Clients
            </a>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex px-4 space-x-3">
              <Button variant="outline">Log in</Button>
              <Button variant="primary">Sign up</Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;