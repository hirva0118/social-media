declare interface UserData {
  [x: string]: number;
  _id: number;
  account: {
    _id: string;
    avatar: {
      _id: number;
      localPath: string | null;
      url: string | null;
    };
    email: string;
    isEmailVerified: boolean;
    username: string | null;
  };
  bio: string | null;
  coverImage: {
    _id: number;
    localPath: string | null;
    url: string | null;
  };
  firstName: string | null;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  lastName: string | null;
  owner: number;
  phoneNumber: number;
}

declare interface Post {
  createdAt: string | number | Date;
  _id: string;
  author: {
    _id: string | null;
    account: {
      _id: string | null;
      avatar: {
        _id: string | null;
        localPath: string | null;
        url: string | null;
      };
      email: string | null;
      username: string | null;
    };
    bio: string | null;
    coverImage: {
      _id: string | null;
      localPath: string | null;
      url: string | null;
    };
    firstName: string | null;
    lastName: string | null;
    phoneNumber: number;
  };
  comments: number;
  content: string | null;
  images: {
    _id: string | null;
    localPath: string | null;
    url: string | null;
  }[];
  isBookmarked: boolean;
  isLiked: boolean;
  likes: number;
}

declare interface PostData {
  posts: Post[];
  serialNumberStartFrom: number;
  totalPages: number;
  totalPosts: number;
  page: number;
  nextPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

declare interface CommentData {
  comments: {
    _id: string;
    author: {
      _id: string;
      coverImage: {
        _id: string | null;
        localPath: string | null;
        url: string | null;
      };
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      owner: string;
    };
    page: number;
    nextPage: number;
    createdAt: string;
    content: string;
    isLiked: boolean;
    likes: number;
    postId: string;
  }[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

declare interface BookmarkData {
  bookmarkedPosts: {
    _id: string;
    images: {
      _id: string | null;
      localPath: string | null;
      url: string | null;
    }[];
    isBookmarked: boolean;
  }[];
}

declare interface SearchData {
  coverImage: {
    _id: number;
    localPath: string | null;
    url: string | null;
  };
  firstName: string;
  lastName: string;
  account: {
    avatar: {
      _id: number;
      localPath: string | null;
      url: string | null;
    };
    username: string;
    _id:string;
  }[];

  username: string;
  _id: string;
}

declare interface OthersProfile {
  _id: string;
  account: {
    _id: string;
    avatar: {
      _id: number;
      localPath: string | null;
      url: string | null;
    };
    email: string;
    username: string;
  };
  bio: string;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  coverImage: {
    _id: number;
    localPath: string | null;
    url: string | null;
  };
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}
declare interface Following {
  following: boolean;
}

declare interface FollowersList {
  followers: {
    _id: string;
    avatar: {
      _id: number;
      localPath: string | null;
      url: string | null;
    };
    email: string;
    isFollowing: boolean;
    profile: {
      _id: string;
      bio: string;
      coverImage: {
        _id: number;
        localPath: string | null;
        url: string | null;
      };
      firstName: string;
      lastName: string;
    };

    username: string;
  }[];
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  prevPage: number;
  nextPage: number;
}
declare interface FollowingList {
  following: {
    _id: string;
    avatar: {
      _id: number;
      localPath: string | null;
      url: string | null;
    };
    email: string;
    isFollowing: boolean;
    profile: {
      _id: string;
      bio: string;
      coverImage: {
        _id: number;
        localPath: string | null;
        url: string | null;
      };
      firstName: string;
      lastName: string;
    };
    username: string;
  }[];
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  prevPage: number;
  nextPage: number;
}
