import {extendType, nonNull, stringArg} from 'nexus';

import {Context} from '../../context';
import {MyError} from '../../utils/error';

export const GetRestaurant = extendType({
  type: 'Query',
  definition(t) {
    t.field('GetRestaurant', {
      type: 'Restaurant',
      args: {
        id: nonNull(stringArg()),
      },
      validate: async ({string}) => ({
        id: string().required(),
      }),
      resolve: async (_, {id}, ctx: Context) => {
        try {
          const res = await ctx.prisma.restaurant.findFirst({where: {id}});

          if (!res) {
            throw Error(`Restaurant Not Found`);
          }

          return res;
        } catch (error) {
          return MyError(
            error,
            'UNABLE_TO_FIND_RESTAURANT',
            'Get One Restaurant Query',
          );
        }
      },
    });
  },
});
