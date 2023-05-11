import { Comment } from "./entities/comment";

const characters ='ABCDEFGH     IJKLMNOPQRSTUVWXY       Zabcdefghij      klmnopqrstuvwx     yz0123456789';

export function generateString(length: number) {
  let result = '';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function generateComment(comment?: Partial<Comment>): Comment {
  return {
    id: comment?.id || (Date.now() - getRandomInt(100, 2000)),
    username: comment?.username || generateString(getRandomInt(5, 20)),
    text: comment?.text || generateString(getRandomInt(20, 500)),
    replies: comment?.replies || [],
    userLikeComment: 1,
    dislikes: comment?.dislikes || getRandomInt(5, 20),
    likes: comment?.likes || getRandomInt(5, 20)
  }
}