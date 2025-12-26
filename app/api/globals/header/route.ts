import { NextResponse } from 'next/server'

export async function GET() {
    // Por enquanto, retorna a navegação padrão
    // No futuro, isso pode vir de uma tabela 'header_settings' ou similar no Supabase
    return NextResponse.json({
        navigation: [
            { label: "Sobre Nós", url: "/sobre" },
            { label: "Patrocinadores", url: "/patrocinadores" },
            {
                label: "Conteúdo",
                url: "#",
                hasDropdown: true,
                dropdownItems: [
                    { label: "Notícias", url: "/noticias", description: "Últimas notícias do setor" },
                    { label: "Análises", url: "/analises", description: "Análises profundas e estudos" },
                    { label: "Entrevistas", url: "/entrevistas", description: "Conversas exclusivas" },
                    { label: "Opinião", url: "/opiniao", description: "Artigos e editoriais" },
                    { label: "Colunas", url: "/colunas", description: "Colunistas especializados" },
                ]
            },
            { label: "Eventos", url: "/events" },
        ]
    })
}
