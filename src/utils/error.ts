import {ApolloError} from 'apollo-server-core';

export const ErrorString = {
  UserNotExists: 'User does not exists',
  UserAlreadyExists: 'User with this email address already exists',
  UserNotSignedIn: 'User is not signed in',
  PasswordIncorrect: 'Password is not correct',
  EmailForUserExists: 'Email for current user is already signed up.',
  EmailSentFailed: 'Email sent failed',
  EmailNotValid: 'Not a valid email address',
  EmailIsRequired: 'Email Address is required',
  PasswordIsRequired: 'Password Address is required',
  PasswordMinLength: 'Password must be at least 4 characters long',
  PasswordMaxLength: 'Password must not be more then 20 characters long',
  UrlNotValid: 'Url is not a valid url. It should start with http.',
  FirstLastNotSupported: 'Passing both `first` and `last` is not supported.',
  VerificationCodeNotFound: 'Verification code not found, please try again ',
};

export const ErrorEmailNotVerified = (message: string): ApolloError =>
  new ApolloError(message, 'EMAIL_NOT_VERIFIED', {
    parameter: 'verified',
  });

export const ErrorPasswordIncorrect = (message: string): ApolloError =>
  new ApolloError(message, 'PASSWORD_NOT_CORRECT', {
    parameter: 'password',
  });

export const ErrorEmailSentFailed = (message: string): ApolloError =>
  new ApolloError(message, 'EMAIL_SENT_FAILED', {
    parameter: 'email',
  });

export const ErrorEmailNotValid = (message: string): ApolloError =>
  new ApolloError(message, 'EMAIL_VALIDATION', {
    parameter: 'email',
  });

export const ErrorEmailForUserExists = (message: string): ApolloError =>
  new ApolloError(message, 'EMAIL_FOR_USER_EXISTS', {
    parameter: 'email',
  });
export const ErrorForUserNotExists = (message: string): ApolloError =>
  new ApolloError(message, 'USER_NOT_EXISTS', {
    parameter: 'email',
  });

export const MyError = (error, code, extension): ApolloError =>
  new ApolloError(typeof error === 'object' && error?.message, code, {
    myCustomExtensions: extension,
  });
