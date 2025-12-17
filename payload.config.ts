import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'url'
import path from 'path'
import sharp from 'sharp'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Secret para criptografia JWT
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',
  
  // Configuração do banco de dados MongoDB
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/edashow',
  }),

  // Collections - tipos de conteúdo
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'editor',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Autor', value: 'author' },
          ],
        },
      ],
    },
    {
      slug: 'posts',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'status', 'publishedDate'],
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Título',
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          label: 'Slug',
          admin: {
            description: 'URL amigável para o post',
          },
        },
        {
          name: 'excerpt',
          type: 'textarea',
          label: 'Resumo',
          admin: {
            description: 'Breve descrição do post',
          },
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
          label: 'Conteúdo',
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagem Destacada',
        },
        {
          name: 'category',
          type: 'select',
          required: true,
          label: 'Categoria',
          options: [
            { label: 'Notícias', value: 'news' },
            { label: 'Análises', value: 'analysis' },
            { label: 'Entrevistas', value: 'interviews' },
            { label: 'Opinião', value: 'opinion' },
          ],
        },
        {
          name: 'tags',
          type: 'array',
          label: 'Tags',
          fields: [
            {
              name: 'tag',
              type: 'text',
            },
          ],
        },
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'columnists',
          label: 'Autor',
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          label: 'Status',
          options: [
            { label: 'Rascunho', value: 'draft' },
            { label: 'Publicado', value: 'published' },
            { label: 'Arquivado', value: 'archived' },
          ],
        },
        {
          name: 'publishedDate',
          type: 'date',
          label: 'Data de Publicação',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Destaque',
          defaultValue: false,
        },
        {
          name: 'sourceUrl',
          type: 'text',
          label: 'URL de Origem',
          admin: {
            description: 'URL original do conteúdo importado',
          },
        },
      ],
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      slug: 'columnists',
      admin: {
        useAsTitle: 'name',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nome',
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          label: 'Slug',
        },
        {
          name: 'bio',
          type: 'textarea',
          label: 'Biografia',
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Foto',
        },
        {
          name: 'role',
          type: 'text',
          label: 'Cargo/Função',
        },
        {
          name: 'social',
          type: 'group',
          label: 'Redes Sociais',
          fields: [
            {
              name: 'twitter',
              type: 'text',
              label: 'Twitter/X',
            },
            {
              name: 'linkedin',
              type: 'text',
              label: 'LinkedIn',
            },
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram',
            },
          ],
        },
      ],
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      slug: 'events',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Título',
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          label: 'Slug',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Descrição',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagem',
        },
        {
          name: 'startDate',
          type: 'date',
          required: true,
          label: 'Data de Início',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'Data de Término',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'location',
          type: 'text',
          label: 'Local',
        },
        {
          name: 'eventType',
          type: 'select',
          label: 'Tipo de Evento',
          options: [
            { label: 'Presencial', value: 'in-person' },
            { label: 'Online', value: 'online' },
            { label: 'Híbrido', value: 'hybrid' },
          ],
        },
        {
          name: 'registrationUrl',
          type: 'text',
          label: 'URL de Inscrição',
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'upcoming',
          label: 'Status',
          options: [
            { label: 'Próximo', value: 'upcoming' },
            { label: 'Em Andamento', value: 'ongoing' },
            { label: 'Finalizado', value: 'finished' },
            { label: 'Cancelado', value: 'cancelled' },
          ],
        },
        {
          name: 'organizers',
          type: 'array',
          label: 'Organizadores',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Nome',
            },
            {
              name: 'company',
              type: 'text',
              required: true,
              label: 'Empresa/Organização',
            },
            {
              name: 'email',
              type: 'email',
              label: 'Email',
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              label: 'Foto',
            },
            {
              name: 'role',
              type: 'text',
              label: 'Cargo',
            },
          ],
        },
        {
          name: 'sponsors',
          type: 'array',
          label: 'Empresas Patrocinadoras',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Nome da Empresa',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
            },
            {
              name: 'website',
              type: 'text',
              label: 'Website',
            },
            {
              name: 'sponsorshipType',
              type: 'select',
              label: 'Tipo de Patrocínio',
              options: [
                { label: 'Ouro', value: 'gold' },
                { label: 'Prata', value: 'silver' },
                { label: 'Bronze', value: 'bronze' },
              ],
            },
          ],
        },
        {
          name: 'speakers',
          type: 'array',
          label: 'Palestrantes',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Nome',
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              label: 'Foto',
            },
            {
              name: 'company',
              type: 'text',
              required: true,
              label: 'Empresa',
            },
            {
              name: 'role',
              type: 'text',
              required: true,
              label: 'Cargo',
            },
            {
              name: 'bio',
              type: 'textarea',
              label: 'Biografia',
            },
            {
              name: 'talkTitle',
              type: 'text',
              label: 'Tema da Palestra',
            },
          ],
        },
      ],
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      slug: 'media',
      upload: {
        staticDir: 'public/uploads',
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 300,
            position: 'centre',
          },
          {
            name: 'card',
            width: 768,
            height: 1024,
            position: 'centre',
          },
          {
            name: 'tablet',
            width: 1024,
            height: undefined,
            position: 'centre',
          },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*'],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          label: 'Texto Alternativo',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Legenda',
        },
      ],
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],

  // Globals - dados singleton (únicos)
  globals: [
    {
      slug: 'site-settings',
      fields: [
        {
          name: 'siteName',
          type: 'text',
          required: true,
          label: 'Nome do Site',
        },
        {
          name: 'siteDescription',
          type: 'textarea',
          label: 'Descrição do Site',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo',
        },
        {
          name: 'favicon',
          type: 'upload',
          relationTo: 'media',
          label: 'Favicon',
        },
        {
          name: 'socialMedia',
          type: 'group',
          label: 'Redes Sociais',
          fields: [
            {
              name: 'facebook',
              type: 'text',
              label: 'Facebook',
            },
            {
              name: 'twitter',
              type: 'text',
              label: 'Twitter/X',
            },
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram',
            },
            {
              name: 'linkedin',
              type: 'text',
              label: 'LinkedIn',
            },
          ],
        },
      ],
      access: {
        read: () => true,
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      slug: 'header',
      fields: [
        {
          name: 'navigation',
          type: 'array',
          label: 'Navegação',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Texto',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'URL',
            },
          ],
        },
      ],
      access: {
        read: () => true,
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      slug: 'footer',
      fields: [
        {
          name: 'copyright',
          type: 'text',
          label: 'Copyright',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Texto',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'URL',
            },
          ],
        },
      ],
      access: {
        read: () => true,
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],

  // Configuração do painel admin
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: 'users',
    meta: {
      titleSuffix: '- EdaShow CMS',
      favicon: '/icon-dark-32x32.png',
      ogImage: '/placeholder.jpg',
    },
  },

  // Editor de texto rico
  editor: lexicalEditor({}),

  // TypeScript
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Sharp para processamento de imagens
  sharp,
})
