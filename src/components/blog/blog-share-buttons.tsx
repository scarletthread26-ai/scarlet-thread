"use client";

import React, { useState } from "react";
import { Link as LinkIcon, Check, Send } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faFacebookF, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { toast } from "sonner";

interface BlogShareButtonsProps {
  title: string;
  slug: string;
}

export function BlogShareButtons({ title, slug }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blogs/${slug}`;
    }
    return `https://scarletthread.ae/blogs/${slug}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + getShareUrl())}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;

  return (
    <div className="flex flex-wrap items-center gap-2 select-none">
      <span className="text-xs font-bold text-slate-450 mr-1 uppercase tracking-wider">Share Article:</span>
      
      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center border border-emerald-100 transition-all shadow-xs"
        title="Share on WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
      </a>

      {/* Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center border border-blue-100 transition-all shadow-xs"
        title="Share on Facebook"
      >
        <FontAwesomeIcon icon={faFacebookF} className="w-3.5 h-3.5" />
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 hover:bg-cyan-600 hover:text-white flex items-center justify-center border border-cyan-100 transition-all shadow-xs"
        title="Share on LinkedIn"
      >
        <FontAwesomeIcon icon={faLinkedinIn} className="w-3.5 h-3.5" />
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="w-8 h-8 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-600 hover:text-white flex items-center justify-center border border-slate-200/60 transition-all shadow-xs cursor-pointer"
        title="Copy link to clipboard"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <LinkIcon className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
