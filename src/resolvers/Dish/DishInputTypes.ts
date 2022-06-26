import {inputObjectType} from 'nexus';

export const CreateDishInput = inputObjectType({
  name: 'CreateDishInput',
  definition(t) {
    t.nonNull.id('RestaurantId');
    t.nonNull.string('name');
    t.nullable.string('photo');
    t.nullable.string('description');
    t.nonNull.int('price');
    t.list.string('flavour');
    t.nullable.int('extraPrice', {default: 0});
    t.list.string('extraItems');
    t.field('size', {type: 'DishSize'});
    t.field('spiceLevel', {type: 'SpiceLevel'});
    t.list.field('OtherChoices', {type: 'JSONObject'});
  },
});
