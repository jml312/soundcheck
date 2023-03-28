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
          {title: 'Like', value: 'like'},
          {title: 'Comment', value: 'comment'},
          {title: 'Mention', value: 'mention'},
          {title: 'Follow', value: 'follow'},
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: {type: 'post'},
      hidden: ({document}) => !['like', 'comment', 'mention'].includes(document?.type),
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'reference',
      to: {type: 'comment'},
      hidden: ({document}) => !['comment', 'mention'].includes(document?.type),
    },
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: {type: 'user'},
      validation: (Rule) => Rule.required(),
    },
    {

    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: dayjs().toISOString(),
      validation: (Rule) => Rule.required(),
    },
  ],
}
