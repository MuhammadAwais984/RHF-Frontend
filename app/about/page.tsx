"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  UtensilsCrossed,
  Navigation,
  ChefHat,
  Users,
  BookOpen,
  Lightbulb,
  Globe,
  ArrowRight,
} from "lucide-react";

// Animation Variants
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function About() {
  return (
    <main className="min-h-screen bg-[#faf9f6] text-stone-800 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION: Fade in from Scale */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-gradient-to-r from-red-900 to-stone-900 bg-cover bg-center"
        />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="relative z-10 text-center px-6"
        >
          <span className="text-red-200 uppercase tracking-[0.3em] text-xs md:text-sm font-bold mb-4 block">
            Discover. Taste. Travel.
          </span>
          <h1 className="text-5xl md:text-8xl text-white mb-4 font-serif italic">
            About Us
          </h1>
          <p className="text-white/80 max-w-xl mx-auto font-light tracking-wide text-sm md:text-base">
            Documenting the flavors of Pakistan, from Peshawar's streets to
            Karachi's coasts.
          </p>
        </motion.div>
      </section>

      {/* 2. WHO WE ARE: Slide up into position */}
      <motion.section
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-6xl mx-auto -mt-24 relative z-20 px-4"
      >
        <div className="bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden border border-stone-100">
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-5 bg-stone-50 p-10 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-stone-100">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: 32 }}
                    className="h-[1px] bg-red-700"
                  />
                  <h2 className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-black text-red-700">
                    The Platform
                  </h2>
                </div>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif italic leading-[1.1] text-stone-900">
                  A Flavor <br />
                  <span className="text-stone-400">Worth</span> Finding
                </h3>
              </div>
            </div>

            <div className="md:col-span-7 p-10 md:p-20 flex flex-col justify-center">
              <div className="max-w-xl space-y-8">
                <p className="text-xl md:text-2xl font-light leading-relaxed text-stone-600">
                  <span className="text-stone-900 font-medium border-b-2 border-red-700/10">
                    rhfpakistan.com
                  </span>{" "}
                  is a digital sanctuary for Pakistan’s diverse food heritage.
                </p>
                <p className="text-base md:text-lg text-stone-500 font-light leading-relaxed">
                  We bridge the gap between curiosity and authenticity,
                  connecting a global audience to regional home cooks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. THE SEVEN PILLARS: Staggered reveal */}
      <section className="max-w-6xl mx-auto mt-20 px-4 relative">
        <div className="text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl md:text-6xl font-serif italic text-stone-900 mb-6"
          >
            Our Seven Pillars
          </motion.h2>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <PillarCard
            num="01"
            icon={<UtensilsCrossed />}
            title="Food Street Points"
            desc="Definitive guides to authentic food streets."
          />
          <PillarCard
            num="02"
            icon={<Navigation />}
            title="Highway Food Stops"
            desc="Quality-driven stops on Pakistan's travel routes."
          />
          <PillarCard
            num="03"
            icon={<Users />}
            title="Home Chef Points"
            desc="Showcasing talented home-based cooks."
          />
          <PillarCard
            num="04"
            icon={<ChefHat />}
            title="Food Recipes"
            desc="Structured for real kitchen execution."
          />
          <PillarCard
            num="05"
            icon={<BookOpen />}
            title="Food & Travel Blog"
            desc="Culinary exploration meets travel storytelling."
          />
          <PillarCard
            num="06"
            icon={<Lightbulb />}
            title="Tips & Hacks"
            desc="Short, research-backed kitchen efficiency."
          />

          {/* Special Animated Wide Card */}
          <motion.div variants={fadeIn} className="lg:col-span-3 mt-4">
            <div className="group relative overflow-hidden bg-stone-900 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 transition-all hover:shadow-2xl">
              <Globe className="w-10 h-10 text-white relative z-10" />
              <div className="flex-grow text-center md:text-left relative z-10 text-white">
                <h4 className="text-2xl font-serif italic">Travel for Food</h4>
                <p className="text-stone-400 font-light">
                  Planning journeys built entirely around cuisine.
                </p>
              </div>
              <motion.div
                whileHover={{ x: 10 }}
                className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white"
              >
                <ArrowRight />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. VISION SECTION: Subtle Reveal */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto mt-40 px-4"
      >
        <div className="bg-stone-900 rounded-[3rem] p-8 md:p-20 text-white relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-16 relative z-10">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
            >
              <h2 className="text-4xl mb-6">Looking Ahead</h2>
              <p className="text-stone-400 font-light text-lg">
                Our vision is to become Pakistan’s leading structured food
                discovery platform.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ rotate: -1, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10"
            >
              <p className="text-2xl font-serif italic text-red-200">
                "Every journey tastes better with the right food."
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

function PillarCard({ num, icon, title, desc }: any) {
  return (
    <motion.div
      variants={fadeIn}
      whileHover={{ y: -10 }}
      className="bg-white p-10 hover:bg-stone-50 transition-all duration-300 rounded-3xl border border-stone-100 group"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="w-12 h-12 bg-stone-900 text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6">
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <span className="text-stone-300 font-black text-2xl tracking-tighter group-hover:text-red-700/20 transition-colors">
          {num}
        </span>
      </div>
      <h4 className="text-xl text-stone-900 mb-4">{title}</h4>
      <p className="text-stone-500 text-sm leading-relaxed mb-6">{desc}</p>
      <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-widest translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
        Learn More <ArrowRight size={14} />
      </div>
    </motion.div>
  );
}
