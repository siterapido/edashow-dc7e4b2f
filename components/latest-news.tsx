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
    slug: "usisaude-seguro-cresceu-em-2025-e-projeta-expansao-nacional-em-2026",
    featuredImage: "/professional-man-ricardo-rodrigues.jpg"
  },
  {
    id: 2,
    title: "Odont reforça protagonismo no Nordeste",
    excerpt: "A Odont, maior cooperativa de Odontologia em número de cooperados (mais de 15mil), anunciou...",
    publishedDate: new Date(Date.now() - 86400000).toISOString(),
    slug: "odont-reforca-protagonismo-no-nordeste",
    featuredImage: "/odont-award-ceremony.jpg"
  },
  {
    id: 3,
    title: "STF publica acórdão com regras para judicialização da cobertura fora do rol da ANS",
    excerpt: "Todas as ações judiciais envolvendo cobertura de tratamentos que não estejam no rol...",
    publishedDate: new Date(Date.now() - 172800000).toISOString(),
    slug: "stf-publica-acordao-com-regras-para-judicializacao-da-cobertura-fora-do-rol-da-ans",
    featuredImage: "/ans-building-court.jpg"
  },
  {
    id: 4,
    title: "Reajuste médio dos planos de saúde foi de 11,15%; veja aumento das principais operadoras",
    excerpt:
      "Em 2024, o reajuste médio dos planos de saúde individuais registrou aumento que varia por operadora, saiba mais...",
    publishedDate: new Date(Date.now() - 259200000).toISOString(),
    slug: "reajuste-medio-dos-planos-de-saude-foi-de-11-15-veja-aumento-das-principais-operadoras",
    featuredImage: "/healthcare-operators-increase.jpg"
  },
  {
    id: 5,
    title: "Telemedicina ganha força com novas regulamentações da ANS",
    excerpt:
      "Novas diretrizes facilitam acesso a consultas remotas e ampliam cobertura para pacientes em todo o país...",
    publishedDate: new Date(Date.now() - 345600000).toISOString(),
    slug: "telemedicina-ganha-forca-com-novas-regulamentacoes-da-ans",
    featuredImage: "/smartphone-health-app.jpg"
  },
  {
    id: 6,
    title: "Operadoras investem em tecnologia para reduzir custos administrativos",
    excerpt:
      "Sistemas de gestão integrados e automação de processos prometem economia de até 30% nos custos operacionais...",
    publishedDate: new Date(Date.now() - 432000000).toISOString(),
    slug: "operadoras-investem-em-tecnologia-para-reduzir-custos-administrativos",
    featuredImage: "/modern-healthcare-building.jpg"
  },
  {
    id: 7,
    title: "ANS anuncia novas regras para planos odontológicos em 2026",
    excerpt:
      "Mudanças visam aumentar transparência e melhorar qualidade do atendimento odontológico para beneficiários...",
    publishedDate: new Date(Date.now() - 518400000).toISOString(),
    slug: "ans-anuncia-novas-regras-para-planos-odontologicos-em-2026",
    featuredImage: "/business-executive-professional.jpg"
  },
  {
    id: 8,
    title: "Setor de saúde suplementar debate futuro do setor em congresso nacional",
    excerpt:
      "Líderes do setor se reúnem para discutir inovações, regulamentações e tendências do mercado de planos de saúde...",
    publishedDate: new Date(Date.now() - 604800000).toISOString(),
    slug: "setor-de-saude-suplementar-debate-futuro-do-setor-em-congresso-nacional",
    featuredImage: "/conference-healthcare-panel.jpg"
  },
]

export function LatestNews() {
  const [posts, setPosts] = useState<any[]>(fallbackNews);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await getPosts({ 
          limit: 8, 
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
      viewport={{ once: true, margin: "-100px" }}
      className="bg-gray-50 py-12 min-h-[400px]"
    >
      <div className="container mx-auto px-4">
        <motion.h2 variants={fadeIn("up")} className="text-3xl font-bold text-center mb-8 text-black">
          Últimas <span className="text-primary">Notícias</span>
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {posts.length > 0 && posts.map((item: any, index: number) => {
            // Determinar a URL da imagem
            const imageUrl = item.featuredImage 
              ? (typeof item.featuredImage === 'string' 
                  ? item.featuredImage 
                  : getImageUrl(item.featuredImage, 'thumbnail'))
              : null;

            return (
              <motion.div
                key={item.id || index}
                variants={fadeIn("up", index * 0.1)}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link href={item.slug ? `/posts/${item.slug}` : '#'}>
                  <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-100 hover:border-slate-200 bg-white group overflow-hidden py-0 gap-0">
                    {imageUrl ? (
                      <div className="relative w-full h-48 flex-shrink-0 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={item.title || 'Notícia'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center">
                        <span className="text-gray-400 text-sm font-medium">Sem imagem</span>
                      </div>
                    )}
                    <div className="flex flex-col flex-1 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">
                          Notícia
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          {item.publishedDate 
                            ? formatDistanceToNow(new Date(item.publishedDate), { 
                                addSuffix: true, 
                                locale: ptBR 
                              })
                            : 'Recente'}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-lg leading-tight mb-3 text-primary group-hover:text-primary/80 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                        {item.excerpt || item.description}
                      </p>
                      
                      <div className="flex items-center text-primary font-medium text-sm group/link mt-auto">
                        Ler mais 
                        <svg className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  )
}
