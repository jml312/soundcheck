export const postsQuery = `
  {
    'userPost': *[_type == "post" 
                  && dateTime(createdAt) > dateTime($startDate) 
                  && dateTime(createdAt) < dateTime($endDate)
                  && user._ref == $name][0] {
                    ...,
                    ...*[_type == "user" && name == ^.user._ref][0] {
                      'username': name,
                      'userImage': image,
                      'joined': createdAt,
                      'numFollowers': count(followers),
                      'numFollowing': count(following)
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
                  } | order(createdAt desc),
    'hasPostedToday': defined(*[_type == "post"
                      && user._ref == $name 
                      && dateTime(createdAt) > dateTime($todayStart) 
                      && dateTime(createdAt) < dateTime($todayEnd)][0])     
  }
`;

export const recentlyPlayedQuery = `
  *[_type == "user" && name == $name][0].recentlyPlayed | order(dateTime(playedAt) desc)
`;

export const hasPostedYesterdayQuery = `
{
  "hasPostedYesterday": defined(*[_type == "post" 
                                    && user._ref == $name
                                    && dateTime(createdAt) > dateTime($yesterdayStart) 
                                    && dateTime(createdAt) < dateTime($yesterdayEnd)][0])
  }.hasPostedYesterday
`;

export const discoverQuery = `
  *[_type == "post" && user._ref == $name] {
    'artists': artists[].id,
    genres,
    songID,
  }
`;
