db = db.getSiblingDB('main');
db.createUser({
  user: 'rootMain',
  pwd: 'root1234',
  roles: [
    {
      role: 'readWrite',
      db: 'main',
    },
    {
      role: 'dbAdmin',
      db: 'main',
    },
  ],
});

db.createCollection("initCollection");
