import { fetchContributions, fetchOwnedProjects, fetchOwnedProjectsOrganisation } from '@/github';
import { CollectionConfig } from 'payload';

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Projet', plural: 'Projets' },
  admin: { useAsTitle: 'title' },
  access: {
    read: ({ req: { user } }) => {
      if (user) {
        return true
      }
      return {
        shown: {
          equals: true,
        }
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'githubId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'url',
      type: 'text',
    },
    {
      name: 'shown',
      type: 'checkbox',
      defaultValue: false
    },
    {
      name: 'stars',
      type: 'number',
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
  ],
  endpoints: [
    {
      path: '/sync',
      method: 'post',
      handler: async (req) => {
        const repos = [
          ...await fetchContributions(),
          ...await fetchOwnedProjects(),
          ...await fetchOwnedProjectsOrganisation()
        ]
        for (const { id, stars, title, url } of repos) {
          const existing = await req.payload.find({
            collection: 'projects',
            where: { githubId: { equals: id } },
            limit: 1,
          })

          if (existing.totalDocs > 0) {
            await req.payload.update({
              collection: 'projects',
              where: { githubId: { equals: id } },
              data: { stars },
            })
          }
          else {
            await req.payload.create({
              collection: 'projects',
              data: { githubId: id, title, url, stars },
            })
          }
        }
        return Response.json({ message: 'Sync réussie !' })
      },
    },
  ],
};