import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        links: [
            { label: "Sobre o EDA Show", url: "/sobre" },
            { label: "Patrocinadores", url: "/patrocinadores" },
            { label: "Anuncie Conosco", url: "/anuncie" },
            { label: "Media Kit", url: "/media-kit" },
            { label: "Política de Privacidade", url: "/privacidade" },
            { label: "Termos de Uso", url: "/termos" },
        ],
        copyright: "© {{year}} EDA Show. Todos os direitos reservados.",
        contact: {
            email: "adm.edashow@gmail.com",
            address: "Atuação Nacional - Brasil",
        }
    })
}
