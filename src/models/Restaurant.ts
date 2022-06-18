import {objectType} from 'nexus';

export const Restaurant = objectType({
  name: 'Restaurant',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('coverImage');
    t.string('address');
    t.date('createdAt');
    t.date('updatedAt');
    t.date('deletedAt');
    t.field('owner', {type: 'User'});
    t.field('category', {type: 'Category'});
  },
});
