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
          {title: 'Follow', value: 'follow'},
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'isMention',
      title: 'Is Mention',
      type: 'boolean',
      hidden: ({document}) => document.type !== 'comment',
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
      validation: (Rule) => Rule.required(),
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
