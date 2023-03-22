import dayjs from 'dayjs'

export default {
  name: 'notification',
  title: 'Notification',
  type: 'object',
  preview: {
    select: {
      title: 'type',
    },
  },
  fields: [
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Follow', value: 'follow'},
          {title: 'Like', value: 'like'},
          {title: 'Comment', value: 'comment'},
        ],
      },
    },
    {
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: {type: 'post'},
    },
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
