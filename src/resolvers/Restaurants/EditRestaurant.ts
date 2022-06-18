import {arg, extendType, nonNull} from 'nexus';

import {Context} from '../../context';
import {EditRestaurantInput} from './InputTypes';
import {MyError} from '../../utils/error';
import {assert} from '../../utils/assert';

const DefaultUrl = `https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60`;

export const EditRestaurant = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('EditRestaurant', {
      type: 'Restaurant',
      args: {
        data: nonNull(
          arg({
            type: EditRestaurantInput,
          }),
        ),
      },
      //@ts-ignore
      resolve: async (
        _,
        {data: {address, category, id, coverImage}},
        ctx: Context,
      ) => {
        try {
          assert(ctx.userId, 'NOT AUTHORIZED');

          const restaurant = await ctx.prisma.restaurant.findFirst({
            where: {id},
            select: {id: true, ownerId: true},
          });

          if (!restaurant) {
            throw Error(`Restaurant Not Found`);
          }

          if (restaurant.ownerId !== ctx.userId) {
            throw Error('You are not allowed to do this operation');
          }

          const CategoryName = category.trim().toLowerCase();
          const CategorySlug = CategoryName.replace(/ /g, '-');

          const UpdatedRestaurant = await ctx.prisma.restaurant.update({
            where: {id},
            data: {
              address: address ? address : undefined,
              coverImage: coverImage ? coverImage : undefined,
              ...(category && {
                category: {
                  connectOrCreate: {
                    create: {
                      coverImage: coverImage ? coverImage : DefaultUrl,
                      Slug: CategorySlug,
                      name: CategoryName,
                    },
                    where: {
                      Slug: CategorySlug,
                    },
                  },
                },
              }),
            },
            select: {id: true},
          });

          return UpdatedRestaurant;
        } catch (error) {
          return MyError(
            error,
            'EDIT_RESTAURANT_MUTATION',
            'UNABLE TO MAKE CHANGES TO RESTAURANT PROPERTIES',
          );
        }
      },
    });
  },
});
