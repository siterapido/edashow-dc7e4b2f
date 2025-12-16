"use client";

import { Search, Menu, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Verificar se a API de notificações está disponível
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    // Verificar se a API de notificações está disponível
    if (!("Notification" in window)) {
      alert("Seu navegador não suporta notificações.");
      return;
    }

    // Se já tiver permissão, não precisa solicitar novamente
    if (Notification.permission === "granted") {
      alert("Você já tem permissão para receber notificações!");
      return;
    }

    // Se a permissão foi negada anteriormente, informar o usuário
    if (Notification.permission === "denied") {
      alert("As notificações foram bloqueadas. Por favor, permita notificações nas configurações do seu navegador.");
      return;
    }

    // Solicitar permissão
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === "granted") {
        // Criar uma notificação de teste
        new Notification("Notificações Ativadas!", {
          body: "Você agora receberá notificações do site.",
          icon: "/favicon.ico",
          badge: "/favicon.ico",
        });
      } else if (permission === "denied") {
        alert("Permissão de notificações negada. Você pode alterar isso nas configurações do navegador.");
      }
    } catch (error) {
      console.error("Erro ao solicitar permissão de notificações:", error);
      alert("Ocorreu um erro ao solicitar permissão de notificações.");
    }
  };

  const menuItems = [
    { label: "Para Você", href: "#" },
    { label: "Empresas", href: "#" },
    { label: "Notícias", href: "#" },
    { label: "Eventos", href: "#" },
    { label: "Colunas", href: "#" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b",
        "bg-primary text-primary-foreground border-primary-foreground/10 shadow-md"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            className="group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Logo
              containerClassName="flex items-center gap-2 group cursor-pointer"
              imageClassName="h-10 w-auto md:h-12"
              priority
            />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/90">
            {menuItems.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="relative hover:text-white transition-colors py-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                whileHover="hover"
              >
                {item.label}
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-white"
                  initial={{ scaleX: 0 }}
                  variants={{
                    hover: { scaleX: 1 }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </motion.a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search Bar - Desktop */}
            <motion.div 
              className="relative hidden md:block group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-48 bg-white/10 text-white placeholder:text-white/70 pl-4 pr-10 rounded-full border-transparent focus:bg-white focus:text-primary focus:placeholder:text-muted-foreground focus:w-64 transition-all duration-300 h-9"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 group-hover:text-white group-focus-within:text-muted-foreground transition-colors" />
            </motion.div>

            {/* Icons Actions */}
             <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 rounded-full hidden sm:flex"
              onClick={requestNotificationPermission}
              title={
                notificationPermission === "granted" 
                  ? "Notificações ativadas" 
                  : notificationPermission === "denied"
                  ? "Notificações bloqueadas"
                  : "Ativar notificações"
              }
            >
              <Bell className={cn(
                "w-5 h-5",
                notificationPermission === "granted" && "text-green-300"
              )} />
            </Button>
            
             <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full md:hidden">
              <Search className="w-5 h-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white hover:bg-white/20"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

       {/* Mobile Menu */}
       <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white text-foreground border-t"
          >
            <nav className="flex flex-col p-4 gap-4">
              <div className="flex justify-center">
                <Logo
                  containerClassName="justify-center"
                  imageClassName="h-8 w-auto drop-shadow-none"
                />
              </div>
               {menuItems.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href} 
                  className="text-lg font-medium hover:text-primary transition-colors py-2 border-b border-muted last:border-0"
                >
                  {item.label}
                </a>
               ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
