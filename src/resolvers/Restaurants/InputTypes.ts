import {inputObjectType} from 'nexus';

export const CreateRestaurantInput = inputObjectType({
  name: 'CreateRestaurantInput',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.string('address');
    t.string('coverImage');
    t.nonNull.string('category');
  },
});
