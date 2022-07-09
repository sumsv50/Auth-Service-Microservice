/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FB, populateUserAccessToken } from '@shared/fb';
import fs from 'fs';
import { FbPostRepo } from '@repos/site/post.repo';
import { isWithInRangeTime, removeAscent } from '@shared/functions';
import groupService from './group.service';
import { POST_STATUS } from '@models/site/enum';
import { UserDTO } from '@dto/user.dto';

//define constant
const fbPostRepo = new FbPostRepo();

async function getAll(groupId: string) {
  FB.setAccessToken(process.env.PAGE_ACCESS_TOKEN);
  const postResponse = await FB.api(
    `/${groupId}/feed?fields=link,message,from,created_time,updated_time,attachments`,
    'GET'
  );
  for (let post of postResponse.data) {
    let media: object[] = [];
    if (post.attachments) {
      for (let attachment of post.attachments.data) {
        if (attachment?.subattachments) {
          for (let subAttachment of attachment.subattachments.data) {
            media.push(subAttachment.media.image);
          }
        }else if (attachment?.media) {
          media.push(attachment.media.image);
        }
      }
      post.attachments = undefined;
    }
    post.media = media;
  }
  const groupInfoResponse = await FB.api(
    `/${groupId}?fields=picture, name`,
    'GET'
  );
  return { posts: postResponse.data, groupInfo: groupInfoResponse };
}

async function getById(query: object) {
  return await fbPostRepo.findOne(query);
}

async function post(postReq: any) {
  const response = await FB.api(`/${postReq.groupId}/feed`, 'POST', {
    message: postReq.content,
  });

  //save to db
  let groups = [];
  groups.push(await groupService.getById(postReq.groupId));

  await fbPostRepo.create({
    createdBy: postReq.user.id,
    fbPostIds: response.post,
    groups: groups,
    content: postReq.content,
    images: postReq.images,
    product: postReq.productId,
  });

  return response;
}

async function postMultiple(postReqList: any) {
  let postIds = <Array<string>>[];
  let postStatus = POST_STATUS.WAITING;
  const groupIds = postReqList.groupsId;
  const isSchedulePost = Boolean(postReqList.schedulePostTime);

  if (!isSchedulePost) {
    postIds = await postMultiToFB(postReqList);
    postStatus = POST_STATUS.POSTED;
  }

  if (postReqList.is_seller) {
    //save to db
    let groups: Array<any> = [];
    for(const groupId of groupIds) {
      groups.push(await groupService.getById(groupId));
    }
  
    await fbPostRepo.create({
      createdBy: postReqList.user.id,
      fbPostIds: postIds,
      groups: groups,
      content: postReqList.content,
      images: postReqList.images,
      product: postReqList.productId,
      status: postStatus,
      schedulePostTime: postReqList.schedulePostTime
    });
  }

  return postIds;
}

async function postMultiToFB(postReqList: any) {
  const postIds = [];
  const groupIds = postReqList.groupsId;
  const isHavingImages = postReqList?.images?.length > 0 ? true : false;
  for (const groupId of groupIds) {
    let response;
    if (isHavingImages) {
      response = await FB.api(`/${groupId}/feed`, 'POST', {
        message: postReqList.content,
        link: postReqList.images[0],
      });
    } else {
      response = await FB.api(`/${groupId}/feed`, 'POST', {
        message: postReqList.content,
      });
    }
    postIds.push(response.id);
  }
  return postIds;
}

async function getFromMultiGroup(groupIds: string[]) {
  let posts = <Array<any>>[];
  for (const groupId of groupIds) {
    try {
      const response = await getAll(groupId);
      response.posts.forEach((post: any) => {
        post.groupInfo = response.groupInfo;
        if (post.from) {
          const posterId = post.from.id;
          post.from.picture = `https://graph.facebook.com/${posterId}/picture?type=large&access_token=${process.env.PAGE_ACCESS_TOKEN}`;
        }
      });
      posts = posts.concat(response.posts);
    } catch (err) {
      continue;
    }
  }
  return posts;
}

function filterInterestedPostsWithinTime(
  posts: any[],
  keywords: string[],
  timeRange: any = null
) {
  let result = <Array<any>>[];

  if (keywords.length <= 0) {
    return result;
  }
  const removedAscentKeywords = keywords.map((keyword) =>
    removeAscent(keyword)
  );
  const filterRegex = new RegExp(removedAscentKeywords.join('|'), 'ig');
  for (const post of posts) {
    const postTime = new Date(post.updated_time).getTime();
    if (timeRange && !isWithInRangeTime(postTime, timeRange)) {
      continue;
    }
    if (filterRegex.test(removeAscent(post.message))) {
      result.push(post);
    }
  }
  return result;
}

async function postWaitingPosts() {
  const now = new Date().getTime();
  const waitingPosts = await fbPostRepo.findManyWithoutPaginate({
    status: POST_STATUS.WAITING,
    schedulePostTime: { $lte: now },
  });

  for (const waitingPost of waitingPosts) {
    if (
      !(await populateUserAccessToken(<UserDTO>{ id: waitingPost.createdBy }))
    ) {
      continue;
    }
    try {
      const payload = {
        groupsId: waitingPost.groups.map((group: any) => group.id),
        content: waitingPost.content,
        images: waitingPost.images,
      };
      const fbPostIds = await postMultiToFB(payload);

      // Update waitingPost
      await fbPostRepo.updateOne(
        { _id: waitingPost._id },
        {
          status: POST_STATUS.POSTED,
          fbPostIds,
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
}

async function test() {
  const response = await FB.api(`/968221704087336/photos`, 'POST', {
    message: 'test',
    attached_media: [
      fs.createReadStream(process.cwd() + '/src/public/images/1on2y0.jpg'),
      fs.createReadStream(process.cwd() + '/src/public/images/undefined.png'),
    ],
  });

  return response;
}

async function getInteractions(postIds: string[]) {
  let postData = <Array<any>>[];
  try {
    for (const postId of postIds) {
      const response = await FB.api(
        `/${postId}?fields=comments,reactions,shares`,
        'GET'
      );
      // const noOfComments = response?.comments?.data.length || 0;
      // const noOfReactions = response?.reactions?.data.length || 0;
      // const noOfShares = response?.shares?.count || 0;
      // sum += noOfComments + noOfReactions + noOfShares;
      postData.push(response);
    }
    return postData;
  } catch (error) {
    return postData;
  }
}

function filterPostsOfOtherMember(posts: any[], fbId: string) {
  const result = <Array<any>>[];
  for (const post of posts) {
    if(post?.from?.id && post.from.id == fbId) {
      continue;
    }
    result.push(post);
  }
  return result;
}

export default {
  getAll,
  getById,
  post,
  postMultiple,
  getFromMultiGroup,
  filterInterestedPostsWithinTime,
  postWaitingPosts,
  getInteractions,
  filterPostsOfOtherMember,
  test,
} as const;
