import {ErrorEmailForUserExists, ErrorString, MyError} from '../../utils/error';
import {arg, extendType, nonNull, nullable, stringArg} from 'nexus';

import {Context} from '../../context';
import {RoleInput} from './InputTypes';
import {encryptCredential} from '../../utils/auth';
import {randomUUID} from 'crypto';
import {sendVerificationEmail} from '../../utils/Mail';

export const createUser = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('CreateUser', {
      type: 'User',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        name: stringArg(),
        role: nullable(arg({type: RoleInput})),
      },
      validate: async ({string}) => ({
        email: string()
          .email(ErrorString.EmailNotValid)
          .required(ErrorString.EmailIsRequired),
        password: string()
          .min(4, ErrorString.PasswordMinLength)
          .max(20, ErrorString.PasswordMaxLength)
          .required(ErrorString.PasswordIsRequired),
      }),
      //@ts-ignore
      resolve: async (_, {email, password, name, role}, ctx: Context) => {
        try {
          const ROLE = role && role.role;
          const UserExists = await ctx.prisma.user.findFirst({
            where: {email},
            select: {email: true},
          });

          if (UserExists) {
            return ErrorEmailForUserExists(ErrorString.UserAlreadyExists);
          }

          const Hash = await encryptCredential(password);

          const NewUser = await ctx.prisma.user.create({
            data: {
              email,
              password: Hash,
              name,
              role: ROLE ? ROLE : undefined,
            },
          });

          const Code = await ctx.prisma.verifyEmail.create({
            data: {
              code: randomUUID(),
              user: {
                connect: {email},
              },
            },
          });

          await sendVerificationEmail(email, Code.code);

          return NewUser;
        } catch (error) {
          return MyError(
            error,
            'UNABLE_TO_CREATE_USER',
            'User Create Mutation',
          );
        }
      },
    });
  },
});
