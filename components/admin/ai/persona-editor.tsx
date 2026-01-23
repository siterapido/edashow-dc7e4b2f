'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updatePersona, createPersona } from '@/lib/actions/ai-config'
import { toast } from 'sonner'
import { Plus, Save, User } from 'lucide-react'

interface PersonaEditorProps {
  initialPersonas: any[]
}

export function PersonaEditor({ initialPersonas }: PersonaEditorProps) {
  const [personas, setPersonas] = useState(initialPersonas)
  const [selectedPersona, setSelectedPersona] = useState<any>(initialPersonas[0] || null)
  const [loading, setLoading] = useState(false)

  // Novo modo de criação
  const [isCreating, setIsCreating] = useState(false)

  const handleSelect = (persona: any) => {
    setSelectedPersona(persona)
    setIsCreating(false)
  }

  const handleCreateNew = () => {
    const newPersona = {
      slug: '',
      name: 'Nova Persona',
      role: '',
      description: '',
      base_prompt: '',
      preferred_tone: 'professional'
    }
    setSelectedPersona(newPersona)
    setIsCreating(true)
  }

  const handleSave = async () => {
    if (!selectedPersona) return
    setLoading(true)

    try {
      if (isCreating) {
        await createPersona(selectedPersona)
        toast.success('Persona criada com sucesso!')
        setPersonas([...personas, { ...selectedPersona, id: 'temp-' + Date.now() }]) // Optimistic update
        setIsCreating(false)
      } else {
        await updatePersona(selectedPersona.id, selectedPersona)
        toast.success('Persona atualizada com sucesso!')
        setPersonas(personas.map(p => p.id === selectedPersona.id ? selectedPersona : p))
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro ao salvar persona.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar List */}
      <Card className="md:col-span-1 h-fit">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Personas</CardTitle>
            <Button size="sm" variant="ghost" onClick={handleCreateNew}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {personas.map(persona => (
            <Button
              key={persona.id || persona.slug}
              variant={selectedPersona?.slug === persona.slug && !isCreating ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleSelect(persona)}
            >
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              <div className="text-left overflow-hidden text-ellipsis">
                <div className="font-medium">{persona.name}</div>
                <div className="text-xs text-muted-foreground truncate">{persona.role}</div>
              </div>
            </Button>
          ))}
          
          {personas.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4">
              Nenhuma persona encontrada.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor Form */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{isCreating ? 'Nova Persona' : 'Editar Persona'}</CardTitle>
          <CardDescription>
            Configure a personalidade e o papel da IA na geração de conteúdo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedPersona ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input 
                    value={selectedPersona.name} 
                    onChange={e => setSelectedPersona({...selectedPersona, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug (ID único)</Label>
                  <Input 
                    value={selectedPersona.slug} 
                    disabled={!isCreating}
                    onChange={e => setSelectedPersona({...selectedPersona, slug: e.target.value})}
                    placeholder="ex: eda-pro"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Papel (Role)</Label>
                <Input 
                  value={selectedPersona.role} 
                  onChange={e => setSelectedPersona({...selectedPersona, role: e.target.value})}
                  placeholder="ex: Senior Software Architect"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição Curta</Label>
                <Input 
                  value={selectedPersona.description || ''} 
                  onChange={e => setSelectedPersona({...selectedPersona, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Tom Preferido</Label>
                <Select 
                  value={selectedPersona.preferred_tone || 'professional'} 
                  onValueChange={val => setSelectedPersona({...selectedPersona, preferred_tone: val})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="provocative">Provocativo</SelectItem>
                    <SelectItem value="didactic">Didático</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prompt Base (System Prompt)</Label>
                <Textarea 
                  className="min-h-[200px] font-mono text-sm"
                  value={selectedPersona.base_prompt} 
                  onChange={e => setSelectedPersona({...selectedPersona, base_prompt: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Este é o núcleo da personalidade. Defina quem a IA é e como deve se comportar.
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
              Selecione uma persona para editar ou crie uma nova.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
