import { getPostForPreview } from '@/lib/actions/cms-posts'
import { getSponsors } from '@/lib/supabase/api'
import { notFound } from 'next/navigation'
import { DraftPreviewPage } from '@/components/cms/DraftPreviewPage'

export const dynamic = 'force-dynamic'

interface PreviewPageProps {
    params: Promise<{ id: string }>
}

export default async function PreviewPage({ params }: PreviewPageProps) {
    const { id } = await params
    const post = await getPostForPreview(id)

    if (!post) {
        notFound()
    }

    const sponsors = await getSponsors({ active: true })

    return <DraftPreviewPage post={post} sponsors={sponsors} />
}
