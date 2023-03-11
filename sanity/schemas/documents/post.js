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
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: new Date().toISOString(),
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
