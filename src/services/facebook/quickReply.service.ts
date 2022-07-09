/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IQuickReply } from "@models/facebook/quickReplies.model";
import { quickReplyRepo } from "@repos/facebook/quickReply.repo";
import request from "request";


export default {
    updateQuickReply: updateQuickReply,
    getQuickReply: getQuickReply,
    sendMessage: sendMessage,
    addQuickReply: addQuickReply,
    deleteQuickReply: deleteQuickReply
} as const;

async function updateQuickReply(quickReply: IQuickReply) {
    
    const quickReplyRes = await quickReplyRepo.updateQuickReply(quickReply);
    return quickReplyRes;
}

async function addQuickReply(quickReply: IQuickReply) {
    const newQuickReply = await quickReplyRepo.createQuickReply(quickReply);
    return newQuickReply;
}

async function deleteQuickReply(quickReply: IQuickReply) {
    const deletedQuickReply = await quickReplyRepo.deleteMany(quickReply.pageId, quickReply.ids);
    return deletedQuickReply;
}

async function getQuickReply( pageId: string ) {
    
    const quickReply = await quickReplyRepo.findMany({ pageId:pageId });
    return quickReply;
}

async function sendMessage(message:any) {
    const {receiverId, quickReplyId } = message;
    const quickReply = await quickReplyRepo.find({ _id: quickReplyId });
    const request_body = {
        recipient:{
            id: receiverId
        },
        message: {
            text: quickReply.text,
            quick_replies: quickReply.samples.map((e:any) => {
                const { _id, ...newE} = e;
                return newE;
            })
        }
    }

    return new Promise(function (resolve, reject) {
        request({
            "uri": "https://social-sales-helper-webhook.herokuapp.com/callSendAPI",
            "method": "POST",
            "json": request_body
          }, (err, res, body) => {
            if (!err) {
              resolve(body);
            } else {
                reject(err);
            }
          });
     })
}