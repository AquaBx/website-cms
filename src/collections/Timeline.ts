import { CollectionConfig } from 'payload';

export const Timeline: CollectionConfig = {
  slug: 'timeline',
  labels: { singular: 'Événement', plural: 'Timeline' },
  admin: { useAsTitle: 'title' },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true, // ex: "AI Software Engineer (Intern)" vs FR
    },
    {
      name: 'company',
      type: 'text',
      required: true, // Niji, Inria, ESIR, ISATI, Mairie de Pacé...
    },
    {
      name: 'location',
      type: 'text', // ex: "Rennes, France"
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Expérience Pro', value: 'work' },
        { label: 'Formation', value: 'education' },
        { label: 'Associatif / Management', value: 'volunteering' },
        { label: 'Hackathon / GameJam / Challenge', value: 'competition' },
      ],
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'skills',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
  ],
};