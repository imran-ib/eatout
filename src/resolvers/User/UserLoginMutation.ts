import {ErrorForUserNotExists, ErrorString, MyError} from '../../utils/error';
import {GenerateToken, validateCredential} from '../../utils/auth';
import {extendType, nonNull, stringArg} from 'nexus';

import {Context} from '../../context';
import {assert} from '../../utils/assert';

export const UserLogin = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('UserLogin', {
      type: 'AuthPayload',
      args: {email: nonNull(stringArg()), password: nonNull(stringArg())},
      validate: async ({string}) => ({
        email: string()
          .email(ErrorString.EmailNotValid)
          .required(ErrorString.EmailIsRequired),
        password: string().required(ErrorString.PasswordIsRequired),
      }),
      //@ts-ignore
      resolve: async (_, {email, password}, ctx: Context) => {
        try {
          const User = await ctx.prisma.user.findFirst({
            where: {
              email,
            },
            select: {id: true, password: true},
          });

          if (!User) {
            return ErrorForUserNotExists(ErrorString.UserNotExists);
          }

          const isCorrect = await validateCredential(password, User.password);

          assert(isCorrect, ErrorString.PasswordIncorrect);

          const token = GenerateToken(User.id);

          return {
            token,
            User,
          };
        } catch (error) {
          return MyError(error, 'UNABLE_TO_LOGIN', 'User Login Mutation');
        }
      },
    });
  },
});
