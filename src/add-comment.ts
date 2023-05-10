import { Comment } from "./entities/comment";


function addCommentInbranch(
  parantId: number,
  newComment: Comment,
  branch: Comment
): { isAddInbranch: boolean, branch: Comment} {
  if (parantId === branch.id) {
    return {
      isAddInbranch: true,
      branch: {
        ...branch,
        replies: [newComment, ...branch.replies]
      }
    }
  }

  let isAddCommentInbranch = false;
  const replies = branch.replies.map(comment => {
    if (isAddCommentInbranch) {
      return comment;
    }

    const { isAddInbranch, branch } = addCommentInbranch(
      parantId,
      newComment,
      comment
    );

    isAddCommentInbranch = isAddInbranch;
    return branch;
  });


  return {
    isAddInbranch: isAddCommentInbranch,
    branch: {
      ...branch,
      replies
    }
  }
}

export function addComment(
  parantId: number,
  newComment: Comment,
  comments: Comment[]
): Comment[] {
  let isAddCommentInbranch = false;
  return comments.map(comment => {
    if (isAddCommentInbranch) {
      return comment;
    }

    const { isAddInbranch, branch } = addCommentInbranch(
      parantId,
      newComment,
      comment
    );

    isAddCommentInbranch = isAddInbranch;
    return branch;
  });
}
