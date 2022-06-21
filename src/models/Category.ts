import {Context} from '../context';
import {objectType} from 'nexus';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('coverImage');
    t.string('Slug');
    t.date('createdAt');
    t.list.field('Restaurant', {type: 'Restaurant'});
    t.field('RestaurantCount', {
      type: 'PageCountInput',
      resolve: async (parent, _, ctx: Context) => {
        const res = await ctx.prisma.restaurant.count({
          where: {
            //@ts-ignore
            id: parent.Restaurant.id,
          },
        });

        const TotalPageCount = Math.ceil(res / 25);

        return {
          TotalCount: res,
          PageCount: TotalPageCount,
        };
      },
    });
  },
});
