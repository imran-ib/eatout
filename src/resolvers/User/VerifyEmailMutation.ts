import {ErrorString, MyError} from '../../utils/error';
import {extendType, nonNull, stringArg} from 'nexus';

import {Context} from '../../context';

export const VerifyEmail = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('VerifyEmail', {
      type: 'Boolean',
      args: {code: nonNull(stringArg())},
      //@ts-ignore
      resolve: async (_, {code}, ctx: Context) => {
        try {
          const Code = await ctx.prisma.verifyEmail.findFirst({
            where: {code},
            select: {id: true, code: true, userId: true},
          });

          if (!Code) {
            throw Error(ErrorString.VerificationCodeNotFound);
          }

          await ctx.prisma.user.update({
            where: {
              id: Code.userId,
            },
            data: {
              IsVerified: true,
            },
            select: {id: true},
          });

          await ctx.prisma.verifyEmail.delete({
            where: {id: Code.id},
            select: {id: true},
          });

          return true;
        } catch (error) {
          return MyError(
            error,
            'UNABLE_TO_VERIFY_USER_EMAIL',
            'User Email Verify Mutation',
          );
        }
      },
    });
  },
});
