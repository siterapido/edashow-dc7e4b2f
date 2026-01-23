'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { PersonaEditor } from './persona-editor'
import { KnowledgeEditor } from './knowledge-editor'

interface AIConfigTabsProps {
  initialPersonas: any[]
  initialKnowledge: any[]
}

export function AIConfigTabs({ initialPersonas, initialKnowledge }: AIConfigTabsProps) {
  return (
    <Tabs defaultValue="personas" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
        <TabsTrigger value="personas">Personas</TabsTrigger>
        <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personas" className="mt-6">
        <PersonaEditor initialPersonas={initialPersonas} />
      </TabsContent>
      
      <TabsContent value="knowledge" className="mt-6">
        <KnowledgeEditor initialKnowledge={initialKnowledge} />
      </TabsContent>
    </Tabs>
  )
}
