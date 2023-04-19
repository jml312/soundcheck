export const postsQuery = `
  {
    'userPost': *[_type == "post" 
                  && dateTime(createdAt) > dateTime($todayStart) 
                  && dateTime(createdAt) < dateTime($todayEnd)
                  && user._ref == $userId][0] {
                    ...,
                    ...*[_type == "user" && _id == ^.user._ref][0] {
                      'userId': _id,
                      'username': name,
                      'userImage': image,
                      'joined': createdAt,
                    },
                    createdAt,
                    'comments': comments[] {
                      text,
                      ...*[_type == "user" && _id == ^.user._ref][0] {
                        'userId': _id,
                        'username': name,
                        'userImage': image
                      },
                      createdAt,
                    } | order(dateTime(createdAt) asc),
                  },
    'feedPosts': *[_type == "post" 
                  && dateTime(createdAt) > dateTime($todayStart) 
                  && dateTime(createdAt) < dateTime($todayEnd) 
                  && user._ref != $userId] {
                    ...,
                    ...*[_type == "user" && _id == ^.user._ref][0] {
                      'userId': _id,
                      'username': name,
                      'userImage': image,
                      'joined': createdAt,
                      'numFollowers': count(followers),
                      'numFollowing': count(following),
                      'isFollowing': $userId in followers[]._ref,
                    },
                    'isLiked': $userId in likes[].user._ref, 
                    'comments': comments[] {
                      text,
                      ...*[_type == "user" && _id == ^.user._ref][0] {
                        'userId': _id,
                        'username': name,
                        'userImage': image,
                      },
                      createdAt,
                    } | order(createdAt asc)
                  } | order(createdAt desc)
  }
`;

export const allUsersQuery = `
  *[_type == "user"] {
    'userId': _id,
    'username': name,
    'userImage': image,
  } | order(username asc)
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
  *[_type == "user" && _id == $userId][0] {
    'notifications': notifications[] {
      ...,
      ...*[_type == "user" && _id == ^.user._ref][0] {
        'userId': _id,
        'username': name,
        'userImage': image,
      },
    }
  }.notifications | order(dateTime(createdAt) desc)
`;

export const profileQuery = `
  *[_type == "user" && _id == $userId][0] {
    _id,
    name,
    image,
    createdAt,
    postStreak,
    playlistID,
    'posts': *[_type == "post" && user._ref == $userId] {
      ...,
      ...*[_type == "user" && _id == ^.user._ref][0] {
        'userId': _id,
        'username': name,
        'userImage': image,
        'joined': createdAt,
        'numFollowers': count(followers),
        'numFollowing': count(following),        
      },
      'comments': comments[] {
        text,
        ...*[_type == "user" && _id == ^.user._ref][0] {
          'userId': _id,
          'username': name,
          'userImage': image,
        },
        createdAt,
      } | order(dateTime(createdAt) asc),
    } | order(dateTime(createdAt) desc),
    'likes': *[_type == "post" && $userId in likes[].user._ref] {
      ...,
      ...*[_type == "user" && _id == ^.user._ref][0] {
        'userId': _id,
        'username': name,
        'userImage': image,
        'joined': createdAt,
        'numFollowers': count(followers),
        'numFollowing': count(following),
        'isFollowing': $userId in followers[]._ref,        
      },      
    } | order(dateTime(createdAt) desc),
    'followers': followers[] {
      ...*[_type == "user" && _id == ^._ref][0] {
        'userId': _id,
        'username': name,
        'userImage': image,
      },
    },
    'following': following[] {
      ...*[_type == "user" && _id == ^._ref][0] {
        'userId': _id,
        'username': name,
        'userImage': image,
      },
    },
    'stats': *[_type == "post" && user._ref == $userId] {
      'artists': artists[].name,
      'album': albumName,
      genres,
    },
    notifications, 
  }
`;

export const userQuery = `
  *[_type == "user"] {
    _id, 
    email, 
    notifications
  }
`;

export const searchQuery = `  
  *[_type == "user" && _id != $userId] {
    'userId': _id,
    'username': name,
    'userImage': image
  } | order(username asc)
`;
