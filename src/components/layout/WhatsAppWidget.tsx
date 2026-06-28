"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'

import { useSettings } from '@/hooks/use-settings'

const WHATSAPP_PHONE_NUMBER = "919876543210" // The Scarlet Thread business number fallback

interface ChatOption {
  id: string
  label: string
  message: string
}

const chatOptions: ChatOption[] = [
  {
    id: 'custom',
    label: '🎁 Gift Customization',
    message: 'Hello! I am interested in getting a custom embroidered gift. Could you share details about customization options?'
  },
  {
    id: 'track',
    label: '📦 Track My Order',
    message: 'Hello! I would like to track my order. Can you please help me with the status of my order?'
  },
  {
    id: 'general',
    label: '❓ General Inquiry',
    message: 'Hello! I have a general inquiry about your collections and shipping.'
  }
]

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<ChatOption | null>(null)
  const { data: settings } = useSettings()

  const rawPhone = settings?.whatsapp_number || WHATSAPP_PHONE_NUMBER
  const cleanedPhone = rawPhone.replace(/\D/g, '')

  const handleOpenDirectChat = () => {
    const text = selectedOption 
      ? selectedOption.message 
      : 'Hello! I would like to make an inquiry.'
    
    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed z-50 select-none">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 w-[350px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-[#0b141a] shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-neutral-800 flex flex-col text-white font-sans"
          >
            {/* Header */}
            <div className="bg-[#095e54] p-4 flex items-center justify-between border-b border-emerald-900/30">
              <div className="flex items-center gap-3">
                {/* Logo Avatar */}
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md">
                  <img
                    src="/images/logo/logo.png"
                    alt="The Scarlet Thread Logo"
                    className="h-full w-full object-contain"
                    style={{ filter: "hue-rotate(23deg) saturate(138%) brightness(70%) contrast(335%)" }}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[15px] leading-tight text-white flex items-center gap-1.5">
                    Scarlet Support
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </h4>
                  <span className="text-[11px] text-white/80">Typically replies in minutes</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close support chat"
              >
                <X className="h-5 w-5 text-white/80 hover:text-white" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-4 max-h-[380px] overflow-y-auto bg-[#0b141a] bg-opacity-95 scrollbar-thin">
              {/* Support Greeting Bubble */}
              <div className="space-y-1">
                <div className="bg-[#202c33] text-[13.5px] leading-relaxed p-3.5 rounded-xl rounded-tl-none max-w-[85%] text-neutral-100 shadow-sm">
                  Hello! 👋 Welcome to The Scarlet Thread. How can we assist you with your personalized gift, order status, or embroidery inquiry today?
                </div>
                <span className="text-[10px] text-neutral-500 pl-1">Just now</span>
              </div>

              {/* Options Section */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                  Select an Option:
                </span>
                <div className="flex flex-col gap-2">
                  {chatOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option)}
                      className={`text-left text-[12.5px] font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 border cursor-pointer ${
                        selectedOption?.id === option.id
                          ? 'bg-[#00a884] text-white border-transparent shadow-md'
                          : 'bg-[#111b21] hover:bg-[#202c33] text-emerald-400 border-neutral-800'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-neutral-800/60 bg-[#111b21]">
              <button
                onClick={handleOpenDirectChat}
                className="w-full bg-[#00a884] hover:bg-[#00c298] text-white font-bold text-[13.5px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Send className="h-4 w-4" />
                OPEN DIRECT CHAT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 lg:bottom-6 right-6 z-50 h-14 w-14 rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer bg-[#25D366] text-white"
        aria-label="Toggle WhatsApp chat support"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="whatsapp"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-7 w-7"
            >
              {/* Official WhatsApp SVG Icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.435 1.451 5.394 0 9.782-4.386 9.785-9.78.002-2.612-1.015-5.07-2.864-6.92C17.155 2.055 14.7 1.036 12.01 1.036c-5.398 0-9.786 4.387-9.79 9.781 0 1.99.517 3.93 1.5 5.645l-.999 3.65 3.734-.978zm11.566-5.83c-.29-.146-1.727-.852-1.993-.95-.267-.097-.46-.146-.653.146-.193.29-.747.95-.916 1.146-.17.195-.339.213-.63.067-.29-.147-1.223-.45-2.329-1.44-.86-.767-1.44-1.716-1.609-2.007-.17-.29-.018-.447.129-.592.13-.13.29-.34.436-.509.145-.17.193-.29.29-.485.097-.194.049-.364-.025-.509-.072-.146-.653-1.577-.894-2.158-.236-.569-.475-.491-.653-.5-.17-.008-.364-.01-.557-.01-.193 0-.507.073-.77.364-.263.29-1.006.983-1.006 2.397 0 1.413 1.029 2.78 1.173 2.973.145.194 2.023 3.09 4.898 4.331.684.296 1.218.473 1.635.606.688.219 1.314.188 1.81.114.551-.082 1.727-.706 1.97-.1.242-1.12.242-2.08.169-2.176-.073-.097-.267-.146-.557-.292z"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}
