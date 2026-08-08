import { CollectionConfig } from 'payload';

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Article', plural: 'Articles' },
  admin: {
    useAsTitle: 'title',
  },
  versions: { drafts: true },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      label: 'Résumé court',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: { position: 'sidebar' },

      hooks: {
        beforeChange: [
          ({ value, operation }) => {
            if (operation === 'create' && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
  ],
};