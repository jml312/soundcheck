import dayjs from 'dayjs'

export default {
  name: 'track',
  title: 'Track',
  type: 'object',
  preview: {
    select: {
      title: 'songName',
    },
  },
  fields: [
    {
      name: 'songName',
      title: 'Song Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'songUrl',
      title: 'Song URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'previewUrl',
      title: 'Preview URL',
      type: 'url',
    },
    {
      name: 'artists',
      title: 'Artists',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'id',
              title: 'ID',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'albumName',
      title: 'Album Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'albumUrl',
      title: 'Album URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'albumImage',
      title: 'Album Image URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'songID',
      title: 'Song ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'playedAt',
      title: 'Played At',
      type: 'datetime',
      initialValue: dayjs().toISOString(),
      hidden: ({document}) => !document?.playedAt,
    },
    {
      name: 'genres',
      title: 'Genres',
      type: 'array',
      of: [{type: 'string'}],
      hidden: ({document}) => !document?.genres,
    },
    {
      name: 'group',
      title: 'Group',
      type: 'string',
      options: {
        list: [
          {title: 'Currently Playing', value: 'Currently Playing'},
          {title: 'Recently Played', value: 'Recently Played'},
        ],
      },
    },
    {
      name: 'isLiked',
      title: 'Is Liked',
      type: 'boolean',
      initialValue: false,
    },
  ],
}
