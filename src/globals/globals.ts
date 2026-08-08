import type { GlobalConfig } from 'payload'

export const Globals: GlobalConfig = {
    slug: 'global-settings',
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true
        },
        {
            name: 'address',
            type: 'text',
            required: true
        },
        {
            name: 'phone',
            type: 'text',
            required: true
        },
        {
            name: 'mail',
            type: 'email',
            required: true
        },
        {
            name: 'photo',
            type: 'upload',
            relationTo: 'media',
            required: true
        },
        {
            name: 'socials',
            type: 'array',
            required: true,
            fields: [{
                name: 'name',
                type: 'text',
                required: true,
            }, {
                name: 'icon',
                type: 'text',
                required: true,
            }, {
                name: 'link',
                type: 'text',
                required: true,
            }]
        },
    ],
}