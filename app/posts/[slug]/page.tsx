import { getPostBySlug, getImageUrl, getSponsors } from '@/lib/supabase/api'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PostSidebar } from '@/components/post-sidebar'
import BannerDisplay from '@/components/BannerDisplay'
import { PostImageGallery } from '@/components/post-image-gallery'
import { RelatedPosts } from '@/components/related-posts'
import { SocialShare } from '@/components/social-share'

// Força renderização dinâmica para evitar erros de serialização durante build
export const dynamic = 'force-dynamic'
export const dynamicParams = true

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Metadados da página
export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post não encontrado',
    }
  }

  return {
    title: `${post.title} | EdaShow`,
    description: post.excerpt || 'Leia mais no EdaShow',
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image ? [post.featured_image.url] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Buscar patrocinadores ativos
  const sponsors = await getSponsors({
    active: true
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Botão Voltar */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Header - Largura Total */}
      <header className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Categoria */}
          <div className="flex items-center gap-2 mb-4">
            {post.category && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {post.category.title}
              </span>
            )}
            {post.featured && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                ⭐ Destaque
              </span>
            )}
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-slate-900">
            {post.title}
          </h1>

          {/* Resumo */}
          {post.excerpt && (
            <p className="text-xl text-slate-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta informações */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {post.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.published_at}>
                  {format(new Date(post.published_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </time>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Banner Publicitário - Topo do Artigo */}
      <div className="container mx-auto px-4 mb-8">
        <BannerDisplay location="article_top" className="max-w-4xl mx-auto" />
      </div>

      {/* Grid Layout: Conteúdo Principal + Sidebar */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna Principal - Conteúdo do Artigo */}
          <article className="lg:col-span-8">
            {/* Imagem Destacada */}
            {post.featured_image && (
              <div className="relative w-full h-[400px] md:h-[500px] mb-8 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={post.featured_image.url}
                  alt={post.featured_image.alt_text || post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Conteúdo do Artigo */}
            <div
              className="prose prose-lg max-w-none mb-8 tiptap-content"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            {/* Banner In-Article - No meio do conteúdo */}
            <div className="my-12">
              <BannerDisplay location="article_content" />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8 pt-8 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Compartilhamento Social */}
            <SocialShare
              url={`/posts/${slug}`}
              title={post.title}
              description={post.excerpt}
            />

            {/* Informações do Autor (expandido) - Mantido no final do conteúdo */}
            {post.author && (
              <div className="border-t border-slate-200 pt-8 mt-8">
                <h3 className="text-2xl font-bold mb-6 text-slate-900">Sobre o Autor</h3>
                <div className="flex gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <Avatar className="h-24 w-24 shrink-0">
                    {post.author.avatar_url ? (
                      <AvatarImage
                        src={post.author.avatar_url}
                        alt={post.author.name}
                      />
                    ) : (
                      <AvatarImage
                        src="/logo-dark.png"
                        alt="EDA Show Logo"
                        className="object-contain p-2 bg-white"
                      />
                    )}
                    <AvatarFallback className="bg-white">
                      <Image
                        src="/logo-dark.png"
                        alt="EDA Show Logo"
                        width={80}
                        height={80}
                        className="object-contain p-2"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-bold text-xl text-slate-900 mb-1">{post.author.name}</p>
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">{post.author.bio}</p>
                    <div className="flex gap-4 pt-2 border-t border-slate-200">
                      {post.author.twitter_url && (
                        <a
                          href={post.author.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                        >
                          Twitter
                        </a>
                      )}
                      {post.author.instagram_url && (
                        <a
                          href={post.author.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                        >
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Sidebar - Widgets */}
          <aside className="lg:col-span-4">
            <div className="sticky top-6">
              <PostSidebar author={post.author} sponsors={sponsors} />
            </div>
          </aside>
        </div>

        {/* Posts Relacionados */}
        <div className="max-w-4xl mx-auto">
          {/* RelatedPosts might need update too if it uses Payload internaly */}
          <RelatedPosts currentSlug={slug} />
        </div>
      </div>
    </div>
  )
}


