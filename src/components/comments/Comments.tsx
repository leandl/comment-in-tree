import { useEffect, useState, useCallback } from 'react';
import { Comment as CommentEntity } from "../../entities/comment";
import { createDatabase } from "../../utils/database-in-memory/database";

import "./comment.styles.css";
import { generateComment } from '../../utils';

type ID = number | string;
type CommentSimplify = {
	id: ID;
  username: string;
  text: string;
	userLike: boolean;
	userDislike: boolean;
  likes: number;
  dislikes: number;
  replies: ID[];
}


type CommentProps = {
  commentId: ID;
}

type CommentsProps = {
  comments: CommentEntity[];
}

export function createComments() {
	const commentDB = createDatabase<CommentSimplify>();

	function initializeCommentsInDB(comments: CommentEntity[])	{
		for (let i = 0; i < comments.length; i++) {
			const comment = comments[i];
			commentDB.instance.set({
				id: comment.id,
				dislikes: comment.dislikes,
				likes: comment.likes,
				text: comment.text,
				userDislike: comment.userLikeComment === -1,
				userLike: comment.userLikeComment === 1,
				username: comment.username,
				replies: comment.replies.map(reply => reply.id)
			});

			initializeCommentsInDB(comment.replies);
		}
	}

	function Comment({ commentId }: CommentProps) {
		const [comment, setComment] = useState(commentDB.instance.get(commentId));

		useEffect(() => {
			return commentDB.instance.onAfterAdd(({ value: comment }) => {
				if (comment.id !== commentId) {
					return;
				}

				setComment(comment);
			});
		}, [commentId]);

		const handleAddComment = useCallback(() => {
			if (!comment?.replies) {
				return;
			}

			const newComment = generateComment();

			commentDB.instance.set({
				id: newComment.id,
				userDislike: false,
				userLike: false,
				dislikes: newComment.dislikes,
				likes: newComment.likes,
				text: newComment.text,
				username: newComment.username,
				replies: newComment.replies.map(reply => reply.id)
			});

			const newReplies = [newComment.id, ...comment.replies];
			commentDB.instance.update(commentId, {
				replies: newReplies
			});
		}, [commentId, comment?.replies]);

		const handleToggleLike = useCallback(() => {
			commentDB.instance.update(commentId, {
				userLike: !(comment?.userLike || false),
				userDislike: false
			});
		}, [commentId, comment?.userLike])

		const handleToggleDislike = useCallback(() => {
			commentDB.instance.update(commentId, {
				userLike: false,
				userDislike: !(comment?.userDislike || false)
			});
		}, [commentId, comment?.userDislike])

		if (!comment) {
			return <>loading..</>
		}

		const spanDislikeActive = comment.userDislike ? "active" : ""; 
		const spanLikeActive = comment.userLike ? "active" : "";

		const likes = comment.userLike ? comment.likes + 1 : comment.likes;
		const dislikes = comment.userDislike ? comment.dislikes + 1 : comment.dislikes;

		return (
			<div className="comment">
				<div className="comment-content">
					<div>
						<span 
							className="comment-username"
							onClick={handleAddComment}
						>
							{comment.username}
						</span>
						<div className='comment-container-like'>
							<span
								onClick={handleToggleLike}
								className={`comment-like ${spanLikeActive}`}
							>
								likes: {likes}
							</span>
							<span
								onClick={handleToggleDislike}
								className={`comment-dislike ${spanDislikeActive}`}
							>
								dislikes: {dislikes}
							</span>
						</div>
					</div>
					<div className='comment-text'>{comment.text}</div>
				</div>
				<div className="sub-comments">
					{comment.replies.map((replyId) => (
						<Comment
							key={replyId}
							commentId={replyId}
						/>
					))}
				</div>
			</div>
		)
	}

	function Comments({ comments }: CommentsProps) {
		const [parentIds, setParentIds] = useState<ID[]>([]);

		useEffect(() => {
			initializeCommentsInDB(comments);
			setParentIds(comments.map(c => c.id));
		}, [comments]);

		return (
			<> 
				<div className="comments">
					{parentIds.map((parentId) => (
						<Comment
							key={parentId}
							commentId={parentId}
						/>
					))}
				</div>
			</>
		)
	}

	return Comments;
}