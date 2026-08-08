import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'

import { Users } from './src/collections/Users'
import { Posts } from './src/collections/Posts'
import { Tags } from './src/collections/Tags'
import { Timeline } from './src/collections/Timeline'
import { Projects } from './src/collections/Projects'
import { Media } from './src/collections/Media'
import { Globals } from '@/globals/globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  globals: [Globals],
  collections: [Users, Media, Posts, Tags, Timeline, Projects],
  editor: lexicalEditor(),
  secret: process.env.WEBSITE_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    fallback: true
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
