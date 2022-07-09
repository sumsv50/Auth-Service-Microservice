import {FB} from "@shared/fb";


async function getAll() {
    const response = await FB.api('/me/groups?fields=picture,name,id&admin_only=true','GET');
    return response.data;
}

async function getById(groupId: string) {
    const response = await FB.api('/' + groupId,'GET');
    return response;
}

export default {
    getAll,
    getById
} as const;