// Root
const usersRoot = 'users';
const authRoot = 'auth';
const mailRoot = 'mail';

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
    root: authRoot,
    delete: `/${authRoot}/:id`,
    findOne: `/${authRoot}/:id`,
    update: `/${authRoot}/:id`,
    google: `/${authRoot}/google`,
    github: `/${authRoot}/github`,
    facebook: `/${authRoot}/facebook`,
  },
  mail: {
    confirm: `/${mailRoot}/confirm`,
    sendConfirm: `/${mailRoot}/sendConfirm`,
    resetPasswordSend: 'reset-password/send',
    resetPasswordConfirm: 'reset-password/confirm',
  },
};
