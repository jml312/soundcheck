import dayjs from 'dayjs'

export default {
  name: 'notification',
  title: 'Notification',
  type: 'object',
  preview: {
    select: {
      type: 'type',
      user: 'user.name',
    },
    prepare({type, user}) {
      return {
        title: `${type} by ${user}`,
      }
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
      name: 'user',
      title: 'User',
      type: 'reference',
      to: {type: 'user'},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: {type: 'post'},
      hidden: ({parent}) => !['like', 'comment', 'mention'].includes(parent?.type),
    },
    {
      name: 'commentId',
      title: 'Comment ID',
      type: 'string',
      hidden: ({parent}) => !['comment', 'mention'].includes(parent?.type),
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
