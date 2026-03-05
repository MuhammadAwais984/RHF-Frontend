"use client";

import { motion, type Variants } from "framer-motion";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Contact() {
  const departments = [
    {
      label: "General Inquiries",
      email: "info@rhfpakistan.com",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Technical Support",
      email: "support@rhfpakistan.com",
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Sales & Partnership",
      email: "sales@rhfpakistan.com",
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Tours & Travel",
      email: "tours@rhfpakistan.com",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Careers / HR",
      email: "hr@rhfpakistan.com",
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Marketing & PR",
      email: "marketing@rhfpakistan.com",
      color: "bg-stone-50 text-stone-600",
    },
  ];

  return (
    <section className="bg-[#FCFBF9] py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* HEADER: Slide from left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-16"
        >
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-red-600 mb-4">
            Get In Touch
          </h2>
          <h1 className="text-5xl md:text-6xl italic text-stone-900 mb-6">
            We’re here to guide your{" "}
            <span className="text-stone-400 not-italic font-sans font-black uppercase">
              journey.
            </span>
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed font-light">
            Have questions about a regional host, highway food points, or
            planning your next heritage tour? Select the relevant department
            below.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* EMAIL DIRECTORY: Staggered Fade-in */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 grid sm:grid-cols-2 gap-4"
          >
            {departments.map((dept) => (
              <motion.a
                key={dept.email}
                variants={itemVariants}
                href={`mailto:${dept.email}`}
                className="group p-6 rounded-[2rem] border border-stone-100 bg-white transition-all hover:shadow-2xl hover:shadow-stone-200/60"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${dept.color} flex items-center justify-center mb-6 transition-transform group-hover:rotate-12`}
                >
                  <Mail size={22} />
                </div>
                <h3 className="text-stone-900 font-black text-xs uppercase tracking-widest mb-2">
                  {dept.label}
                </h3>
                <p className="text-stone-500 font-medium break-all text-sm italic group-hover:text-red-600 transition-colors">
                  {dept.email}
                </p>
              </motion.a>
            ))}
          </motion.div>

          {/* QUICK CONTACT CARD: Floating/Pulse Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-stone-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-stone-900/20"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-serif italic mb-6">
                Instant Support
              </h3>
              <p className="text-stone-400 mb-10 leading-relaxed font-light">
                Not sure who to email? Reach out via our social channels for an
                immediate response.
              </p>

              <div className="space-y-8">
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-5 cursor-default"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-red-500 border border-white/10">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-500 uppercase font-black tracking-widest">
                      Response Time
                    </p>
                    <p className="font-bold text-lg">Within 24 Hours</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-5 cursor-default"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-red-500 border border-white/10">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-500 uppercase font-black tracking-widest">
                      Base of Operations
                    </p>
                    <p className="font-bold text-lg">Rawalpindi, Pakistan</p>
                  </div>
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-12 bg-red-600 hover:bg-red-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-colors shadow-xl shadow-red-900/40"
              >
                <Send size={16} />
                Send a Message
              </motion.button>
            </div>

            {/* Animated Decorative Blobs */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-600 rounded-full blur-[80px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
