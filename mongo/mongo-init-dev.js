db.auth('dev', 'dev_password')

db.createUser({
  user: 'tryout_dev',
  pwd: 'dev_password',
  roles: [
    {
      role: 'readWrite',
      db: 'tryout_db',
    },
  ],
});