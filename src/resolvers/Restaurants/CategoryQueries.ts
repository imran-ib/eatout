import {extendType, intArg, nonNull, stringArg} from 'nexus';

import {Context} from '../../context';
import {MyError} from '../../utils/error';

export const GetAllCategories = extendType({
  type: 'Query',
  definition(t) {
    t.list.nullable.field('GetAllCategories', {
      type: 'Category',
      //@ts-ignore
      resolve: async (_, __, ctx: Context) => {
        try {
          return ctx.prisma.category
            .findMany
            //   {
            //   include: {
            //     Restaurant: true,
            //     _count: true,
            //   },
            // }
            ();
        } catch (error) {
          return MyError(
            error,
            'GET_ALL_CATEGORIES_QUERY',
            'Unable To Get Categories',
          );
        }
      },
    });
  },
});

export const GetCategory = extendType({
  type: 'Query',
  definition(t) {
    t.list.nullable.field('GetCategory', {
      type: 'Category',
      args: {
        slug: nonNull(stringArg()),
        page: nonNull(intArg({default: 1})),
      },
      //@ts-ignore
      resolve: async (_, {slug, page}, ctx: Context) => {
        try {
          const res = await ctx.prisma.category.findMany({
            where: {Slug: slug},
            include: {
              Restaurant: {
                take: 2,
                skip: (page - 1) * 2,
              },
            },
          });

          return res;
        } catch (error) {
          return MyError(error, 'GET_CATEGORY_QUERY', 'Unable To Get Category');
        }
      },
    });
  },
});
