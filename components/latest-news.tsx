"use client";

import { Card } from "@/components/ui/card"
import { getPosts, getImageUrl } from "@/lib/payload/api"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion } from "framer-motion"
import { container, fadeIn } from "@/lib/motion"
import { useEffect, useState } from "react"

// Dados fallback caso o CMS não esteja disponível
const fallbackNews = [
  {
    id: 1,
    title: "Usisaúde Seguro cresceu em 2025 e projeta expansão nacional em 2026 sob liderança de Ricardo Rodrigues",
    excerpt:
      "A Usisaúde alcançou resultados expressivos em 2025, ampliando sua presença no mercado e consolidando...",
    publishedDate: new Date().toISOString(),
    slug: "#",
    featuredImage: "/professional-man-ricardo-rodrigues.jpg"
  },
  {
    id: 2,
    title: "Odont reforça protagonismo no Nordeste",
    excerpt: "A Odont, maior cooperativa de Odontologia em número de cooperados (mais de 15mil), anunciou...",
    publishedDate: new Date(Date.now() - 86400000).toISOString(),
    slug: "#",
    featuredImage: "/odont-award-ceremony.jpg"
  },
  {
    id: 3,
    title: "STF publica acórdão com regras para judicialização da cobertura fora do rol da ANS",
    excerpt: "Todas as ações judiciais envolvendo cobertura de tratamentos que não estejam no rol...",
    publishedDate: new Date(Date.now() - 172800000).toISOString(),
    slug: "#",
    featuredImage: "/ans-building-court.jpg"
  },
  {
    id: 4,
    title: "Reajuste médio dos planos de saúde foi de 11,15%; veja aumento das principais operadoras",
    excerpt:
      "Em 2024, o reajuste médio dos planos de saúde individuais registrou aumento que varia por operadora, saiba mais...",
    publishedDate: new Date(Date.now() - 259200000).toISOString(),
    slug: "#",
    featuredImage: "/healthcare-operators-increase.jpg"
  },
]

export function LatestNews() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await getPosts({ 
          limit: 4, 
          status: 'published',
          revalidate: 60 
        });
        if (!data || data.length === 0) {
          data = fallbackNews;
        }
        setPosts(data);
      } catch (e) {
        setPosts(fallbackNews);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="bg-gray-50 py-12"
    >
      <div className="container mx-auto px-4">
        <motion.h2 variants={fadeIn("up")} className="text-3xl font-bold text-center mb-8">
          Últimas Notícias
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {posts.map((item: any, index: number) => (
            <motion.div
              key={item.id}
              variants={fadeIn("up", index * 0.1)}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link href={`/posts/${item.slug}`}>
                <Card className="flex gap-4 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-transparent hover:border-slate-200 bg-white h-full group">
                  {item.featuredImage ? (
                    <div className="relative w-32 h-24 rounded flex-shrink-0 overflow-hidden">
                      <Image
                        src={getImageUrl(item.featuredImage, 'thumbnail')}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex-shrink-0 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Notícia</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {item.excerpt || item.description}
                    </p>
                    <span className="text-xs text-primary font-medium">
                      {item.publishedDate 
                        ? formatDistanceToNow(new Date(item.publishedDate), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })
                        : 'Recente'}
                    </span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
