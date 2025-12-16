"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export type CardType = "news" | "article" | "video" | "opinion";

interface EditorialCardProps {
  type?: CardType;
  title: string;
  excerpt?: string;
  image: string;
  category: string;
  author?: string;
  date?: string;
  featured?: boolean;
  slug?: string;
}

export function EditorialCard({ 
  type = "news", 
  title, 
  excerpt, 
  image, 
  category, 
  author,
  date,
  featured = false,
  slug
}: EditorialCardProps) {
  const cardContent = (
    <Card className={`h-full border-none shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col ${featured ? 'bg-slate-900 text-white' : 'bg-white'}`}>
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <PlayCircle className="w-12 h-12 text-white opacity-90 drop-shadow-lg" />
          </div>
        )}
        <Badge className={`absolute top-3 left-3 ${featured ? 'bg-primary text-white border-none' : 'bg-white/90 text-slate-800 backdrop-blur-sm'}`}>
          {category}
        </Badge>
      </div>
      
      <CardContent className={`flex-1 p-5 ${featured ? 'text-white' : ''}`}>
        {type === "opinion" && author && (
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
            Opinião / {author}
          </p>
        )}
        
        <h3 className={`font-bold leading-tight mb-2 ${featured ? 'text-2xl' : 'text-lg text-slate-900'}`}>
          {title}
        </h3>
        
        {excerpt && (
          <p className={`text-sm line-clamp-3 ${featured ? 'text-slate-300' : 'text-slate-500'}`}>
            {excerpt}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex justify-between items-center">
        <span className={`text-xs ${featured ? 'text-slate-400' : 'text-slate-400'}`}>
          {date || "Há 2 horas"}
        </span>
        <Button variant="link" className={`p-0 h-auto font-semibold ${featured ? 'text-primary' : 'text-primary hover:text-primary/80'}`}>
          Ler mais <ArrowRight className="ml-1 w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  if (slug) {
    return (
      <motion.div whileHover={{ y: -5 }} className="h-full">
        <Link href={`/posts/${slug}`} className="block h-full">
          {cardContent}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      {cardContent}
    </motion.div>
  );
}

interface EditorialBlockProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  cards: EditorialCardProps[];
}

export function EditorialBlock({ title, subtitle, ctaText = "Ver mais", ctaLink = "#", cards }: EditorialBlockProps) {
  return (
    <section className="py-12 border-b border-slate-100 last:border-0">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <Link href={ctaLink}>
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5 hidden sm:flex">
              {ctaText} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <EditorialCard key={index} {...card} />
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link href={ctaLink}>
            <Button variant="outline" className="w-full border-primary text-primary">
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
