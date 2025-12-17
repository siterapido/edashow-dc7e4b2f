import { getEvents, getImageUrl } from '@/lib/payload/api'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, MapPin, Clock, ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Força renderização dinâmica para evitar erros de serialização durante build
export const dynamic = 'force-dynamic'
export const dynamicParams = true

interface EventPageProps{
  params: {
    slug: string
  }
}

// Buscar evento por slug
async function getEventBySlug(slug: string) {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  
  try {
    const response = await fetch(
      `${API_URL}/api/events?where[slug][equals]=${slug}&limit=1`,
      { next: { revalidate: 60 } }
    )
    
    if (!response.ok) return null
    
    const data = await response.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching event:', error)
    return null
  }
}

// Gerar páginas estáticas para eventos existentes
export async function generateStaticParams() {
  const events = await getEvents({ limit: 100, status: 'upcoming' })
  
  return events.map((event: any) => ({
    slug: event.slug,
  }))
}

// Metadados da página
export async function generateMetadata({ params }: EventPageProps) {
  const event = await getEventBySlug(params.slug)
  
  if (!event) {
    return {
      title: 'Evento não encontrado',
    }
  }
  
  return {
    title: `${event.title} | EdaShow`,
    description: typeof event.description === 'string' 
      ? event.description 
      : 'Confira os detalhes do evento',
    openGraph: {
      title: event.title,
      description: typeof event.description === 'string' ? event.description : '',
      images: event.image ? [getImageUrl(event.image)] : [],
    },
  }
}

export default async function EventPage({ params }: EventPageProps) {
  // #region agent log
  const logData = async (location: string, message: string, data: any) => {
    try {
      await fetch('http://127.0.0.1:7243/ingest/b23be4e3-a03c-4cb5-9aae-575cd428f4b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location,message,data,timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})});
    } catch {}
  };
  await logData('app/events/[slug]/page.tsx:69', 'EventPage started', {slug:params.slug});
  // #endregion
  const event = await getEventBySlug(params.slug)
  // #region agent log
  await logData('app/events/[slug]/page.tsx:75', 'Event fetched by slug', {slug:params.slug,eventFound:!!event,eventId:event?.id,eventTitle:event?.title});
  // #endregion
  
  if (!event) {
    // #region agent log
    await logData('app/events/[slug]/page.tsx:80', 'Event not found, calling notFound()', {slug:params.slug});
    // #endregion
    notFound()
  }
  
  const startDate = new Date(event.startDate)
  const endDate = event.endDate ? new Date(event.endDate) : null
  
  // Status badge
  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: { label: 'Próximo', color: 'bg-blue-100 text-blue-800' },
      ongoing: { label: 'Em Andamento', color: 'bg-green-100 text-green-800' },
      finished: { label: 'Finalizado', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
    }
    return badges[status as keyof typeof badges] || badges.upcoming
  }
  
  const statusBadge = getStatusBadge(event.status)
  
  // Tipo de evento
  const getEventType = (type: string) => {
    const types = {
      'in-person': 'Presencial',
      'online': 'Online',
      'hybrid': 'Híbrido',
    }
    return types[type as keyof typeof types] || type
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
          {/* Status e Tipo */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
              {statusBadge.label}
            </span>
            {event.eventType && (
              <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                {getEventType(event.eventType)}
              </span>
            )}
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {event.title}
          </h1>

          {/* Informações principais */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Data */}
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Data e Hora</p>
                <p className="text-sm text-muted-foreground">
                  {format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(startDate, "HH:mm", { locale: ptBR })}
                  {endDate && ` - ${format(endDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`}
                </p>
              </div>
            </div>

            {/* Local */}
            {event.location && (
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <MapPin className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Local</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Botão de Inscrição */}
          {event.registrationUrl && event.status === 'upcoming' && (
            <a 
              href={event.registrationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button size="lg" className="gap-2">
                Inscrever-se no Evento
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}
        </header>

        {/* Imagem do Evento */}
        {event.image && (
          <div className="relative w-full h-[400px] md:h-[500px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={getImageUrl(event.image)}
              alt={event.image.alt || event.title}
              fill
              className="object-cover"
              priority
            />
            {event.image.caption && (
              <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm p-3">
                {event.image.caption}
              </p>
            )}
          </div>
        )}

        {/* Descrição */}
        {event.description && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Sobre o Evento</h2>
            <div className="prose prose-lg max-w-none">
              {typeof event.description === 'string' ? (
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              ) : (
                <div className="bg-muted p-6 rounded-lg">
                  <p className="text-muted-foreground">
                    A descrição completa do evento será renderizada aqui.
                    Para renderizar o conteúdo rico do Lexical, você precisará 
                    instalar e configurar o componente de renderização apropriado.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informações Adicionais */}
        <div className="border-t pt-8 mt-8">
          <h3 className="text-xl font-bold mb-4">Informações Importantes</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Duração</p>
                <p className="text-muted-foreground">
                  {endDate 
                    ? `De ${format(startDate, 'dd/MM/yyyy')} até ${format(endDate, 'dd/MM/yyyy')}`
                    : format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  }
                </p>
              </div>
            </div>
            
            {event.eventType && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Formato</p>
                  <p className="text-muted-foreground">{getEventType(event.eventType)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Final */}
        {event.registrationUrl && event.status === 'upcoming' && (
          <div className="border-t pt-8 mt-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Não perca esta oportunidade!</h3>
            <p className="text-muted-foreground mb-6">
              Garanta sua vaga e participe deste evento incrível.
            </p>
            <a 
              href={event.registrationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" className="gap-2">
                Inscrever-se Agora
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        )}
      </article>
    </div>
  )
}

