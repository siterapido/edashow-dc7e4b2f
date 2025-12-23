
import { RootLayout } from '@payloadcms/next/layouts'
import configPromise from '../payload.config.ts'
import { importMap } from '../app/(payload)/importMap.ts'

console.log('Checking Payload Imports...')
console.log('RootLayout type:', typeof RootLayout)
console.log('RootLayout:', RootLayout)
console.log('ImportMap type:', typeof importMap)

configPromise.then(config => {
    console.log('Config loaded:', !!config)
}).catch(err => {
    console.error('Config load error:', err)
})
