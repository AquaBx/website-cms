import { CollectionConfig } from 'payload';

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Projet', plural: 'Projets' },
  admin: { useAsTitle: 'title' },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized:true,
    },
    {
      name: 'id',
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
      name: 'content',
      type: 'richText',
      localized: true,
    },
  ],
};