import {extendType, intArg, nonNull, stringArg} from 'nexus';

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

export const GetAllRestaurants = extendType({
  type: 'Query',
  definition(t) {
    t.field('GetAllRestaurants', {
      type: 'RestaurantSearchOutput',
      args: {page: nonNull(intArg({default: 1}))},
      //@ts-ignore
      resolve: async (_, {page}, ctx: Context) => {
        try {
          const res = await ctx.prisma.restaurant.findMany({
            take: 25,
            skip: (page - 1) * 25,
          });

          const count = await ctx.prisma.restaurant.count();

          return {Restaurant: res, count, pageCount: Math.ceil(count / 2)};
        } catch (error) {
          return MyError(
            error,
            'GET_ALL_RESTAURANTS',
            'Unable to get all restaurants',
          );
        }
      },
    });
  },
});
