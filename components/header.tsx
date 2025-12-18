"use client";

import { Search, Menu, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { CategoryMegaMenu } from "@/components/category-mega-menu";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Cleanup timeout ao desmontar
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
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
    { label: "Sobre Nós", href: "/sobre" },
    {
      label: "Conteúdo",
      href: "#",
      hasDropdown: true,
      dropdownItems: [
        { label: "Notícias", href: "/noticias", description: "Últimas notícias do setor" },
        { label: "Análises", href: "/analises", description: "Análises profundas e estudos" },
        { label: "Entrevistas", href: "/entrevistas", description: "Conversas exclusivas" },
        { label: "Opinião", href: "/opiniao", description: "Artigos e editoriais" },
        { label: "Colunas", href: "#", description: "Colunistas especializados" },
      ]
    },
    { label: "Eventos", href: "/events" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b",
        "bg-primary text-primary-foreground border-primary-foreground/10 shadow-md"
      )}
    >
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            className="group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Logo
              containerClassName="flex items-center gap-2 group cursor-pointer"
              imageClassName="h-8 w-auto md:h-10 lg:h-12"
              priority
            />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/90">
            {menuItems.map((item, i) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  if (item.hasDropdown) {
                    // Limpar timeout anterior se existir
                    if (dropdownTimeoutRef.current) {
                      clearTimeout(dropdownTimeoutRef.current);
                      dropdownTimeoutRef.current = null;
                    }
                    setActiveDropdown(item.label);
                  }
                }}
                onMouseLeave={() => {
                  // Delay de 200ms antes de fechar para permitir movimento do mouse
                  if (item.hasDropdown) {
                    dropdownTimeoutRef.current = setTimeout(() => {
                      setActiveDropdown(null);
                    }, 200);
                  }
                }}
              >
                <motion.a
                  href={item.href}
                  className={cn(
                    "relative hover:text-white transition-colors py-2 flex items-center gap-1",
                    item.hasDropdown && "cursor-pointer"
                  )}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  whileHover="hover"
                  onClick={(e) => {
                    if (item.hasDropdown) {
                      e.preventDefault();
                      setActiveDropdown(activeDropdown === item.label ? null : item.label);
                    }
                  }}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      activeDropdown === item.label && "rotate-180"
                    )} />
                  )}
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-white"
                    initial={{ scaleX: 0 }}
                    variants={{
                      hover: { scaleX: 1 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                </motion.a>

                {/* Mega Menu para Conteúdo */}
                {item.hasDropdown && item.label === "Conteúdo" && activeDropdown === item.label && (
                  <div
                    onMouseEnter={() => {
                      // Limpar timeout quando mouse entra no menu
                      if (dropdownTimeoutRef.current) {
                        clearTimeout(dropdownTimeoutRef.current);
                        dropdownTimeoutRef.current = null;
                      }
                    }}
                    onMouseLeave={() => {
                      setActiveDropdown(null);
                    }}
                  >
                    <AnimatePresence>
                      <CategoryMegaMenu />
                    </AnimatePresence>
                  </div>
                )}

                {/* Dropdown simples para outros itens */}
                {item.hasDropdown && item.label !== "Conteúdo" && item.dropdownItems && activeDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                  >
                    {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                      <a
                        key={dropdownItem.label}
                        href={dropdownItem.href}
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="font-medium text-gray-900">{dropdownItem.label}</div>
                        <div className="text-sm text-gray-500">{dropdownItem.description}</div>
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>
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
              className="text-white hover:bg-white/20 rounded-full hidden sm:flex min-w-[44px] min-h-[44px]"
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
            
             <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full md:hidden min-w-[44px] min-h-[44px]">
              <Search className="w-5 h-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white hover:bg-white/20 min-w-[44px] min-h-[44px]"
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
            <nav className="flex flex-col p-4 gap-2">
              <div className="flex justify-center mb-4">
                <Logo
                  containerClassName="justify-center"
                  imageClassName="h-8 w-auto drop-shadow-none"
                />
              </div>

              {/* Menu Items */}
              {menuItems.map((item) => (
                <div key={item.label}>
                  <a
                    href={item.href}
                    className="text-base md:text-lg font-medium hover:text-primary transition-colors py-3 px-2 border-b border-muted min-h-[44px] flex items-center justify-between"
                    onClick={() => {
                      if (item.hasDropdown) {
                        setActiveDropdown(activeDropdown === item.label ? null : item.label);
                      } else {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        activeDropdown === item.label && "rotate-180"
                      )} />
                    )}
                  </a>

                  {/* Mobile Dropdown */}
                  {item.hasDropdown && item.dropdownItems && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 border-l-2 border-primary/20"
                    >
                      {item.dropdownItems.map((dropdownItem) => (
                        <a
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="block py-2 px-4 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="font-medium">{dropdownItem.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{dropdownItem.description}</div>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
