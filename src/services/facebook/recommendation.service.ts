/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IRecommendation } from "@models/facebook/recommendation.model";
import { recommendationRepo } from "@repos/facebook/recommendation.repo";
import request from "request";


export default {
    updateRecommendation: updateRecommendation,
    getRecommendation: getRecommendation,
    getResponseMessageContent: getResponseMessageContent,
    addRecommendation: addRecommendation,
    deleteRecommendation: deleteRecommendation,
    getManyRecommendation: getManyRecommendation
} as const;

async function updateRecommendation(recommendation: any) {
    const recommendationRes = await recommendationRepo.updateRecommendation(recommendation);
    return recommendationRes;
}

async function getRecommendation( pageId: string ) {
    const recommendation = await recommendationRepo.find({ pageId:pageId });
    return recommendation;
}

async function getManyRecommendation( pageId: string ) {
    const recommendations = await recommendationRepo.findMany({ pageId:pageId });
    return recommendations;
}

async function addRecommendation(recommendation: IRecommendation) {
    const newRecommendation = await recommendationRepo.createRecommendation(recommendation);
    return newRecommendation;
}

async function deleteRecommendation(recommendation: IRecommendation) {
    const deletedRecommendation = await recommendationRepo.deleteMany(recommendation.pageId, recommendation.ids);
    return deletedRecommendation;
}

async function getResponseMessageContent( pageId: string, message: string ) {
    const recommendations = await getManyRecommendation(pageId);
    let responseMessageContent = null;
    for(const recommendation of recommendations) {
        if(recommendation) {
            recommendation.mappings.forEach((element: any) => {
                //if message contains any element of keys
                const isContainsKey = element.keys.some((key: string) => message.includes(key));
                if(isContainsKey && element.active) {
                    responseMessageContent = element.responseContent;
                    return responseMessageContent;
                }
            });
        }
    }
    return responseMessageContent;
}