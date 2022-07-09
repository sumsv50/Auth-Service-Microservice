import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import { userRepo } from '@repos/user.repo';
import jwt from 'jsonwebtoken';

import AuthConfig from '@configs/authentication'
import responseFormat from '@shared/responseFormat';
import { UserDTO } from '@dto/user.dto';
import { passport } from '@middlewares/passport.middleware';

// Constants
const router = Router();

export const p = {
  localSignUp: '/sign-up',
  localSignIn: '/sign-in',
  userInfo: '/user/info',
  identification: '/identification',
} as const;

const encodedToken = (userId: string) => {
  return jwt.sign({
    iss: "social-sale-helper",
    sub: userId,
  }, <string>AuthConfig.JWT_SECRET, {
    expiresIn: '30d'
  })
}

router.post(p.localSignUp, (async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const isExisted = await userRepo.checkEmailIsExisted(email);

    if (isExisted) {
      res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        message: 'Email already in use!'
      }, { email }));
      return;
    }

    const newUser = await userRepo.createUser(email, password);

    res.status(StatusCodes.CREATED).json(responseFormat(true, {}, {
      email: newUser.email
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.post(p.localSignIn, passport.authenticate('local', { session: false }), (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const token = encodedToken(user.id);
    res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.get(p.userInfo, passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;

    const userInfo = await userRepo.getUserInfo({ _id: user.id });

    res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      user: {
        id: userInfo._id,
        ...userInfo,
        _id: undefined
      }
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.get(p.identification, passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {
  const user = <UserDTO>req.user;
  const userInfo = await userRepo.getUserInfo({ _id: user.id });
  const userString = <string>JSON.stringify(userInfo);

  res.setHeader('User-Info', Buffer.from(userString).toString('base64')).status(StatusCodes.OK).json({});
}) as RequestHandler);

router.get('/test', (async (req: Request, res: Response) => {

  const userEncode  = <string>req.headers['user-info'];
  const userString = Buffer.from(userEncode, 'base64').toString('utf8');
  const user = JSON.parse(userString);

  console.log(user);
  res.status(200).json({ok: true});
}) as RequestHandler);

// Export default
export default router;

