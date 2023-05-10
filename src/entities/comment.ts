export type Comment = {
  id: number;
  username: string;
  text: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
}