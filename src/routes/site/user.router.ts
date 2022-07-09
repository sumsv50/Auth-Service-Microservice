import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import { userRepo } from '@repos/user.repo';

import responseFormat from '@shared/responseFormat';

// Constants
const router = Router();

export const p = {
  facebookUser: '/facebook-users',
} as const;

router.get(p.facebookUser, (async (req: Request, res: Response) => {
  try {

    const fbUsers = await userRepo.find({ fbAccessToken: { $exists: true } });
    res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      fbUsers
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);


// Export default
export default router;

