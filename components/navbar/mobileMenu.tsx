"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MobileMenuProps = {
  isAuthenticated: boolean;
  navigationLinks: { name: string; href: string; requiresAuth: boolean }[];
};

const MobileMenu = ({ isAuthenticated, navigationLinks }: MobileMenuProps) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuIsOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("touchstart", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuIsOpen]);

  return (
    <div className="md:hidden mr-2" ref={menuRef}>
      <button
        aria-label="Open menu"
        className="p-2 rounded focus:outline-none"
        onClick={() => setMenuIsOpen((prev) => !prev)}
      >
        <Menu className="w-8 h-8 text-darkGrey" />
      </button>

      {menuIsOpen && (
        <div className="absolute right-0 top-12 z-50 bg-white shadow-lg rounded flex flex-col w-screen">
          {navigationLinks.map((link) => {
            if (link.requiresAuth && !isAuthenticated) return null;

            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 px-4 py-4 text-darkGrey hover:bg-muted border-b border-r border-darkGrey"
                onClick={() => setMenuIsOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
