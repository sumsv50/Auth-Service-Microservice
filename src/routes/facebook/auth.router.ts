/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import { userRepo } from '@repos/user.repo';
import jwt from 'jsonwebtoken';

import { InvalidTokenError } from '@shared/errors';
import authService from '@services/site/auth.service';
import AuthConfig from '@configs/authentication'
import responseFormat from '@shared/responseFormat';
import { UserDTO } from '@dto/user.dto';
import { passport } from '@middlewares/passport.middleware';

// Constants
const router = Router();

export const p = {
    fbOauth: '/oauth',
    fbConnection: '/connection',
} as const;

const encodedToken = (userId: string) => {
    return jwt.sign({
        iss: "social-sale-helper",
        sub: userId,
    }, <string>AuthConfig.JWT_SECRET, {
        expiresIn: '30d'
    })
}


/**
 * @swagger
 * components:
 *   schemas:
 *     User: 
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: user id
 *           example: "968221704087336"
 *         email:
 *           type: string
 *           description: email of user.
 *           example: user_1@gmail.com
 *         picture:
 *            type: string
 *            description: picture of account
 *            example: https://picture.com
 *     Token: 
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Access token
 */

/**
 * @swagger
 * /api/auth/facebook:
 *   post: 
 *     summary: Oauth Facebook
 *     tags: ["Auth"]
 *     requestBody: {
 *      content: {
 *        "application/json":
 *         {
 *           schema:
 *           {
 *            $ref: '#/components/schemas/Token'
 *           }
 *         }
 *          
 *      }
 *     }
 *     responses: 
 *       200:
 *         description: Signup/login successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *               
 * 
 */
router.post(p.fbOauth, (async (req: Request, res: Response) => {
    try {
        const { accessToken } = req.body;

        // Fetch data
        const userInfo = await authService.getUserFBInfo(accessToken);
        const longTimeToken = await authService.getLongTimeToken(accessToken);

        if (!userInfo) {
            throw new InvalidTokenError();
        }

        userInfo.picture = `https://graph.facebook.com/${userInfo.id}/picture?access_token=${longTimeToken.access_token}&type=large`;
        const user = await userRepo.findOrCreate(userInfo);

        const token = encodedToken(user._id);
        const expire = Date.now() + (longTimeToken.expires_in || 1) * 1000;
        await userRepo.saveFBAccessToken(
            user._id,
            longTimeToken.access_token,
            expire
        );
        res.status(StatusCodes.OK).json(responseFormat(true, {}, {
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                picture: user.picture
            }
        }));
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
            message: err.message
        }));
    }
}) as RequestHandler);

router.post(p.fbConnection, passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {
    const user = <UserDTO>req.user;
    const { accessToken } = req.body;

    // Fetch data
    const userInfo = await authService.getUserFBInfo(accessToken);
    const longTimeToken = await authService.getLongTimeToken(accessToken);

    if (!userInfo || !longTimeToken) {
        throw new InvalidTokenError();
    }

    // Save token to DB
    const expire = Date.now() + longTimeToken.expires_in * 1000;
    await userRepo.saveFBAccessToken(
        user.id,
        longTimeToken.access_token,
        expire
    );

    // Response
    res.status(StatusCodes.OK).json(responseFormat(true, {}, {
        userInToken: {
            fbId: userInfo.id,
            name: userInfo.name,
            picture: userInfo.picture
        }
    }));

}) as RequestHandler);


// Export default
export default router;