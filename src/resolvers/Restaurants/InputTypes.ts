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
export const EditRestaurantInput = inputObjectType({
  name: 'EditRestaurantInput',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('address');
    t.string('coverImage');
    t.nonNull.string('category');
  },
});
