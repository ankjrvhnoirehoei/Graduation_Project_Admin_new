export interface DateRange {
  label: string;
  start: Date;
  end: Date;
}

export interface Filters {
  platform: string;
  category: string;
  uploader: string;
}

export interface Reporter {
  _id: string;
  username: string;
  handleName: string;
  profilePic: string;
}

export interface ContentTarget {
  _id: string;
  userID: string;
  type: string;
  caption: string;
  isFlagged: boolean;
  nsfw: boolean;
  isEnable: boolean;
  location: string;
  viewCount: number;
  share: number;
  createdAt: string;
  updatedAt: string;
  isFollow: boolean;
  media: Array<{
    _id: string;
    postID: string;
    videoUrl?: string;
    imageUrl?: string;
    tags: string[];
  }>;
  user: {
    _id: string;
    handleName: string;
    profilePic: string;
  };
  likeCount: number;
  commentCount: number;
  isLike: boolean;
  isBookmarked: boolean;
}

export interface UserTarget {
  _id: string;
  username: string;
  handleName: string;
  profilePic: string;
}

export interface Report {
  _id: string;
  reporterId: string;
  targetId: string;
  reason: string;
  description?: string;
  resolved: boolean;
  isDismissed: boolean;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  reporter: Reporter;
  target: ContentTarget | UserTarget;
}

export interface ReportsResponse {
  data: Report[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type TableType = "users" | "videos" | "performance";

export type RangeType = "7days" | "30days" | "year";