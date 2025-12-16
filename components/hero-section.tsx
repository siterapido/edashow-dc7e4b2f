"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-[#0f172a] text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/modern-healthcare-building.jpg" 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-900/80" />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Main Content */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn("right", 0.3)}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-white hover:bg-primary/90 border-none px-3 py-1 text-sm font-semibold uppercase tracking-wider">
                Destaque do Dia
              </Badge>
              <span className="flex items-center gap-1 text-slate-400 text-sm">
                <Clock className="w-3 h-3" />
                Há 2 horas
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
              Setor de saúde suplementar projeta expansão nacional para 2026
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl">
              Novas tecnologias e regulação favorável impulsionam crescimento recorde no último trimestre, segundo relatório da ANS.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20">
                Ler matéria completa
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-slate-600 text-white hover:bg-slate-800 hover:text-white rounded-full px-6 h-12">
                <Share2 className="mr-2 w-4 h-4" />
                Compartilhar
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
             initial="hidden"
             whileInView="show"
             viewport={{ once: true }}
             variants={fadeIn("left", 0.5)}
             className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-[16/10] group cursor-pointer">
              <img 
                src="/modern-healthcare-building.jpg" 
                alt="Saúde Suplementar" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
              
              {/* Image Caption/Credit */}
              <div className="absolute bottom-4 right-4 text-xs text-white/60">
                Foto: Divulgação / ANS
              </div>
            </div>

            {/* Floating Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl max-w-[200px] hidden lg:block"
            >
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-xs font-bold text-slate-500 uppercase">Em Alta</span>
               </div>
               <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                 +15% de crescimento no setor este ano
               </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
