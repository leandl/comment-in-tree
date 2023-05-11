export type Comment = {
  id: number | string;
  username: string;
  text: string;
  userLikeComment: -1 | 0 | 1;
  likes: number;
  dislikes: number;
  replies: Comment[];
}