/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FB from 'fb';
import {userRepo} from '@repos/user.repo'
import { UserDTO } from '@dto/user.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
// FB.setAccessToken(process.env.FB_ACCESS_TOKEN);

const populateUserAccessToken = async (userDto: UserDTO) => {
    const user = await userRepo.findOne({_id: userDto.id});
    if(user?.fbAccessToken) {
        await FB.setAccessToken(user.fbAccessToken);
        return user;
    }
    FB.setAccessToken('');
    return false;
};

const populatePageAccessToken = async (userDto: UserDTO) => {
    const user = await userRepo.findOne({_id: userDto.id});
    if(user?.pageAccessToken) {
        await FB.setAccessToken(user.pageAccessToken);
        return user;
    }
    FB.setAccessToken('');
    return false;
}

export {
    populateUserAccessToken,populatePageAccessToken, FB
}


