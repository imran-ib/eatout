import {objectType} from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.string('email');
    t.string('name');
    t.boolean('IsVerified');
    t.date('createdAt');
    t.date('updatedAt');
    t.date('deletedAt');
    t.field('role', {type: 'Role'});

    // t.field('profile', {type: 'Profile'});
    // t.field('posts', {type: list('Post')});
  },
});
