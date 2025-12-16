"use client";

import { motion } from "framer-motion"

export function AdBanners() {
  return (
    <section className="w-full py-8 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* App Download Banner */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-orange-600 p-8 text-white shadow-lg cursor-pointer"
          >
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
              <div>
                <motion.h3 
                  className="text-2xl font-bold mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Baixe nosso App
                </motion.h3>
                <p className="text-white/90 max-w-xs">Tenha o cotador de planos de saúde na palma da sua mão com funcionalidades exclusivas.</p>
              </div>
              <div className="mt-4 flex gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="h-10 bg-white/20 rounded-lg w-32 backdrop-blur-sm hover:bg-white/30 transition-colors" 
                />
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="h-10 bg-white/20 rounded-lg w-32 backdrop-blur-sm hover:bg-white/30 transition-colors" 
                />
              </div>
            </div>
            <motion.div 
              className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Cotador Banner */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative overflow-hidden rounded-2xl bg-slate-900 p-8 text-white shadow-lg cursor-pointer"
          >
            <div className="relative z-10 flex items-center justify-between h-full min-h-[160px]">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-white">C | S</h3>
                <p className="text-slate-400 font-medium">Cotador Simplificado</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-6 py-2 bg-white text-slate-900 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors"
                >
                  Acessar Agora
                </motion.button>
              </div>
              <motion.div 
                className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700"
                whileHover={{ rotate: 15, scale: 1.1 }}
              >
                <span className="text-4xl">📊</span>
              </motion.div>
            </div>
            <motion.div 
              className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 rounded-full translate-y-1/2 translate-x-1/4 blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
