const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/user',
    createProxyMiddleware({
      target: 'http://localhost:8060',
      changeOrigin: true,
    })
  );

  app.use(
    '/mvp',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );

  // Add direct proxy for googleSecurity endpoints
  app.use(
    '/googleSecurity',
    createProxyMiddleware({
      target: 'http://localhost:8060',
      changeOrigin: true,
    })
  );

  app.use(
    '/googleSecurityHeader',
    createProxyMiddleware({
      target: 'http://localhost:8060',
      changeOrigin: true,
    })
  );

  // Keep the old paths for backward compatibility
  app.use(
    '/api/user',
    createProxyMiddleware({
      target: 'http://localhost:8060',
      pathRewrite: { '^/api/user': '' },
      changeOrigin: true,
    })
  );

  app.use(
    '/api/mvp',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      pathRewrite: { '^/api/mvp': '' },
      changeOrigin: true,
    })
  );

  // Add a catch-all proxy for other /api paths (like /api/googleSecurity)
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8060',
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    })
  );
};
