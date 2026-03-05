"use client";

import { motion } from "framer-motion";
import { Timer, Utensils, Instagram, Twitter, Mail } from "lucide-react";
import { useState } from "react";
import Image from "next/image"; // Import Next.js Image

export default function ComingSoon() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("You're on the list!");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden py-4">
      {/* --- 1. THE IMAGE BACKGROUND --- */}
      <div className="">
        <Image
          // Put your image in /public/hero.jpg and use src="/hero.jpg"
          src="/4d2eed27a4953f89d40ba30b8856c495.jpg"
          alt="Coming Soon Background"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
