/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IMessageRead } from "@models/facebook/messageRead.model";
import { messageReadRepo } from "@repos/facebook/messageRead.repo";


export default {
    updateMessageRead: updateMessageRead,
    getMessageRead: getMessageRead
} as const;

async function updateMessageRead(messageRead: IMessageRead) {
    const messageReadRes = await messageReadRepo.findAndUpdate(messageRead);
    return messageReadRes;
}

async function getMessageRead( query:IMessageRead ) {
    const messageRead = await messageReadRepo.find(query);
    return messageRead as IMessageRead;
}

