export const postStreakQuery = `
  *[_type == "user" && name == $name][0] {
    postStreak,
    "hasPostedYesterday": defined(*[_type == "post" 
                                    && references(^._id) 
                                    && dateTime(createdAt) > dateTime($yesterdayStart) 
                                    && dateTime(createdAt) < dateTime($todayStart)][0])
  }
`;

export const postsQuery = `
  {
    'userPost': *[_type == "post" 
                  && dateTime(createdAt) > dateTime($startDate) 
                  && dateTime(createdAt) < dateTime($endDate)
                  && user._ref == $name][0] {
                    ...,
                    ...*[_type == "user" && name == ^.user._ref][0] {
                      'username': name,
                      'userImage': image
                    },
                    createdAt,
                    'likes': likes[] {
                      ...*[_type == "user" && _id == ^.user._ref][0] {
                        'username': name,
                        'userImage': image
                      },
                      createdAt
                    } | order(dateTime(createdAt) desc),
                    'comments': comments[] {
                      text,
                      ...*[_type == "user" && _id == ^.user._ref][0] {
                        'username': name,
                        'userImage': image
                      },
                      createdAt,
                    } | order(dateTime(createdAt) desc),
                  },
    'feedPosts': *[_type == "post" 
                  && dateTime(createdAt) > dateTime($startDate) 
                  && dateTime(createdAt) < dateTime($endDate)
                  && user._ref != $name] {
                    ...,
                    ...*[_type == "user" && name == ^.user._ref][0] {
                      'username': name,
                      'userImage': image,
                      'joined': createdAt,
                      'numFollowers': count(followers),
                      'numFollowing': count(following)
                    },
                    'isLiked': user._ref in *[_type == "user" && $name == name].likes[].user._ref,
                    'isFollowing': user._ref in *[_type == "user" && $name == name].following[]._ref,         
                    'likes': likes[] {
                      ...*[_type == "user" && _id == ^.user._ref][0] {
                        'username': name,
                        'userImage': image
                      },
                      createdAt
                    } | order(dateTime(createdAt) desc),
                    'comments': comments[] {
                      text,
                      ...*[_type == "user" && _id == ^.user._ref][0] {
                        'username': name,
                        'userImage': image
                      },
                      createdAt,
                    } | order(dateTime(createdAt) desc)
                  } | order(createdAt desc)       
  }
`;
