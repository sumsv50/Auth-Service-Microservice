import { FbPostRepo } from "@repos/site/post.repo";
import { IFbPost } from "@models/site/post.model";
import FbPost from "@models/site/post.model";

//define constance
const fbPostRepo = new FbPostRepo();


export default class PostService {

    async createFbPost(order: IFbPost) {
        return await fbPostRepo.create(order);
    }

    async getFbPost(query: object) {
        return await fbPostRepo.findOne(query);
    }

    async getFbPosts(query: object, page: number, itemPerPage: number) {
        return await FbPost.paginate(query, {
            page: page,
            limit: itemPerPage,
            lean: true,
            select: ['-createdBy'],
            populate: 'product',
            sort: '-createdAt'
        })
    }

    async updateFbPost(query: object, newPost: IFbPost) {
        return await fbPostRepo.updateOne(query, newPost);
    }

    async deleteFbPost(order: IFbPost) {
        return await fbPostRepo.deleteOne(order);
    }
}