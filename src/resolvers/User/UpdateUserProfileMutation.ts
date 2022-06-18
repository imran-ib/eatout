import {ErrorString, MyError} from '../../utils/error';
import {arg, extendType, nonNull, nullable, stringArg} from 'nexus';

import {Context} from '../../context';
import {RoleInput} from './InputTypes';
import {encryptCredential} from '../../utils/auth';
import {randomUUID} from 'crypto';
import {sendVerificationEmail} from '../../utils/Mail';

export const UpdateProfile = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('UpdateProfile', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
        email: nullable(stringArg()),
        password: nullable(stringArg()),
        name: nullable(stringArg()),
        role: nullable(arg({type: RoleInput})),
      },
      validate: async ({string}) => ({
        email: string().email(ErrorString.EmailNotValid),

        password: string()
          .min(4, ErrorString.PasswordMinLength)
          .max(20, ErrorString.PasswordMaxLength),
      }),
      //@ts-ignore
      resolve: async (_, {id, email, password, name, role}, ctx: Context) => {
        try {
          //1) Get the user
          const user = await ctx.prisma.user.findFirst({
            where: {id},
            select: {code: true},
          });

          if (!user) {
            throw new Error('User not found');
          }
          //2) if there is no password and user is trying to update email change the email and send code

          if (password === undefined && email) {
            const UpdatedUser = await ctx.prisma.user.update({
              where: {id},
              data: {
                email,
                name: name ? name : undefined,
                IsVerified: false,
                ...(user?.code && {
                  code: {
                    delete: true,
                  },
                }),
              },
              select: {id: true},
            });

            const userCode = await ctx.prisma.verifyEmail.create({
              data: {
                code: randomUUID(),
                user: {
                  connect: {id: UpdatedUser.id},
                },
              },
              select: {code: true},
            });
            await sendVerificationEmail(email, userCode.code);
            //3) if use is trying to update both email and password then uodate both and send code
          } else if (email && password) {
            const hash = await encryptCredential(password);

            const UpdatedUser = await ctx.prisma.user.update({
              where: {id},
              data: {
                email,
                password: hash,
                name: name ? name : undefined,
                IsVerified: false,
                ...(user?.code && {
                  code: {
                    delete: true,
                  },
                }),
              },
              select: {id: true},
            });

            const userCode = await ctx.prisma.verifyEmail.create({
              data: {
                code: randomUUID(),
                user: {
                  connect: {id: UpdatedUser.id},
                },
              },
              select: {code: true},
            });
            await sendVerificationEmail(email, userCode?.code);
          } else if (email === undefined && password) {
            const hash = await encryptCredential(password);
            await ctx.prisma.user.update({
              where: {id},
              data: {
                password: hash,
              },
              select: {id: true},
            });
          }
          // 4) if use is trying to to update password update password

          return ctx.prisma.user.findFirst({where: {id}});
        } catch (error) {
          return MyError(
            error,
            'UPDATE_PROFILE',
            'user update profile mutation',
          );
        }
      },
    });
  },
});
