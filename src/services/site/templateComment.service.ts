import { TemplateCommentRepo } from "@repos/site/templateComment.repo";
import { ITemplateComment } from "@models/site/templateComment.model";

//define constance
const templateCommentRepo = new TemplateCommentRepo();


export default class TemplateCommentService {

    async createComment(comment: ITemplateComment) {
        return await templateCommentRepo.create(comment);
    }

    async getComment(query: object) {
        return await templateCommentRepo.findOne(query);
    }

    async getAllComments(query: object) {
        return await templateCommentRepo.findAll(query);
    }

    async updateComment(query: object, newComment: ITemplateComment) {
        return await templateCommentRepo.updateOne(query, newComment);
    }

    async deleteComment(comment: ITemplateComment) {
        return await templateCommentRepo.deleteOne(comment);
    }
}