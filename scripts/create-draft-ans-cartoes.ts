import pg from 'pg'

// DATABASE_URI from .env.local.bak
const DATABASE_URI = 'postgresql://postgres.exeuuqbgyfaxgbwygfuu:Gi1hnQuYVo0zr7Eo@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'

const pool = new pg.Pool({
    connectionString: DATABASE_URI,
    ssl: { rejectUnauthorized: false }
})

// Matéria reescrita no estilo Eda - direta, opinativa, com visão de quem conhece o mercado
const postContent = `
<p>Olha só o que aconteceu: o STJ bateu o martelo em novembro e agora a ANS vai ter que colocar ordem na casa dos cartões de desconto. Isso mesmo, aquele produto que todo corretor conhece, que está em todo canto e que atende cerca de <strong>60 milhões de brasileiros</strong>. Finalmente vai ter regulação.</p>

<p>Vou te explicar por que isso é tão importante.</p>

<h2>O que são esses cartões, afinal?</h2>

<p>Diferente do plano de saúde tradicional, o cartão de desconto funciona assim: você paga uma mensalidade baixinha e, quando precisa de uma consulta ou exame, paga direto ao médico ou laboratório – só que com desconto. Sem carência, sem burocracia, sem dor de cabeça na hora de conseguir atendimento.</p>

<p>É por isso que esse produto caiu no gosto do povo, especialmente das classes C e D. Quem não consegue bancar um plano de R$ 400, R$ 500 por mês, acaba optando por pagar R$ 30 ou R$ 40 e ter acesso a uma rede de atendimento. Funciona? Na maioria das vezes, sim. Mas o problema é que <strong>não existe nenhuma regra clara</strong> sobre como isso deve funcionar.</p>

<h2>Por que a ANS ficou de fora até agora?</h2>

<p>Durante muito tempo, a Agência disse que cartão de desconto não era plano de saúde – e, portanto, não era da competência dela. O Sérgio Ricardo, especialista que acompanha o mercado há anos, lembra bem dessa história. A ANS se esquivava da responsabilidade dizendo que era outro produto.</p>

<p>Só que aí veio a realidade: 60 milhões de pessoas usando, reclamações pipocando no Procon, operadoras de plano de saúde gritando concorrência desleal... Chegou uma hora que não dava mais para ignorar.</p>

<p>O STJ entendeu que, se o produto atende milhões de brasileiros na área da saúde, <strong>alguém precisa regular e fiscalizar</strong>. E esse alguém é a ANS.</p>

<h2>O que muda na prática?</h2>

<p>O Wadih Damous, presidente da ANS, já deu as cartas em entrevista ao JOTA Info. A regulamentação vai acontecer em etapas:</p>

<ul>
<li><strong>Mapeamento do mercado:</strong> Primeiro, descobrir quem são as empresas, quantas existem, como funcionam</li>
<li><strong>Registro provisório:</strong> As empresas vão precisar se cadastrar na ANS</li>
<li><strong>Separação jurídica:</strong> Cartão de desconto é uma coisa, plano de saúde é outra – isso vai ficar claro na lei</li>
<li><strong>Proibição do uso de marcas de planos:</strong> Acabou aquela confusão de empresa de desconto usando nome parecido com operadora grande</li>
</ul>

<p>Ou seja, vai ter fiscalização de verdade. E isso, para o consumidor, é muito bom.</p>

<h2>E os planos ambulatoriais "light"?</h2>

<p>Aqui entra um debate que vai esquentar. O Ricardo lembra que, há um tempo, a ANS estava estudando a possibilidade de criar planos de saúde ambulatoriais mais enxutos – tipo um meio-termo entre o cartão de desconto e o plano tradicional.</p>

<p>A ideia era criar uma opção de baixo custo para aliviar a pressão sobre o SUS. Mas especialistas rechaçaram a proposta na época, dizendo que seria um retrocesso na cobertura assistencial. A discussão esfriou, mas pode voltar à mesa com toda essa movimentação.</p>

<h2>O que eu penso sobre isso</h2>

<p>A regulação era inevitável. Um mercado desse tamanho, atendendo tanta gente, não podia ficar no "terra de ninguém". Agora, a execução precisa ser bem feita. Não pode ser uma regulação que mate o produto – porque ele resolve um problema real de acesso à saúde – mas também não pode continuar esse faroeste onde o consumidor fica desprotegido.</p>

<p>Vamos acompanhar de perto os próximos passos da ANS. Essa história está só começando.</p>
`

async function createDraftPost() {
    const client = await pool.connect()

    try {
        console.log('🔍 Buscando categoria e colunista...')

        // Buscar categoria "Saúde Suplementar"
        const catResult = await client.query(
            "SELECT id, name FROM categories WHERE name ILIKE '%suplementar%' LIMIT 1"
        )
        const categoryId = catResult.rows[0]?.id || null
        console.log('📂 Categoria encontrada:', catResult.rows[0]?.name || 'Nenhuma')

        // Buscar colunista "Redação EDA Show"
        const colResult = await client.query(
            "SELECT id, name FROM columnists WHERE name ILIKE '%redação%' LIMIT 1"
        )
        const columnistId = colResult.rows[0]?.id || null
        console.log('✍️  Colunista encontrado:', colResult.rows[0]?.name || 'Nenhum')

        const title = 'ANS vai regular cartões de desconto: o que muda para o mercado de saúde'
        const slug = 'ans-regular-cartoes-desconto-mercado-saude'
        const excerpt = 'Decisão do STJ obriga a Agência a fiscalizar um mercado que atende 60 milhões de brasileiros. Entenda o que vem por aí e como isso afeta operadoras, corretores e consumidores.'
        const metaDescription = 'STJ determina que ANS regule cartões de desconto. Saiba como a decisão impacta o mercado de saúde suplementar e os 60 milhões de usuários desse produto.'
        const tags = JSON.stringify(['ANS', 'cartões de desconto', 'regulação', 'saúde suplementar', 'STJ'])

        console.log('📝 Inserindo rascunho no banco de dados...')

        const insertQuery = `
            INSERT INTO posts (
                title, slug, excerpt, content, category_id, columnist_id,
                status, featured_home, featured_category, tags, meta_description,
                source_url, cover_image_url, created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6,
                'draft', false, false, $7, $8,
                NULL, NULL, NOW(), NOW()
            ) RETURNING id, slug, status
        `

        const result = await client.query(insertQuery, [
            title, slug, excerpt, postContent.trim(), categoryId, columnistId, tags, metaDescription
        ])

        const post = result.rows[0]

        console.log('✅ Rascunho criado com sucesso!')
        console.log('📋 ID do post:', post.id)
        console.log('🔗 Slug:', post.slug)
        console.log('📌 Status:', post.status)
        console.log('\n💡 Acesse o CMS para revisar e publicar: /cms/posts/' + post.id)

    } catch (error: any) {
        console.error('❌ Erro ao inserir rascunho:', error.message)
        process.exit(1)
    } finally {
        client.release()
        await pool.end()
    }
}

createDraftPost()
