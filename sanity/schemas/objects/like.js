import dayjs from 'dayjs'

export default {
  name: 'like',
  title: 'Like',
  type: 'object',
  preview: {
    select: {
      title: 'user.name',
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
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: dayjs().toISOString(),
    },
  ],
}
