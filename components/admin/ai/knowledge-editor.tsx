'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { updateKnowledgeBlock } from '@/lib/actions/ai-config'
import { toast } from 'sonner'
import { Save, BookOpen, Tag } from 'lucide-react'

interface KnowledgeEditorProps {
  initialKnowledge: any[]
}

export function KnowledgeEditor({ initialKnowledge }: KnowledgeEditorProps) {
  const [blocks, setBlocks] = useState(initialKnowledge)
  const [selectedBlock, setSelectedBlock] = useState<any>(initialKnowledge[0] || null)
  const [loading, setLoading] = useState(false)

  const handleSelect = (block: any) => {
    setSelectedBlock(block)
  }

  const handleSave = async () => {
    if (!selectedBlock) return
    setLoading(true)

    try {
      await updateKnowledgeBlock(selectedBlock.id, selectedBlock.content)
      toast.success('Bloco de conhecimento atualizado!')
      setBlocks(blocks.map(b => b.id === selectedBlock.id ? selectedBlock : b))
    } catch (error) {
      console.error(error)
      toast.error('Erro ao salvar bloco.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar List */}
      <Card className="md:col-span-1 h-fit">
        <CardHeader>
          <CardTitle className="text-lg">Base de Conhecimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {blocks.map(block => (
            <Button
              key={block.id || block.slug}
              variant={selectedBlock?.slug === block.slug ? "secondary" : "ghost"}
              className="w-full justify-start h-auto py-3"
              onClick={() => handleSelect(block)}
            >
              <BookOpen className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
              <div className="text-left overflow-hidden">
                <div className="font-medium">{block.name}</div>
                <div className="flex gap-1 flex-wrap mt-1">
                  {block.tags?.map((tag: string) => (
                    <span key={tag} className="text-[10px] bg-muted px-1 rounded text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Button>
          ))}
          
          {blocks.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4">
              Nenhum bloco encontrado.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor Form */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{selectedBlock ? selectedBlock.name : 'Editor de Conhecimento'}</CardTitle>
          <CardDescription>
            {selectedBlock ? `Editando bloco: ${selectedBlock.slug}` : 'Selecione um bloco para editar.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedBlock ? (
            <>
              <div className="flex gap-2 mb-2">
                {selectedBlock.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Conteúdo (Markdown)</Label>
                <Textarea 
                  className="min-h-[400px] font-mono text-sm leading-relaxed"
                  value={selectedBlock.content} 
                  onChange={e => setSelectedBlock({...selectedBlock, content: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Este conteúdo será injetado no contexto da IA quando as flags relevantes forem ativadas.
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Selecione um bloco de conhecimento para editar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
