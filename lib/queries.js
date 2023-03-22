export const postsQuery = `
  {
    'userPost': *[_type == "post" 
                  && dateTime(createdAt) > dateTime($startDate) 
                  && dateTime(createdAt) < dateTime($endDate)
                  && user._ref == $userId][0] {
                    ...,
                    ...*[_type == "user" && _id == ^.user._ref][0] {
                      'userId': _id,
                      'username': name,
                      'userImage': image,
                      'joined': createdAt,
                      'numFollowers': count(followers),
                      'numFollowing': count(following)
                    },
                    createdAt,
                    'likes': likes[] {
                      ...*[_type == "user" && _id == ^.user._ref][0] {
                        'userId': _id,
                        'username': name,
                        'userImage': image
                      },
                      createdAt
                    } | order(dateTime(createdAt) desc),
                    'comments': comments[] {
                      text,
                      ...*[_type == "user" && _id == ^.user._ref][0] {
                        'userId': _id,
                        'username': name,
                        'userImage': image
                      },
                      createdAt,
                    } | order(dateTime(createdAt) desc),
                  },
    'feedPosts': *[_type == "post" 
                  && dateTime(createdAt) > dateTime($startDate) 
                  && dateTime(createdAt) < dateTime($endDate)
                  && user._ref != $userId] {
                    ...,
                    ...*[_type == "user" && _id == ^.user._ref][0] {
                      'userId': _id,
                      'username': name,
                      'userImage': image,
                      'joined': createdAt,
                      'numFollowers': count(followers),
                      'numFollowing': count(following)
                    },
                    'isLiked': user._ref in *[_type == "user" && $userId == _id].likes[].user._ref,
                    'isFollowing': user._ref in *[_type == "user" && _id == $userId].following[]._ref,         
                    'likes': likes[] {
                      ...*[_type == "user" && _id == ^.user._ref][0] {
                        'userId': _id,
                        'username': name,
                        'userImage': image
                      },
                      createdAt
                    } | order(dateTime(createdAt) desc),
                    'comments': comments[] {
                      text,
                      ...*[_type == "user" && _id == ^.user._ref][0] {
                        'userId': _id,
                        'username': name,
                        'userImage': image
                      },
                      createdAt,
                    } | order(dateTime(createdAt) desc)
                  } | order(createdAt desc),
    'hasPostedToday': defined(*[_type == "post"
                      && user._ref == $userId
                      && dateTime(createdAt) > dateTime($todayStart) 
                      && dateTime(createdAt) < dateTime($todayEnd)][0])     
  }
`;

export const recentlyPlayedQuery = `
  *[_type == "user" && _id == $userId][0].recentlyPlayed | order(dateTime(playedAt) desc)
`;

export const hasPostedYesterdayQuery = `
{
  "hasPostedYesterday": defined(*[_type == "post" 
                                    && user._ref == $userId
                                    && dateTime(createdAt) > dateTime($yesterdayStart) 
                                    && dateTime(createdAt) < dateTime($yesterdayEnd)][0])
  }.hasPostedYesterday
`;

export const hasPostedTodayQuery = `
  {
    "hasPostedToday": defined(*[_type == "post" 
                                      && user._ref == $userId
                                      && dateTime(createdAt) > dateTime($todayStart) 
                                      && dateTime(createdAt) < dateTime($todayEnd)][0])
    }.hasPostedToday
`;

export const discoverQuery = `
  *[_type == "post" 
    && (user._ref == $userId || $userId in likes[].user._ref)] {
    'artists': artists[].id,
    genres,
    songID,
  }
`;

export const userDiscoverQuery = `
  *[_type == "user" && _id == $userId][0].discoverSongs
`;

export const notificationsQuery = `
  *[_type == "user" && _id == $userId][0].notifications | order(dateTime(createdAt) desc)
`;

export const profileQuery = `
  *[_type == "user" && _id == $userId][0] {
    ...,
    'stats': *[_type == "post" && user._ref == $userId] {
      genres,
      'artists': artists[].name,
    } 
  }
`;
