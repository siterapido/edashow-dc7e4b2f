import { HeroSection } from "@/components/hero-section"
import { SponsorCarousel } from "@/components/sponsor-carousel"
import { EditorialBlock, CardType } from "@/components/editorial-block"
import { Footer } from "@/components/footer"
import { Newsletter } from "@/components/newsletter"
import { Events } from "@/components/events"
import { LatestNews } from "@/components/latest-news"
import { EdaBioSection } from "@/components/eda-bio-section"
import BannerDisplay from "@/components/BannerDisplay"
import { getPosts, getSponsors, getImageUrl, getEvents } from "@/lib/supabase/api"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

// Função auxiliar para converter posts do Supabase para cards do EditorialBlock
function postsToCards(posts: any[]): Array<{
  type: CardType
  title: string
  excerpt?: string
  image: string
  category: string
  author?: string
  date?: string
  featured?: boolean
  slug?: string
}> {
  return posts.map((post) => {
    const cardType: CardType = post.category?.slug === 'opiniao' ? 'opinion' :
      post.category?.slug === 'analise' ? 'article' : 'news'

    return {
      type: cardType,
      title: post.title,
      excerpt: post.excerpt || '',
      image: post.cover_image_url || (post.featured_image ? post.featured_image.url : '/placeholder.jpg'),
      category: post.category?.name || 'Notícias',
      author: post.author?.name,
      date: post.published_at
        ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: ptBR })
        : undefined,
      featured: post.featured_home,
      slug: post.slug,
    }
  })
}

export default async function HomePage() {
  // Buscar posts publicados do Supabase
  const allPosts = await getPosts({
    limit: 18,
    status: 'published'
  })

  // Buscar todos os posts para o Hero Section (incluindo não-destaque)
  // O componente HeroSection fará a ordenação interna priorizando destaque e depois data
  const heroPosts = await getPosts({
    limit: 12,
    status: 'published'
  })

  // Buscar patrocinadores
  const sponsors = await getSponsors({
    active: true
  })

  // Buscar eventos
  const events = await getEvents({
    limit: 3,
    status: 'upcoming'
  })



  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection posts={heroPosts} />

        {/* Banner Hero - Topo da Home */}
        <BannerDisplay location="home_hero" className="container mx-auto px-4 py-6" />

        <SponsorCarousel sponsors={sponsors} />
        <LatestNews initialPosts={allPosts.slice(0, 12)} />
        <EdaBioSection />

        {/* Só mostra a seção de eventos se houver eventos cadastrados no banco */}
        {events && events.length > 0 && <Events initialEvents={events} />}

        {/* Banner Rodapé - Antes do Footer */}
        <BannerDisplay location="home_footer" className="container mx-auto px-4 py-6" />

        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}

