import {extendType, nonNull, stringArg} from 'nexus';

import {Context} from '../../context';
import {MyError} from '../../utils/error';
import {assert} from '../../utils/assert';

export const DeleteRestaurant = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('DeleteRestaurant', {
      type: 'String',
      args: {
        id: nonNull(stringArg()),
      },
      validate: async ({string}) => ({
        id: string().required(),
      }),
      //@ts-ignore
      resolve: async (_, {id}, ctx: Context) => {
        try {
          assert(ctx.userId, 'Not Authorized');

          const Restaurant = await ctx.prisma.restaurant.findUnique({
            where: {id},
            select: {id: true, ownerId: true},
          });

          if (!Restaurant) {
            throw Error('Unable To find Restaurant');
          }

          if (Restaurant.ownerId !== ctx.userId) {
            throw Error('You are not allowed to do this operation');
          }

          await ctx.prisma.restaurant.delete({where: {id}});

          return `Success`;
        } catch (error) {
          return MyError(
            error,
            'DELETE_RESTAURANT_MUTATION',
            'Delete Restaurant mutation',
          );
        }
      },
    });
  },
});
