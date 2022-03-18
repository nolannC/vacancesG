module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'eaaedcc02bc8935860c25cd33b5f2db4'),
  },
});
