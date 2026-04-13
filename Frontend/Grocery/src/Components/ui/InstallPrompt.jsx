import React, { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Check if already installed
      if (!window.matchMedia("(display-mode: standalone)").matches) {
        // Show the install banner after a short delay
        setTimeout(() => setIsVisible(true), 3000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-4 right-4 z-[70] lg:hidden"
      >
        <div className="bg-brand-600 rounded-3xl p-5 shadow-2xl flex items-center gap-4 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
          
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <Smartphone size={24} />
          </div>
          
          <div className="flex-1">
            <h4 className="font-black text-sm tracking-tight leading-tight">Install GreenCart App</h4>
            <p className="text-[10px] text-brand-100 font-bold opacity-80 mt-1">Faster access & offline shopping</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
                size="sm" 
                onClick={handleInstallClick}
                className="bg-white text-brand-600 hover:bg-brand-50 border-none h-9 px-4 rounded-xl text-xs font-black uppercase tracking-widest"
            >
              <Download size={14} className="mr-1.5" /> Install
            </Button>
            <button 
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;
