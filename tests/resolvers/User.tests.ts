/* eslint-disable jest/valid-expect */

import {CreateUser, UpdateProfile, UserLogin, VerifyEmail} from './queries';

import {ErrorString} from '../../src/utils/error';
import {GenerateToken} from '../../src/utils/auth';
import {GetSingleUser} from '../../src/resolvers';
import {GraphQLClient} from 'graphql-request';
import {PrismaClient} from '@prisma/client';
import {getTestUtils} from '../testUtils';
import {testHost} from '../testSetup';

export const USER = {
  name: 'Imran',
  email: 'Imran@Irshad.com',
  password: '1213456',
  role: {role: 'CLIENT'},
};

export function user(): void {
  describe('USER -Unit', () => {
    let graphqlClient: GraphQLClient;
    let prisma: PrismaClient;
    let setAuthToken: (token: string) => void;

    beforeEach(async () => {
      graphqlClient = new GraphQLClient(testHost);
      prisma = getTestUtils().prisma;
      setAuthToken = getTestUtils().setAuthToken;
    });

    describe('CREATE_USER ', () => {
      let ExistingUser;
      beforeEach(async () => {
        ExistingUser = await prisma.user.findFirst({
          where: {email: USER.email},
          include: {code: true},
        });
      });

      it('Should Fail if Invalid Email is provided', async () => {
        try {
          expect.assertions(1);
          await graphqlClient.request(CreateUser, {
            email: 'inavlideamil.com',
            password: USER.password,
          });
        } catch (error) {
          //@ts-ignore
          expect(error?.message).toContain(ErrorString.EmailNotValid);
        }
      });

      it('Should Create A New User', async () => {
        const res = await graphqlClient.request(CreateUser, USER);

        expect(res.CreateUser).toHaveProperty('email');
        expect(res.CreateUser).toHaveProperty('name');
        expect(res.CreateUser).toHaveProperty('id');
        expect(res.CreateUser.name).toEqual(USER.name);
        expect(res.CreateUser.email).toEqual(USER.email);
        expect(res.CreateUser.password).not.toBeDefined();
        expect(USER.password.length).toBeGreaterThan(4);
        expect(USER.password.length).toBeLessThan(20);
      });

      it('it should verify that user is created and password is hashed ', () => {
        expect(ExistingUser).toBeDefined();
        expect(ExistingUser.password).not.toEqual(USER.password);
        expect(ExistingUser.password.length).toBeGreaterThan(
          USER.password.length,
        );
      });

      it('should verify that verification code is created', () => {
        expect(ExistingUser.code).toBeDefined();
        expect(typeof ExistingUser.code).toBe('object');
        expect(typeof ExistingUser.code.code).toBe('string');
      });

      it('it Should fail if user already Exists', async () => {
        expect(
          async () => await graphqlClient.request(CreateUser, USER),
        ).rejects.toThrow();
      });
    });

    describe('LOGIN_USER', () => {
      it('Should Fail if Invalid Email is provided', async () => {
        try {
          expect.assertions(1);

          const response = await graphqlClient.request(UserLogin, {
            email: 'inavlideamil.com',
            password: USER.password,
          });
        } catch (error) {
          //@ts-ignore
          expect(error.message).toContain(ErrorString.EmailNotValid);
        }
      });

      it('Should Fail if User does not exist', async () => {
        try {
          expect.assertions(2);
          await graphqlClient.request(UserLogin, {
            email: 'wrong@eamil.com',
            password: USER.password,
          });
        } catch (error) {
          //@ts-ignore
          expect(error.message).toContain(ErrorString.UserNotExists);
        }
      });

      it('Should Fail if Password is incorrect', async () => {
        try {
          expect.assertions(1);
          await graphqlClient.request(UserLogin, {
            email: USER.email,
            password: 'wrongPassword',
          });
        } catch (error) {
          //@ts-ignore
          expect(error.message).toContain(ErrorString.PasswordIncorrect);
        }
      });

      it('Should Test Utility function GenerateToken', () => {
        const MockedToken = jest.fn(GenerateToken);
        const token = MockedToken('SomeID');

        expect(MockedToken).toHaveBeenCalledTimes(1);
        expect(MockedToken).toHaveBeenCalledWith(expect.any(String));
        expect(typeof token).toBe('string');
        expect(token).toContain('.');
      });

      it('Should Verify User Login Mutation Response', async () => {
        const Response = await graphqlClient.request(UserLogin, {
          email: USER.email,
          password: USER.password,
        });

        expect(Response).toHaveProperty('UserLogin');
        expect(Response.UserLogin).toHaveProperty('token');
        expect(typeof Response.UserLogin.token).toBe('string');
        expect(typeof Response.UserLogin.User).toBe('object');

        //   //! GQL client is replaced with authenticated one.
        const token = Response.UserLogin.token;
        graphqlClient.setHeader('Authorization', `${token}`);
      });
    });

    describe('EDIT_PROFILE', () => {
      let NotUpdatedUser;

      beforeEach(async () => {
        NotUpdatedUser = await prisma.user.findFirst({
          where: {email: USER.email},
        });
      });

      afterEach(async () => {
        await graphqlClient.request(UpdateProfile, {
          updateProfileId: NotUpdatedUser.id,
          email: USER.email,
          password: USER.password,
        });
      });

      const UpdateUserArgs = {
        email: 'Updated@email.com',
        password: 'NewPasswors',
      };

      it('Should Update User Email if no Password is Provided', async () => {
        const id = NotUpdatedUser.id;
        const UpdatedUser = await graphqlClient.request(UpdateProfile, {
          updateProfileId: id,
          email: UpdateUserArgs.email,
        });

        expect(UpdatedUser).toHaveProperty('UpdateProfile');
        expect(UpdatedUser.UpdateProfile).toHaveProperty('email');
        expect(UpdatedUser.UpdateProfile.email).toEqual(UpdateUserArgs.email);
      });

      it('Should Update User Password if Email is Provided', async () => {
        const id = NotUpdatedUser.id;
        const UpdatedUser = await graphqlClient.request(UpdateProfile, {
          updateProfileId: id,
          password: UpdateUserArgs.password,
        });

        expect(UpdatedUser).toHaveProperty('UpdateProfile');
      });

      it('Should Update email and Password ', async () => {
        const id = NotUpdatedUser.id;
        const UpdatedUser = await graphqlClient.request(UpdateProfile, {
          updateProfileId: id,
          email: UpdateUserArgs.email,
          password: 'NewPassword',
        });

        expect(UpdatedUser).toHaveProperty('UpdateProfile');
      });
    });

    describe('VERIFY EMAIL', () => {
      let code;
      let OneUser;

      beforeEach(async () => {
        OneUser = await prisma.user.findFirst({
          where: {email: USER.email},
          select: {code: true, id: true},
        });
        code = OneUser?.code.code;
      });

      it('should fail if code is wrong/NotFound', async () => {
        try {
          await graphqlClient.request(VerifyEmail, {code: 'Wrong-Code'});
        } catch (error) {
          //@ts-ignore
          expect(error.message).toContain(ErrorString.VerificationCodeNotFound);
        }
      });

      it('should Update the user isVerified to true', async () => {
        const User = await prisma.user.update({
          where: {id: OneUser.id},
          data: {
            IsVerified: true,
          },
          select: {id: true, email: true},
        });

        expect(User).toHaveProperty('id');
        expect(User).toHaveProperty('email');
      });

      it('should Delete The Verification code', async () => {
        const res = await prisma.verifyEmail.delete({where: {code}});
        expect(res).toHaveProperty('userId');
        expect(res).toHaveProperty('code');
      });
    });
  });
}
