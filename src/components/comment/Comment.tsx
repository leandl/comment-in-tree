import { ReactNode } from "react";
import "./comment.styles.css";

type CommentProps = {
  id: number | string;
  username: string;
  text: string;
  onClick(id: number | string): void;
  children?: ReactNode;
}

export function Comment({
  id,
  username,
  text,
  onClick,
  children
}: CommentProps) {
  return (
    <div className="comment">
      <div className="comment-content">
        <div>
          <span onClick={() => onClick(id)} className="comment-username">{username}</span>
          
        </div>
        <div>{text}</div>
      </div>
      <div className="sub-comments">{children}</div>
    </div>
  )
}