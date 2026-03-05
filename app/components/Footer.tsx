"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
  MapPin,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-stone-900 mt-20 text-stone-300 pt-20 pb-10 transition-all duration-300 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-red-700/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Top Section: Logo and Brand */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 pb-12 border-b border-stone-800/50">
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <div className=" p-2 rounded-xl shadow-lg shadow-black/20">
              <Image
                src="/RHFLogo2.png"
                alt="Regional Heritage Food Logo"
                className="w-40 h-40 object-contain"
                width={200}
                height={200}
              />
            </div>
            <div>
              <h2 className="text-3xl  text-white tracking-wider font-bold uppercase">
                Regional Heritage <span className="text-red-700">Food</span>
              </h2>
              <p className="text-red-200/60 text-xs font-bold uppercase tracking-[0.2em] mt-1">
                Authenticity in every bite
              </p>
            </div>
          </div>

          <div className="mt-8 md:mt-0 flex flex-col items-center md:items-end gap-2">
            <p className="text-stone-400 text-sm font-medium">
              Ready for your next trip?
            </p>
            <Link
              href="/suggest"
              className="px-6 py-3 bg-red-700 hover:bg-red-700 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-900/20"
            >
              Suggest a Place
            </Link>
          </div>
        </div>

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Column 1: Mission */}
          <div className="space-y-6">
            <h3 className="text-white font-bold uppercase tracking-widest text-[11px]">
              Our Mission
            </h3>
            <p className="text-sm leading-relaxed text-stone-400/90 font-light">
              Promotion of cultural heritage food, food points, Food-Chef, and
              travel places for developing a healthy productive society across
              Pakistan.
            </p>
            <div className="space-y-4 pt-2">
              <ContactItem
                icon={<Phone className="w-4 h-4 text-red-700" />}
                text="+92 318 9992760"
                href="tel:+923189992760"
              />
              <ContactItem
                icon={<Mail className="w-4 h-4 text-red-700" />}
                text="info@rhfpakistan.com"
                href="mailto:info@rhfpakistan.com"
              />
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-red-700" />
                <span className="text-stone-400">Pakistan</span>
              </div>
            </div>
          </div>

          {/* Column 2: Popular Interests */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-[11px] mb-8">
              Popular Interests
            </h3>
            <ul className="grid grid-cols-1 gap-y-4 text-sm">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/coming">Vision & Mission</FooterLink>
              <FooterLink href="/history">How RHF Started?</FooterLink>
              <FooterLink href="/coming">Our Team</FooterLink>
              <FooterLink href="/coming">Terms & Conditions</FooterLink>
              <FooterLink href="/coming">FAQs</FooterLink>
            </ul>
          </div>

          {/* Column 3: Pictures & Media */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-[11px] mb-8">
              Explore Culture
            </h3>
            <ul className="grid grid-cols-1 gap-y-4 text-sm">
              <FooterLink href="/coming">Pictures</FooterLink>
              <FooterLink href="/coming">Foodpoints</FooterLink>
              <FooterLink href="/coming">Highway Food</FooterLink>
              <FooterLink href="/coming">Homemade Food</FooterLink>
              <FooterLink href="/coming">Travel Places</FooterLink>
              <FooterLink href="/coming">Videos</FooterLink>
            </ul>
          </div>

          {/* Column 4: Social & Newsletter */}
          <div className="space-y-8">
            <div>
              <h3 className="text-white font-bold uppercase tracking-widest text-[11px] mb-6">
                Stay Connected
              </h3>
              <div className="flex gap-3">
                <SocialIcon icon={<Facebook className="w-5 h-5" />} href="#" />
                <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
                <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
                <SocialIcon icon={<Youtube className="w-5 h-5" />} href="#" />
              </div>
            </div>
            <div className="p-5 bg-stone-800/40 rounded-2xl border border-stone-700/50">
              <p className="text-xs text-stone-300 font-medium mb-1">
                Weekly Recipes
              </p>
              <p className="text-[10px] text-stone-500 mb-3">
                Join our cultural digest.
              </p>
              <Link
                href="/signup"
                className="text-xs font-bold text-red-700 flex items-center gap-1 hover:gap-2 transition-all"
              >
                Sign Up <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-stone-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">
              &copy; {currentYear} Regional Heritage Food
            </p>
            <span className="hidden md:block w-1 h-1 bg-stone-700 rounded-full" />
            <p className="text-[10px] text-stone-600 font-medium">
              Made with heart in Pakistan
            </p>
          </div>

          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">
            <Link
              href="/privacy"
              className="hover:text-red-800 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              className="hover:text-red-800 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactItem({
  icon,
  text,
  href,
}: {
  icon: React.ReactNode;
  text: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 hover:text-red-800 transition-colors text-sm"
    >
      <span className="p-1.5 rounded-lg bg-stone-800 group-hover:bg-red-700/10 transition-colors">
        {icon}
      </span>
      {text}
    </a>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-2 hover:text-white transition-all duration-200 text-stone-400"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-700/40 group-hover:bg-red-800 transition-all" />
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="w-10 h-10 flex items-center justify-center bg-stone-800 rounded-xl hover:bg-red-800 hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-lg"
    >
      {icon}
    </a>
  );
}
