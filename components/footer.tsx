"use client";

import { Instagram, Linkedin, Youtube, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4 md:space-y-6">
            <Logo imageClassName="h-10 md:h-12 w-auto drop-shadow-none" variant="dark" />
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              O principal portal de notícias e insights sobre saúde suplementar, conectando líderes e transformando o setor através da informação.
            </p>
            <div className="flex gap-3 md:gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all min-w-[44px] min-h-[44px]">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all min-w-[44px] min-h-[44px]">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all min-w-[44px] min-h-[44px]">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Editorial */}
          <div>
            <h4 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">Editorial</h4>
            <ul className="space-y-2 md:space-y-3">
              <li><a href="#" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Política e Regulação</a></li>
              <li><a href="#" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Economia e Mercado</a></li>
              <li><a href="#" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Tecnologia e Inovação</a></li>
              <li><a href="#" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Gestão Hospitalar</a></li>
              <li><a href="#" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Operadoras</a></li>
              <li><a href="#" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Carreira e Liderança</a></li>
            </ul>
          </div>

          {/* Institutional */}
          <div>
            <h4 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">Institucional</h4>
            <ul className="space-y-2 md:space-y-3">
              <li><a href="#" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Sobre o EDA Show</a></li>
              <li><a href="#" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Anuncie Conosco</a></li>
              <li><a href="#" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Media Kit</a></li>
              <li><a href="#" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Política de Privacidade</a></li>
              <li><a href="#" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Termos de Uso</a></li>
              <li><a href="#" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Trabalhe Conosco</a></li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4 md:space-y-6">
            <h4 className="text-white font-bold text-base md:text-lg">Newsletter</h4>
            <p className="text-sm text-slate-400">Receba nossa curadoria diária de notícias.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                placeholder="Seu e-mail corporativo" 
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary flex-1 min-h-[44px]"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white min-h-[44px] whitespace-nowrap">
                Assinar
              </Button>
            </div>
            
            <div className="pt-4 md:pt-6 border-t border-slate-800 space-y-2 md:space-y-3">
              <div className="flex items-center gap-2 md:gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="break-all">contato@edashow.com.br</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 md:pt-8 border-t border-slate-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo imageClassName="h-8 w-auto drop-shadow-none" variant="dark" />
            <p className="text-xs md:text-sm text-slate-500">
              &copy; {new Date().getFullYear()} EDA Show. Todos os direitos reservados.
            </p>
          </div>
          <p className="text-xs md:text-sm text-slate-600">
            Desenvolvido com tecnologia de ponta.
          </p>
        </div>
      </div>
    </footer>
  );
}
