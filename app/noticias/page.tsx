import { getPosts, getImageUrl } from '@/lib/payload/api'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default async function NoticiasPage() {
  const posts = await getPosts({ 
    limit: 50, 
    status: 'published',
    revalidate: 60 
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Notícias</h1>
          <p className="text-xl text-muted-foreground">
            Fique por dentro de tudo que acontece no setor de saúde
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhuma notícia publicada ainda.
            </p>
            <p className="text-sm text-muted-foreground">
              Acesse <Link href="/admin" className="text-primary hover:underline">/admin</Link> para criar sua primeira notícia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <Link href={`/posts/${post.slug}`} key={post.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  {post.featuredImage ? (
                    <div className="relative h-48 w-full">
                      <Image
                        src={getImageUrl(post.featuredImage, 'card')}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-400">Notícia</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {post.category === 'news' && 'Notícias'}
                        {post.category === 'analysis' && 'Análises'}
                        {post.category === 'interviews' && 'Entrevistas'}
                        {post.category === 'opinion' && 'Opinião'}
                      </span>
                      {post.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                          ⭐ Destaque
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {post.publishedDate && (
                        <time dateTime={post.publishedDate}>
                          {format(new Date(post.publishedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </time>
                      )}
                      {post.author && (
                        <span>Por {post.author.name}</span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
