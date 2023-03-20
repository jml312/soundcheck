import dayjs from 'dayjs'

export default {
  name: 'comment',
  title: 'Comment',
  type: 'object',
  preview: {
    select: {
      title: 'text',
    },
  },
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: {type: 'user'},
    },
    {
      name: 'text',
      title: 'Text',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: dayjs().toISOString(),
    },
  ],
}
