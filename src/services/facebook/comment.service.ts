import { FB } from '@shared/fb';
import { paginate } from '@shared/functions';
import fs from 'fs';

const ITEM_PER_PAGE = 12;

async function getAll(postIds: string[], page: number) {
  // eslint-disable-next-line prefer-const
  let comments = [];
  for (const postId of postIds) {
    const response = await FB.api(
      `/${postId}/comments?fields=from,message,likes,comments,attachment,created_time`,
      'GET'
    );
    for (const comment of response.data) {
      comments.push({ ...comment, postId });
    }
  }
  // const commentsInCurrentPage = paginate(comments, ITEM_PER_PAGE, page);
  // const totalPages = Math.ceil(comments.length / ITEM_PER_PAGE);
  // const hasPrevPage = page > 1;
  // const hasNextPage = page < totalPages;
  // const prevPage = page != 1 ? page - 1 : null;
  // const nextPage = page != totalPages ? page + 1 : null;
  // const pagination = {
  //   limit: ITEM_PER_PAGE,
  //   count: commentsInCurrentPage.length,
  //   totalPages: totalPages,
  //   page: page,
  //   hasPrevPage: hasPrevPage,
  //   hasNextPage: hasNextPage,
  //   prevPage: prevPage,
  //   nextPage: nextPage,
  // };
  return {comments};
}

export default {
  getAll,
} as const;
