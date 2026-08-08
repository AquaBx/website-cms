import { CollectionConfig } from "payload";

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'icon', type: 'text', label: 'Nom de l’icône (Lucide / SimpleIcons)' },
  ],
};
