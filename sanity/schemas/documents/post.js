export default {
  name: 'post',
  title: 'Post',
  type: 'document',
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
      validation: (Rule) => Rule.required(),
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
      name: 'genres',
      title: 'Genres',
      type: 'array',
      of: [{type: 'string'}],
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
    },
    {
      name: 'postedAt',
      title: 'Posted At',
      type: 'date',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
    },
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: {type: 'user'},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'likes',
      title: 'Likes',
      type: 'array',
      of: [{type: 'like'}],
    },
    {
      name: 'comments',
      title: 'Comments',
      type: 'array',
      of: [{type: 'comment'}],
    },
  ],
}
