import { getPostBySlug, getPosts, getImageUrl } from '@/lib/payload/api'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PostPageProps {
  params: {
    slug: string
  }
}

// Gerar páginas estáticas para posts existentes
export async function generateStaticParams() {
  const posts = await getPosts({ limit: 100, status: 'published' })
  
  return posts.map((post: any) => ({
    slug: post.slug,
  }))
}

// Metadados da página
export async function generateMetadata({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)
  
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
      images: post.featuredImage ? [getImageUrl(post.featuredImage)] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }
  
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

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          {/* Categoria */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {post.category === 'news' && 'Notícias'}
              {post.category === 'analysis' && 'Análises'}
              {post.category === 'interviews' && 'Entrevistas'}
              {post.category === 'opinion' && 'Opinião'}
            </span>
            {post.featured && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                ⭐ Destaque
              </span>
            )}
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Resumo */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta informações */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.publishedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedDate}>
                  {format(new Date(post.publishedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </time>
              </div>
            )}
          </div>

          {/* Autor */}
          {post.author && (
            <div className="flex items-center gap-3 mt-6 p-4 bg-muted rounded-lg">
              <Avatar className="h-12 w-12">
                {post.author.photo && (
                  <AvatarImage 
                    src={getImageUrl(post.author.photo, 'thumbnail')} 
                    alt={post.author.name} 
                  />
                )}
                <AvatarFallback>
                  {post.author.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Por {post.author.name}</p>
                {post.author.role && (
                  <p className="text-sm text-muted-foreground">{post.author.role}</p>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Imagem Destacada */}
        {post.featuredImage && (
          <div className="relative w-full h-[400px] md:h-[500px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={getImageUrl(post.featuredImage)}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
            {post.featuredImage.caption && (
              <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm p-3">
                {post.featuredImage.caption}
              </p>
            )}
          </div>
        )}

        {/* Conteúdo */}
        <div className="prose prose-lg max-w-none mb-8">
          {/* Aqui você pode renderizar o conteúdo rico do Lexical */}
          {/* Por enquanto, vamos mostrar uma mensagem */}
          <div className="bg-muted p-6 rounded-lg">
            <p className="text-muted-foreground">
              O conteúdo completo do post será renderizado aqui. 
              Para renderizar o conteúdo rico do Lexical, você precisará 
              instalar e configurar o componente de renderização apropriado.
            </p>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4" />
              <h3 className="font-semibold">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: any, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tag.tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Informações do Autor (expandido) */}
        {post.author && post.author.bio && (
          <div className="border-t pt-8 mt-8">
            <h3 className="text-xl font-bold mb-4">Sobre o Autor</h3>
            <div className="flex gap-4">
              <Avatar className="h-20 w-20 flex-shrink-0">
                {post.author.photo && (
                  <AvatarImage 
                    src={getImageUrl(post.author.photo, 'thumbnail')} 
                    alt={post.author.name} 
                  />
                )}
                <AvatarFallback className="text-2xl">
                  {post.author.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-bold text-lg">{post.author.name}</p>
                {post.author.role && (
                  <p className="text-sm text-muted-foreground mb-2">{post.author.role}</p>
                )}
                <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                {post.author.social && (
                  <div className="flex gap-3 mt-3">
                    {post.author.social.twitter && (
                      <a 
                        href={post.author.social.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Twitter
                      </a>
                    )}
                    {post.author.social.linkedin && (
                      <a 
                        href={post.author.social.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        LinkedIn
                      </a>
                    )}
                    {post.author.social.instagram && (
                      <a 
                        href={post.author.social.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Instagram
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  )
}

