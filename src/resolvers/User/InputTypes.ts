import {inputObjectType} from 'nexus';

export const RoleInput = inputObjectType({
  name: 'RoleInput',
  definition(t) {
    t.nullable.field('role', {type: 'Role'});
  },
});

export const UpdateUserProfile = inputObjectType({
  name: 'UpdateUserProfile',
  definition(t) {
    t.nonNull.string('id');
    t.nullable.string('email');
    t.nullable.string('password');
  },
});
