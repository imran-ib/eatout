import {arg, extendType, nonNull} from 'nexus';

import {Context} from '../../context';
import {CreateDishInput} from './DishInputTypes';
import {MyError} from '../../utils/error';
import {assert} from '../../utils/assert';

export const CreateDish = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('CreateDish', {
      type: 'Dish',
      args: {
        data: nonNull(
          arg({
            type: CreateDishInput,
          }),
        ),
      },
      resolve: async (
        _,
        {
          data: {
            RestaurantId,
            name,
            photo,
            description,
            price,
            flavour,
            extraPrice = 0,
            extraItems,
            size,
            spiceLevel,
            OtherChoices,
          },
        },
        ctx: Context,
      ) => {
        try {
          assert(ctx.userId, 'Not Authorized');

          const Restaurant = await ctx.prisma.restaurant.findFirst({
            where: {id: RestaurantId},
            select: {id: true, ownerId: true},
          });

          if (!Restaurant) {
            throw Error(`Restaurant Not Found`);
          }

          if (ctx.userId !== Restaurant.ownerId) {
            throw Error('You Are Not Allowed To Do this Operation');
          }

          const Dish = await ctx.prisma.dish.create({
            data: {
              name,
              photo,
              price,
              description: description ? description : undefined,
              Restaurant: {
                connect: {
                  id: RestaurantId,
                },
              },
              options: {
                create: {
                  name: `${name}Options`,
                  extraPrice: extraPrice ? extraPrice : undefined,
                  extraItems: extraItems ? extraItems : undefined,
                  flavour: flavour ? flavour : undefined,
                  OtherChoices: OtherChoices ? OtherChoices : undefined,
                  size: size ? size : undefined,
                  spiceLevel: spiceLevel ? spiceLevel : undefined,
                },
              },
            },
          });

          return Dish;
        } catch (error) {
          return MyError(
            error,
            'CREATE_DISH_MUTATION',
            'Unable To Create Dish',
          );
        }
      },
    });
  },
});
