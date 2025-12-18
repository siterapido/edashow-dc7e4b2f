import config from '@payload-config'
import '@payloadcms/next/css'
import {
  ADMIN_DELETE,
  ADMIN_GET,
  ADMIN_PATCH,
  ADMIN_POST,
  ADMIN_PUT,
} from '@payloadcms/next/routes'

export const GET = ADMIN_GET(config)
export const POST = ADMIN_POST(config)
export const DELETE = ADMIN_DELETE(config)
export const PATCH = ADMIN_PATCH(config)
export const PUT = ADMIN_PUT(config)


