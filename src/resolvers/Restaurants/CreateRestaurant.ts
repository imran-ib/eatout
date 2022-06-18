import {arg, extendType, nonNull} from 'nexus';

import {Context} from '../../context';
import {CreateRestaurantInput} from './InputTypes';
import {MyError} from '../../utils/error';
import {assert} from 'console';

const DefaultUrl = `https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60`;

export const CreateRestaurant = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('CreateRestaurant', {
      type: 'Restaurant',
      args: {
        data: nonNull(
          arg({
            type: CreateRestaurantInput,
          }),
        ),
      },
      resolve: async (
        _,
        {data: {name, address, category, coverImage = DefaultUrl}},
        ctx: Context,
      ) => {
        try {
          assert(ctx.userId, 'Not Authorized');

          const CategoryName = category.trim().toLowerCase();
          const CategorySlug = CategoryName.replace(/ /g, '-');

          return ctx.prisma.restaurant.create({
            data: {
              address,
              name,
              coverImage,
              owner: {
                connect: {
                  id: ctx.userId!,
                },
              },
              category: {
                connectOrCreate: {
                  create: {
                    Slug: CategorySlug,
                    name: CategoryName,
                    coverImage,
                  },
                  where: {
                    Slug: CategorySlug,
                  },
                },
              },
            },
          });
        } catch (error) {
          return MyError(
            error,
            'CREATE_RESTAURANT_MUTATION',
            'Create restaurant mutation',
          );
        }
      },
    });
  },
});
