import {extendType, intArg, nonNull, stringArg} from 'nexus';

import {Context} from '../../context';
import {MyError} from '../../utils/error';

export const SearchRestaurant = extendType({
  type: 'Query',
  definition(t) {
    t.field('SearchRestaurant', {
      type: 'RestaurantSearchOutput',
      args: {
        term: nonNull(stringArg()),
        page: nonNull(intArg({default: 1})),
      },
      //@ts-ignore
      resolve: async (_, {term, page}, ctx: Context) => {
        try {
          const result = await ctx.prisma.restaurant.findMany({
            where: {
              OR: [
                {
                  name: {
                    contains: term,
                    mode: 'insensitive',
                  },
                },
                {
                  category: {
                    name: {
                      contains: term,
                      mode: 'insensitive',
                    },
                  },
                },
              ],
            },
          });

          const count = await ctx.prisma.restaurant.count({
            where: {
              OR: [
                {
                  name: {
                    contains: term,
                    mode: 'insensitive',
                  },
                },
                {
                  category: {
                    name: {
                      contains: term,
                      mode: 'insensitive',
                    },
                  },
                },
              ],
            },
          });

          return {Restaurant: result, count, page};
        } catch (error) {
          return MyError(
            error,
            'SEARCH_RESTAURANT_QUERY',
            'Unable To Search For restaurant',
          );
        }
      },
    });
  },
});
