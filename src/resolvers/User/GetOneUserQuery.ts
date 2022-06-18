import {nullable, queryField, stringArg} from 'nexus';

import {MyError} from '../../utils/error';
import {assert} from '../../utils/assert';

export const GetSingleUser = queryField('SingleUser', {
  type: 'User',
  args: {userId: nullable(stringArg()), email: nullable(stringArg())},
  resolve: async (_, args, {prisma}) => {
    try {
      let user;
      if (args.userId) {
        user = await prisma.user.findUnique({
          where: {
            id: args.userId,
          },
        });
      } else if (args.email) {
        user = await prisma.user.findUnique({
          where: {
            email: args.email,
          },
        });
      }

      if (!user) {
        throw Error;
      }

      return user;
    } catch (error) {
      return MyError(error, 'USER_NOT_FOUND', 'Get One User Query');
    }
  },
});
