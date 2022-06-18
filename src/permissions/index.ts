import {and, rule, shield} from 'graphql-shield';

const rules = {
  isAuthenticatedUser: rule()((_, __, {userId}) => {
    return Boolean(userId);
  }),
  isOwner: rule()(async (_, __, {userId, prisma}) => {
    const user = await prisma.user.findFirst({
      where: {
        AND: [
          {
            role: 'OWNER',
          },
          {id: userId},
        ],
      },
      select: {role: true},
    });

    const Owner = Boolean(user);
    if (Owner === false) {
      return new Error('Only Owners are Allowed to create/modify restaurants');
    }

    return Owner;
  }),
  isClient: rule()(async (_, __, {userId, prisma}) => {
    const user = await prisma.user.findFirst({
      where: {
        AND: [
          {
            role: 'CLIENT',
          },
          {id: userId},
        ],
      },
      select: {role: true},
    });

    const Client = Boolean(user);
    if (Client === false) {
      return new Error('Only Clients are Allowed to create/modify orders');
    }

    return Client;
  }),
};

export const permissions = shield(
  {
    Query: {},
    Mutation: {
      CreateRestaurant: rules.isAuthenticatedUser,
      DeleteRestaurant: and(rules.isAuthenticatedUser, rules.isOwner),
    },
  },
  {
    allowExternalErrors: process.env.NODE_ENV !== 'production',
  },
);
