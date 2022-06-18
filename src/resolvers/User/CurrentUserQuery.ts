import {assert} from '../../utils/assert';
import {queryField} from 'nexus';

export const CurrentUser = queryField('CurrentUser', {
  type: 'User',
  resolve: (_, __, {prisma, userId}) => {
    assert(userId, 'Not authorized');

    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  },
});
