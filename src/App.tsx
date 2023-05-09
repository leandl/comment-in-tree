import { useCallback, useState } from "react";
import { Comment } from "./components/comment/Comment";
import { generateString, getRandomInt } from "./utils";

type CommentAlbum = {
  id: number;
  username: string;
  text: string;
  replyes: CommentAlbum[];
}


function generateComment(id: number, comments: CommentAlbum[] = []): CommentAlbum {
  return {
    id,
    username: generateString(getRandomInt(5, 20)),
    text: generateString(getRandomInt(20, 500)),
    replyes: comments
  }
}

const TEXT_COMMENTS: CommentAlbum[] = [
  generateComment(1),
  generateComment(2, [
    generateComment(3, [
      generateComment(4),
      generateComment(5, [
        generateComment(6),
      ]),
    ]),
    generateComment(7),
  ]),
]


type CommentsProps = {
  comments: CommentAlbum[];
  onClick(id: number): void;
}

function addComment(parantId: number, newComment: CommentAlbum, comments: CommentAlbum[]): CommentAlbum[] {
  return comments.map((comment) => {
    if (comment.id === parantId) {
      return {
        ...comment,
        replyes: [newComment, ...comment.replyes]
      }
    }

    return {
      ...comment,
      replyes: addComment(parantId, newComment, comment.replyes)
    }
  });
}


function Comments({ comments, onClick }: CommentsProps) {
  return (
    <>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          id={comment.id}
          username={comment.username}
          text={comment.text}
          onClick={onClick}
        >
          <Comments comments={comment.replyes} onClick={onClick} />
        </Comment>
      ))}
    </>
  )
}



function App() {
  const [comments, setComments] = useState(TEXT_COMMENTS);

  const handleAddComment = useCallback((parentId: number) => {
    const comment: CommentAlbum = {
      id: Date.now(),
      username: generateString(getRandomInt(5, 20)),
      text: generateString(getRandomInt(20, 500)),
      replyes: [],
    }
    setComments(comments => addComment(
      parentId, comment, comments))
  }, []);


  return (
    <Comments comments={comments} onClick={handleAddComment}/>
  )
}

export default App
