"use client";

import { useState } from "react";
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link2,
  Check,
  MessageCircle,
  X,
  Instagram,
  Send,
  Download,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  variant?: "icon" | "button" | "minimal";
  size?: "sm" | "md" | "lg";
}

export default function ShareButton({
  url,
  title,
  description = "",
  image = "",
  variant = "icon",
  size = "md",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showNativeShare, setShowNativeShare] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? window.location.origin + url : url;

  // Check if native share is available
  const hasNativeShare = typeof navigator !== "undefined" && navigator.share;

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      available: true,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-black hover:bg-gray-800",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
      available: true,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-600 hover:bg-green-700",
      url: `https://wa.me/?text=${encodeURIComponent(title + " " + shareUrl)}`,
      available: true,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      available: true,
    },
    {
      name: "Telegram",
      icon: Send,
      color: "bg-sky-500 hover:bg-sky-600",
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
      available: true,
    },
    {
      name: "Pinterest",
      icon: Camera,
      color: "bg-red-600 hover:bg-red-700",
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(title)}&media=${encodeURIComponent(image)}`,
      available: true,
    },
    {
      name: "Reddit",
      icon: Share2,
      color: "bg-orange-600 hover:bg-orange-700",
      url: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
      available: true,
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-gray-600 hover:bg-gray-700",
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + " " + shareUrl)}`,
      available: true,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleNativeShare = async () => {
    if (hasNativeShare) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== "AbortError") {
          setIsOpen(true);
        }
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleDownloadImage = async () => {
    if (!image) return;

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download image:", err);
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  // Render different button variants
  const renderButton = () => {
    switch (variant) {
      case "button":
        return (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Share2 className="w-4 h-4" />
            <span className="font-medium">Share Recipe</span>
          </button>
        );

      case "minimal":
        return (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        );

      default: // icon
        return (
          <button
            onClick={handleNativeShare}
            className={`${sizeClasses[size]} bg-white border-2 border-stone-200 rounded-full flex items-center justify-center hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm hover:shadow-md`}
          >
            <Share2 className="w-4 h-4" />
          </button>
        );
    }
  };

  return (
    <div className="relative">
      {renderButton()}

      {/* Share Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 p-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">
                    Share Recipe
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Native Share Button (Mobile) */}
              {hasNativeShare && (
                <button
                  onClick={() => {
                    handleNativeShare();
                    setIsOpen(false);
                  }}
                  className="w-full mb-4 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share via System Menu
                </button>
              )}

              {/* Social Share Buttons */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-stone-600 mb-3">
                  Share to Social Media
                </p>
                <div className="grid grid-cols-4 gap-4">
                  {shareOptions.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => {
                        window.open(
                          option.url,
                          "_blank",
                          "width=600,height=400",
                        );
                        setIsOpen(false);
                      }}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div
                        className={`w-14 h-14 ${option.color} text-white rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg`}
                      >
                        <option.icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs text-stone-600 font-medium text-center">
                        {option.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instagram Story Guide */}
              <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-start gap-3">
                  <Instagram className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-stone-900 mb-1">
                      Share to Instagram
                    </h4>
                    <p className="text-xs text-stone-600 mb-2">
                      Download the image and upload to your Instagram Story or
                      Feed
                    </p>
                    {image && (
                      <button
                        onClick={handleDownloadImage}
                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-xs font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Download Image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Copy Link Section */}
              <div>
                <p className="text-sm font-semibold text-stone-600 mb-3">
                  Copy Link
                </p>
                <div className="flex items-center gap-2 p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-stone-600 outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-stone-900 text-white hover:bg-stone-800"
                    }`}
                  >
                    {copied ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Link2 className="w-4 h-4" />
                        Copy
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* QR Code Option (Optional Enhancement) */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    window.open(
                      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`,
                      "_blank",
                    );
                  }}
                  className="text-sm text-stone-500 hover:text-stone-700 transition-colors underline"
                >
                  Generate QR Code
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
