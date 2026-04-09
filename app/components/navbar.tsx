"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FaUtensils,
  FaHome,
  FaStore,
  FaInfoCircle,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import Image from "next/image";
import { ArrowBigRight, ArrowRight } from "lucide-react";
import { NavbarSearch } from "./NavbarSearch";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // 1. Prevent background scrolling when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Recipes", href: "/recipes", icon: <FaUtensils /> },
    { name: "Restaurants", href: "/coming", icon: <FaStore /> },
    { name: "About", href: "/about", icon: <FaInfoCircle /> },
    { name: "Contact", href: "/contact", icon: <FaEnvelope /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-60 transition-all duration-500 ${
        // 2. Force solid white when open or scrolled
        open || scrolled ? "bg-white shadow-md py-3" : "bg-white py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO AREA */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 group relative z-[70]"
        >
          <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 group-hover:scale-110">
            <Image
              src="/RHFLogo2.png"
              alt="RHF Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter hidden md:block text-stone-900 leading-none">
              Regional Heritage Food
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-5 py-2 text-sm font-bold uppercase tracking-widest transition-colors duration-300 group ${
                  isActive
                    ? "text-red-600"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                <div className="flex items-center">
                  <div className="mr-1">{link.icon}</div>
                  <div> {link.name}</div>
                </div>
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-red-600 transition-all duration-300 ${isActive ? "w-6" : "w-0 group-hover:w-6"}`}
                />
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-4 relative z-[70]">
          {/* SEARCH BUTTON TRIGGER */}
          <button
            onClick={() => setIsSearchOpen(true)} // TRIGGERS SEARCH
            className="p-2.5 rounded-full text-stone-500 hover:bg-stone-50 transition-colors"
          >
            <FaSearch size={18} />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-3 rounded-2xl bg-red-700 text-white transition-all duration-300 shadow-lg"
          >
            {open ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* <Link
            href="/recipes"
            className="hidden lg:block bg-red-700 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-800 transition-all active:scale-95"
          >
            Explore
          </Link> */}
        </div>
      </div>

      {/* MOBILE MENU - Full Screen Solid Overlay */}
      <div
        className={`fixed inset-0 top-0 h-screen w-full bg-white transition-transform duration-500 ease-in-out lg:hidden z-[65] ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="flex flex-col p-8 pt-32 space-y-8 h-full overflow-y-auto">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-2">
            Menu Navigation
          </p>
          {navLinks.map((link, idx) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between group "
            >
              <div className="flex items-center gap-6">
                <span
                  className={`text-2xl ${pathname === link.href ? "text-red-600" : "text-stone-300"}`}
                >
                  {link.icon}
                </span>
                <span
                  className={`${pathname === link.href ? "text-red-700" : "text-stone-500"}`}
                >
                  {link.name}
                </span>
              </div>
              <span className="text-stone-300 group-hover:text-red-600 font-extraboldtransition-colors text-2xl">
                <ArrowRight size={24} />
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <NavbarSearch
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
    </header>
  );
}
