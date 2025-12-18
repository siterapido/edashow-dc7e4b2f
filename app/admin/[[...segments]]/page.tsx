import config from '@payload-config'
import { PayloadAdminBar } from '@payloadcms/ui'
import { getPayload } from 'payload'
import React from 'react'

export default async function AdminPage({
  params,
}: {
  params: { segments?: string[] }
}) {
  const { segments = [] } = await params
  const payload = await getPayload({ config })

  return <PayloadAdminBar payload={payload} segments={segments} />
}


