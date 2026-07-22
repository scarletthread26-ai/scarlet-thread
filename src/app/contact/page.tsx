"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setName("");
      setEmail("");
      setMessage("");
      toast.success("Thank you! Your message has been sent successfully.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFE] py-5">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-heading font-bold text-slate-800"
          >
            Contact <span className="text-primary">Us</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-muted-foreground mt-3 max-w-xl mx-auto"
          >
            Have a question about customization, sizing, or corporate gifting? Get in touch with our team.
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
          
          {/* Contact Details Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 p-6 md:p-8 space-y-8 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-2">Get in touch</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Whether you want to place a custom bulk order or need updates on your delivery, our support team is here to help you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-purple-50 text-primary rounded-xl border border-purple-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp & Call</h4>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">+971 50 123 4567</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-purple-50 text-primary rounded-xl border border-purple-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Support</h4>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">support@thescarletthread.ae</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-purple-50 text-primary rounded-xl border border-purple-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Showroom & Workshop</h4>
                  <p className="text-sm font-bold text-slate-700 mt-0.5 leading-relaxed">
                    Al Quoz Industrial Area 3,<br />Dubai, United Arab Emirates
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 text-xs text-slate-450 leading-relaxed">
              * Support hours: Monday to Saturday from 9:00 AM to 6:00 PM.
            </div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-650/20 focus:border-purple-650 transition"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-650/20 focus:border-purple-650 transition"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-650/20 focus:border-purple-650 transition leading-relaxed"
                  placeholder="How can we help you today?"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-3 rounded-xl transition duration-200 text-sm shadow-md shadow-purple-600/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Send Message</span>
              </button>
            </form>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
