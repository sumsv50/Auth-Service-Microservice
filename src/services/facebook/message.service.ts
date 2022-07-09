/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {FB} from "@shared/fb";
import io from '../../index'
import request from "request";
import messageReadService from '@services/facebook/messageRead.service';

async function getAllConversation(pageId: string, userId: string) {
    let response = [];
    const conversationResponse = await FB.api(`/${pageId}/conversations`,'GET');
    const threads = conversationResponse.data;
    for(let thread of threads) {
        const threadDetail = await FB.api(`/${thread.id}?fields=participants,updated_time`, 'GET');
        const fbUserId = threadDetail.participants.data[0].id;
        let userDetail={};
        try {
            userDetail = await FB.api(`/${fbUserId}/picture?type=large`,{redirect: false}, 'GET');
        } catch (error) {
            console.log(error.message);
        }
        threadDetail.participants.data[0]= Object.assign(threadDetail.participants.data[0], userDetail);
        const messageRead = await messageReadService.getMessageRead({threadId: thread.id, userId:userId});
        threadDetail.isRead = messageRead?.isRead || false;
        response.push(threadDetail);
    }
    return response;
}

async function getDetail(threadId: string, userId: string) {
    let response = [];
    const threadResponse = await FB.api(`/${threadId}?fields=participants,messages`,'GET');
    const messages = threadResponse.messages.data;
    messageReadService.updateMessageRead({threadId: threadId, userId: userId, pageId: threadResponse.participants?.data[1].id
        , senderId: threadResponse.participants?.data[0].id, isRead:true});
    for(let message of messages) {
        const messageDetail = await FB.api(`/${message.id}?fields=created_time,from,to,message,attachments`, 'GET');
        response.push(messageDetail);
    }
    return response;
}

async function receiveEvent(event: any) {
    io.emit('get message', event);
    console.log(event);
    const messageRead = await messageReadService.getMessageRead({senderId: event.senderId, pageId:event.recipientId});
    if(messageRead) {
        messageReadService.updateMessageRead({threadId: messageRead.threadId, userId: messageRead.userId, isRead:false});
    }
    return messageRead;
}

async function sendMessage(message: any) {
    const {receiverId, messageText, messageAttachment } = message;

    let request_body = {
        recipient:{
            id: receiverId
        },
        message: {

        }
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if(messageText) {
        request_body.message = {
            text: messageText
        }
    }
    if(messageAttachment) {
        request_body.message = {
            attachment: {
                type: 'image',
                payload: {
                    url: messageAttachment.path,
                    is_reusable: true
                }
            }
        }
    }
    let response;
    return new Promise(function (resolve, reject) {
        request({
            "uri": "https://social-sales-helper-webhook.herokuapp.com/callSendAPI",
            "method": "POST",
            "json": request_body
          }, (err: any, res: any, body: any) => {
            if (!err) {
              resolve(body);
            } else {
                reject(err);
            }
          });
     })
}

async function turnOnGreeting(greetingText: string) {
    const response = await FB.api('me/messenger_profile', 'POST', {
        get_started: {
            payload: 'GET_STARTED_PAYLOAD'
        },
        greeting: [{
                locale:'default',
                text: greetingText
            }]
    });
    console.log(response);
    return response;
}

async function turnOffGreeting() {
    const response = await FB.api('me/messenger_profile', 'DELETE', {
        fields: ["get_started","greeting"]
    });
    return response;
}


async function getGreeting() {
    const response = await FB.api('me/messenger_profile?fields=greeting,get_started', 'GET');
    let greeting;
    if(response.data?.length > 0) {
        greeting = response.data[0].greeting[0].text;
    }
    return greeting;
}

export default {
    getAllConversation,
    getDetail,
    receiveEvent,
    sendMessage,
    turnOnGreeting,
    turnOffGreeting,
    getGreeting
} as const;