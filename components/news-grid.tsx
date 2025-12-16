"use client";

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { container, fadeIn } from "@/lib/motion"

const newsItems = [
  {
    id: 1,
    tag: "Notícias",
    title: "Cooperativa reforça protagonismo no setor com nova expansão",
    description: "A maior cooperativa de saúde em número de cooperados anuncia expansão para novas regiões do país...",
    date: "16 Dez 2025",
    readTime: "5 min",
    image: "/modern-healthcare-building.jpg"
  },
  {
    id: 2,
    tag: "Regulação",
    title: "STF publica acórdão com regras para judicialização",
    description: "Todas as ações judiciais envolvendo tema devem seguir novas diretrizes estabelecidas pelo tribunal...",
    date: "15 Dez 2025",
    readTime: "8 min",
    image: "/ans-building-court.jpg"
  },
  {
    id: 3,
    tag: "Mercado",
    title: "Reajuste médio dos planos de saúde será de 11,15%",
    description: "Confira as principais operadoras e seus respectivos aumentos que entram em vigor a partir de janeiro...",
    date: "14 Dez 2025",
    readTime: "3 min",
    image: "/healthcare-rating-stars.jpg"
  },
  {
    id: 4,
    tag: "Destaque",
    title: "Operadora é destaque na premiação dos mais influentes",
    description: "A lista lançada no último dia 17 de dezembro traz lideranças do setor de saúde...",
    date: "12 Dez 2025",
    readTime: "4 min",
    image: "/award-ceremony-healthcare.jpg"
  },
  {
    id: 5,
    tag: "Regulação",
    title: "Susep prepara ajuste que pode ampliar alcance da regulação",
    description: "O objetivo regulatório da Superintendência de Seguros Privados deverá impactar diversas seguradoras...",
    date: "10 Dez 2025",
    readTime: "6 min",
    image: "/susep-logo-green.jpg"
  },
  {
    id: 6,
    tag: "Eventos",
    title: "Grande evento do setor terá atrações especiais em São Paulo",
    description: "Conhecida por investir no bem-estar de sua equipe, a empresa promove celebração anual...",
    date: "09 Dez 2025",
    readTime: "2 min",
    image: "/corporate-event-celebration.png"
  },
]

export function NewsGrid() {
  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="container mx-auto px-4 py-16 bg-slate-50/50"
    >
      <div className="flex items-center justify-between mb-10">
        <motion.h2 
          variants={fadeIn("right")}
          className="text-3xl font-bold text-slate-800 tracking-tight"
        >
          Últimas <span className="text-primary">Notícias</span>
        </motion.h2>
        <motion.a 
          variants={fadeIn("left")}
          href="#" 
          className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
          whileHover={{ x: 5 }}
        >
          Ver todas as notícias &rarr;
        </motion.a>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsItems.map((item, index) => (
          <motion.div 
            key={item.id}
            variants={fadeIn("up", index * 0.1)}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card 
              className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white h-full"
            >
              <div className="relative aspect-video overflow-hidden">
                <motion.img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover" 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur text-slate-800 font-semibold shadow-sm hover:bg-white">
                    {item.tag}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {item.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.readTime}
                  </div>
                </div>
                
                <h3 className="font-bold text-xl mb-3 text-slate-800 line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
