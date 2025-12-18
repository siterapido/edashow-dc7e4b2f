"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { getPosts, getImageUrl } from "@/lib/payload/api"
import { getAllCategories, getCategoryInfo } from "@/lib/categories"
import { CategoryPreviewCard } from "./category-preview-card"
import { cn } from "@/lib/utils"

interface CategoryPosts {
  category: 'news' | 'analysis' | 'interviews' | 'opinion'
  posts: any[]
  loading: boolean
}

export function CategoryMegaMenu() {
  const [categoriesData, setCategoriesData] = useState<CategoryPosts[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      setIsLoading(true)
      const categories = getAllCategories()
      
      const promises = categories.map(async (cat) => {
        try {
          // Buscar posts via API diretamente (client-side safe)
          const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || window.location.origin
          const params = new URLSearchParams({
            limit: '3',
            'where[status][equals]': 'published',
            'where[category][equals]': cat.value,
            sort: '-publishedDate',
          })
          
          const response = await fetch(`${API_URL}/api/posts?${params.toString()}`)
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          
          const data = await response.json()
          const posts = data.docs || []
          
          return {
            category: cat.value,
            posts: posts,
            loading: false
          }
        } catch (error) {
          console.error(`Erro ao buscar posts da categoria ${cat.value}:`, error)
          // Retornar array vazio em caso de erro
          return {
            category: cat.value,
            posts: [],
            loading: false
          }
        }
      })

      const results = await Promise.all(promises)
      setCategoriesData(results)
      setIsLoading(false)
    }

    fetchCategoryPosts()
  }, [])

  const categories = getAllCategories()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[900px] max-w-[95vw] xl:max-w-[900px] bg-white rounded-lg shadow-xl border border-gray-200 py-4 md:py-6 z-50 overflow-hidden"
    >
      <div className="px-4 md:px-6 pb-3 md:pb-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base md:text-lg font-bold text-slate-900">Conteúdo</h3>
        <Link 
          href="/posts" 
          className="text-xs md:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
        >
          Ver tudo
          <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
        </Link>
      </div>

      <div className="px-4 md:px-6 pt-4 md:pt-6 max-h-[80vh] overflow-y-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-28 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category) => {
              const categoryData = categoriesData.find(
                (data) => data.category === category.value
              )
              const posts = categoryData?.posts || []
              const categoryInfo = getCategoryInfo(category.value)

              return (
                <div key={category.value} className="flex flex-col">
                  {/* Título da Categoria */}
                  <Link
                    href={`/${category.slug}`}
                    className="mb-3 md:mb-4 group"
                  >
                    <h4 
                      className="text-sm md:text-base font-bold text-slate-900 group-hover:text-primary transition-colors flex items-center gap-2"
                      style={{ color: categoryInfo.color }}
                    >
                      {category.label}
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {category.description}
                    </p>
                  </Link>

                  {/* Posts Preview */}
                  <div className="space-y-2 md:space-y-3 flex-1">
                    {posts.length > 0 ? (
                      posts.map((post) => (
                        <CategoryPreviewCard
                          key={post.id}
                          post={{
                            id: post.id,
                            title: post.title,
                            slug: post.slug,
                            excerpt: post.excerpt,
                            featuredImage: post.featuredImage,
                            category: post.category,
                            publishedDate: post.publishedDate,
                          }}
                        />
                      ))
                    ) : (
                      <div className="text-sm text-slate-400 py-4 text-center">
                        Nenhum post disponível
                      </div>
                    )}
                  </div>

                  {/* Link Ver Mais */}
                  {posts.length > 0 && (
                    <Link
                      href={`/${category.slug}`}
                      className="mt-3 md:mt-4 text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors group/link"
                    >
                      Ver mais {category.label.toLowerCase()}
                      <ArrowRight className="w-3 h-3 transform group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}



