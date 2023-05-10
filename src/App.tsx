import { useCallback, useState } from "react";
import { Comment as CommentAlbum } from "./components/comment/Comment";
import { generateComment } from "./utils";
import { addComment } from "./add-comment";
import { Comment } from "./entities/comment";


const TEXT_COMMENTS: Comment[] = [
  generateComment(),
  generateComment({ replies: [
    generateComment({ replies: [
      generateComment(),
      generateComment({ replies: Array(5).fill(null).map(() => generateComment())}),
    ]}),
    generateComment(),
  ]}),
]


type CommentAlbumsProps = {
  comments: Comment[];
  onClick(id: number): void;
}


function CommentAlbums({ comments, onClick }: CommentAlbumsProps) {
  return (
    <>
      {comments.map((comment) => (
        <CommentAlbum
          key={comment.id}
          id={comment.id}
          username={comment.username}
          text={comment.text}
          onClick={onClick}
        >
          <CommentAlbums comments={comment.replies} onClick={onClick} />
        </CommentAlbum>
      ))}
    </>
  )
}



function App() {
  const [comments, setComments] = useState(TEXT_COMMENTS);

  const handleAddComment = useCallback((parentId: number) => {
    const comment = generateComment();
    setComments(comments => addComment(
      parentId, comment, comments))
  }, []);


  return (
    <CommentAlbums comments={comments} onClick={handleAddComment}/>
  )
}

export default App
