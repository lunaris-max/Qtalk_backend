// Root
const usersRoot = 'users';
const usersAuth = 'auth';

// Api Versions
const v1 = 'v1';

export const routesV1 = {
  version: v1,
  user: {
    root: usersRoot,
    delete: `/${usersRoot}/:id`,
    findOne: `/${usersRoot}/:id`,
    update: `/${usersRoot}/:id`,
  },
  auth: {
    root: usersAuth,
    delete: `/${usersAuth}/:id`,
    findOne: `/${usersAuth}/:id`,
    update: `/${usersAuth}/:id`,
    google: `/${usersAuth}/google`,
    github: `/${usersAuth}/github`,
    facebook: `/${usersAuth}/facebook`,
  },
};
