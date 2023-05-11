import { useCallback, useState } from "react";
import { Comment as CommentAlbum } from "./components/comment/Comment";
import { createComments } from "./components/comments/Comments";
import { generateComment } from "./utils";
import { addComment } from "./add-comment";
import { Comment } from "./entities/comment";


const TEXT_COMMENTS: Comment[] = [
  generateComment(),
  generateComment({ replies: [
    generateComment({ replies: [
      generateComment(),
      generateComment({ replies: Array(10).fill(null).map((_, i) => generateComment({ id: i }))}),
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

const Comments = createComments();

function App() {
  const [comments, setComments] = useState(TEXT_COMMENTS);

  const handleAddComment = useCallback((parentId: number) => {
    const comment = generateComment();
    setComments(comments => addComment(
      parentId, comment, comments))
  }, []);


  return (
    <Comments
      comments={comments}
      // onClick={handleAddComment}
    />
  )
}

export default App
