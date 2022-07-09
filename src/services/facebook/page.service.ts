/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {FB} from '@shared/fb';
import {userRepo} from '@repos/user.repo';

async function getAll() {
    const response = await FB.api('/me/accounts?fields=name,id,picture,about,link','GET');
    return response.data;
}

async function connectPage(userId: string,pageId: string) {
    const response = await FB.api(`${pageId}?fields=access_token`,'GET');
    userRepo.savePageAccessToken(userId, response.access_token);
    return response;
}

async function findDetail() {
  const pageInfo = await FB.api('/me?fields=picture,name,about,link','GET');
  
  return pageInfo;
}

async function checkIfPageIsAccessible(pageId: string) {
  const response = await FB.api(`me`,'GET');
  if(response.id === pageId) {
    return true;
  }
  return false;
}


export default {
  getAll,
  connectPage,
  findDetail,
  checkIfPageIsAccessible
} as const;