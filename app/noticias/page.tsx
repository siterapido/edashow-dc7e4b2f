import { LatestNews } from "@/components/latest-news"
import { getPosts } from "@/lib/supabase/api"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notícias | EdaShow",
  description: "Fique por dentro das principais notícias do setor de saúde",
  openGraph: {
    title: "Notícias | EdaShow",
    description: "Fique por dentro das principais notícias do setor de saúde",
    type: "website",
  },
}

export default async function NoticiasPage() {
  // Fetch all published posts
  const posts = await getPosts({
    status: 'published',
  })

  // Handle case where posts is null or undefined
  const postsData = posts || []

  return (
    <div className="min-h-screen bg-white">
      <LatestNews initialPosts={postsData} />
    </div>
  )
}
