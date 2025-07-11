// const { createProxyMiddleware } = require('http-proxy-middleware');
// const path = require('path');
// const fs = require('fs');
//
// // Note: We can't access localStorage directly in the Node.js context of the proxy
// // The token will be passed via request headers or cookies from the browser
//
// // Helper function to determine MIME type based on file extension
// function getMimeType(filePath) {
//   const ext = path.extname(filePath).toLowerCase();
//   const mimeTypes = {
//     '.html': 'text/html',
//     '.js': 'text/javascript',
//     '.css': 'text/css',
//     '.json': 'application/json',
//     '.png': 'image/png',
//     '.jpg': 'image/jpeg',
//     '.jpeg': 'image/jpeg',
//     '.gif': 'image/gif',
//     '.svg': 'image/svg+xml',
//     '.ico': 'image/x-icon',
//     '.webp': 'image/webp',
//     '.woff': 'font/woff',
//     '.woff2': 'font/woff2',
//     '.ttf': 'font/ttf',
//     '.eot': 'application/vnd.ms-fontobject',
//     '.otf': 'font/otf',
//     '.pdf': 'application/pdf',
//     '.txt': 'text/plain'
//   };
//
//   return mimeTypes[ext] || 'application/octet-stream';
// }
//
// module.exports = function(app) {
//   // Modified proxy for static assets that checks if the file exists in the public folder first
//   app.use(
//     '/assets',
//     (req, res, next) => {
//       // Check if the requested asset exists in the public folder
//       // Use path.resolve to get an absolute path with correct OS-specific separators
//       const publicPath = path.resolve(__dirname, '../public', req.url.replace(/^\//, ''));
//
//       console.log('Checking for asset at path:', publicPath);
//
//       // Check if this is a public asset type that should be accessible without authentication
//       const ext = path.extname(req.url).toLowerCase();
//       const publicAssetTypes = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.css', '.js', '.woff', '.woff2', '.ttf', '.eot', '.otf', '.json'];
//       const isPublicAssetType = publicAssetTypes.includes(ext);
//
//       // If the file exists in the public folder, let the static middleware handle it
//       if (fs.existsSync(publicPath)) {
//         console.log('Serving local asset:', publicPath);
//
//         // For public asset types like images, we'll serve them directly instead of using next()
//         // This ensures they're always served without authentication requirements
//         if (isPublicAssetType) {
//           console.log('Serving public asset type directly:', ext);
//           const stat = fs.statSync(publicPath);
//           const fileStream = fs.createReadStream(publicPath);
//
//           // Set appropriate headers
//           res.writeHead(200, {
//             'Content-Type': getMimeType(publicPath),
//             'Content-Length': stat.size
//           });
//
//           // Pipe the file to the response
//           fileStream.pipe(res);
//           return;
//         }
//
//         next();
//       } else {
//         // If not found locally, try to proxy to the backend
//         console.log('Asset not found locally, proxying to backend:', req.url);
//         createProxyMiddleware({
//           target: 'http://localhost:8060',
//           changeOrigin: true,
//           secure: false,
//           onProxyReq: (proxyReq, req, res) => {
//             console.log('Assets proxy handling request:', req.method, req.url);
//             console.log('Full target URL:', 'http://localhost:8060' + req.url);
//
//             // Add Authorization header if token exists in the original request
//             const authHeader = req.headers.authorization;
//             if (authHeader) {
//               proxyReq.setHeader('Authorization', authHeader);
//               console.log('Using Authorization header from original request');
//             }
//             // If the request doesn't have an Authorization header, try to get it from cookies
//             else if (req.headers.cookie) {
//               const cookies = req.headers.cookie.split(';').map(cookie => cookie.trim());
//
//               // Try to find Authorization cookie (with or without Bearer prefix)
//               const authCookie = cookies.find(cookie => cookie.startsWith('Authorization='));
//               if (authCookie) {
//                 const token = authCookie.split('=')[1];
//                 // Check if token already has Bearer prefix
//                 if (token.startsWith('Bearer ')) {
//                   proxyReq.setHeader('Authorization', token);
//                 } else {
//                   proxyReq.setHeader('Authorization', `Bearer ${token}`);
//                 }
//                 console.log('Using Authorization from cookie');
//               }
//
//               // Also check for access_token cookie as an alternative
//               else {
//                 const accessTokenCookie = cookies.find(cookie => cookie.startsWith('access_token='));
//                 if (accessTokenCookie) {
//                   const token = accessTokenCookie.split('=')[1];
//                   proxyReq.setHeader('Authorization', `Bearer ${token}`);
//                   console.log('Using access_token from cookie');
//                 } else {
//                   console.log('No authorization token found in cookies');
//                 }
//               }
//             } else {
//               console.log('No authorization header or cookies found');
//             }
//           },
//           onProxyRes: (proxyRes, req, res) => {
//             console.log('Assets proxy response status:', proxyRes.statusCode);
//
//             // Handle 401 Unauthorized responses
//             if (proxyRes.statusCode === 401) {
//               console.log('Received 401 Unauthorized response from backend for asset:', req.url);
//
//               // For public assets, we want to serve them without authentication
//               // Check if the requested asset is a public asset type
//               const ext = path.extname(req.url).toLowerCase();
//               const publicAssetTypes = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.css', '.js', '.woff', '.woff2', '.ttf', '.eot', '.otf', '.json'];
//
//               if (publicAssetTypes.includes(ext)) {
//                 // Special handling for i18n JSON files
//                 if (ext === '.json' && req.url.includes('/i18n/')) {
//                   console.log('Handling i18n JSON file:', req.url);
//                   // Construct the path to the local i18n file
//                   const publicPath = path.resolve(__dirname, '../public', req.url.replace(/^\//, ''));
//
//                   if (fs.existsSync(publicPath)) {
//                     console.log('Found local i18n file to serve instead of 401:', publicPath);
//
//                     // Abort the current response
//                     proxyRes.destroy();
//
//                     // Serve the local file instead
//                     const stat = fs.statSync(publicPath);
//                     const fileStream = fs.createReadStream(publicPath);
//
//                     // Set appropriate headers
//                     res.writeHead(200, {
//                       'Content-Type': 'application/json',
//                       'Content-Length': stat.size
//                     });
//
//                     // Pipe the file to the response
//                     fileStream.pipe(res);
//                     console.log('Serving local i18n file instead of 401 response');
//                     return;
//                   } else {
//                     console.log('Local i18n file not found:', publicPath);
//                   }
//                 }
//
//                 // Check if we have this asset locally in the public folder
//                 const publicPath = path.resolve(__dirname, '../public', req.url.replace(/^\//, ''));
//
//                 if (fs.existsSync(publicPath)) {
//                   console.log('Found local public asset to serve instead of 401:', publicPath);
//
//                   // Abort the current response
//                   proxyRes.destroy();
//
//                   // Serve the local file instead
//                   const stat = fs.statSync(publicPath);
//                   const fileStream = fs.createReadStream(publicPath);
//
//                   // Set appropriate headers
//                   res.writeHead(200, {
//                     'Content-Type': getMimeType(publicPath),
//                     'Content-Length': stat.size
//                   });
//
//                   // Pipe the file to the response
//                   fileStream.pipe(res);
//                   console.log('Serving local public asset instead of 401 response');
//                   return;
//                 }
//               }
//
//               // If we get here, either it's not a public asset type or we don't have it locally
//               console.log('No local public asset found for unauthorized request');
//               // We'll let the proxy response continue with the 401 status
//             }
//           },
//           onError: (err, req, res) => {
//             console.error('Assets proxy error:', err);
//             // Provide a fallback for missing assets
//             if (err.code === 'ECONNREFUSED') {
//               console.log('Falling back to local assets');
//               res.statusCode = 404;
//               res.end();
//             }
//           }
//         })(req, res, next);
//       }
//     }
//   );
//   // Add a catch-all proxy for all requests to ensure they're properly handled
//   app.use(
//     '/',
//     createProxyMiddleware(function(pathname, req) {
//       // Only proxy requests that start with /googleSecurity or /googleSecurityHeader
//       // and are not yet handled by more specific proxies
//       const shouldProxy = RegExp(/^\/(googleSecurity|googleSecurityHeader)/).exec(pathname);
//       if (shouldProxy) {
//         console.log('Root path proxy intercepted:', req.method, pathname);
//       }
//       return shouldProxy;
//     }, {
//       target: 'http://localhost:8060',
//       changeOrigin: true,
//       secure: false,
//       onProxyReq: (proxyReq, req, res) => {
//         console.log('Catch-all proxy handling request:', req.method, req.url, 'to target:', 'http://localhost:8060' + req.url);
//
//         // Log headers for debugging
//         console.log('Request headers:', JSON.stringify(req.headers, null, 2));
//       },
//       onProxyRes: (proxyRes, req, res) => {
//         console.log('Proxy response status:', proxyRes.statusCode);
//       },
//       onError: (err, req, res) => {
//         console.error('Catch-all proxy error:', err);
//         // Provide a fallback for connection refused errors
//         if (err.code === 'ECONNREFUSED') {
//           console.log('Connection refused for root path proxy');
//           res.statusCode = 503;
//           res.end(JSON.stringify({ error: 'Service unavailable', message: 'Could not connect to backend service' }));
//         }
//       }
//     })
//   );
//   app.use(
//     '/user',
//     createProxyMiddleware({
//       target: 'http://localhost:8060',
//       changeOrigin: true,
//     })
//   );
//
//   app.use(
//     '/mvp',
//     createProxyMiddleware({
//       target: 'http://localhost:8080',
//       changeOrigin: true,
//     })
//   );
//
//   // Add a proxy for eco-news endpoints
//   app.use(
//     '/eco-news',
//     createProxyMiddleware({
//       target: 'http://localhost:8080',
//       changeOrigin: true,
//       secure: false,
//       pathRewrite: { '^/eco-news': '/econews' }, // Rewrite path to match backend controller path
//       onProxyReq: (proxyReq, req, res) => {
//         // Log the original URL and the URL after rewriting
//         console.log('eco-news proxy handling request:', req.method, req.url);
//         console.log('Original URL:', req.originalUrl);
//         console.log('Full target URL:', 'http://localhost:8080/econews' + req.url.replace(/^\/eco-news/, ''));
//
//         // Log headers for debugging
//         console.log('Request headers:', JSON.stringify(req.headers, null, 2));
//
//         // Ensure the content-type is set correctly for POST requests
//         if (req.method === 'POST' && req.body) {
//           console.log('Request body:', JSON.stringify(req.body, null, 2));
//           if (!proxyReq.getHeader('content-type')) {
//             proxyReq.setHeader('content-type', 'application/json');
//           }
//         }
//       },
//       onProxyRes: (proxyRes, req, res) => {
//         console.log('eco-news proxy response status:', proxyRes.statusCode);
//         console.log('Response headers:', JSON.stringify(proxyRes.headers, null, 2));
//       },
//       onError: (err, req, res) => {
//         console.error('eco-news proxy error:', err);
//         console.error('Error details:', err.stack);
//       }
//     })
//   );
//
//   // Add a direct proxy for /econews endpoints
//   app.use(
//     '/econews',
//     createProxyMiddleware({
//       target: 'http://localhost:8080',
//       changeOrigin: true,
//       secure: false,
//       pathRewrite: { '^/econews': '/econews' }, // Ensure no double path
//       onProxyReq: (proxyReq, req, res) => {
//         // Log the original URL
//         console.log('econews proxy handling request:', req.method, req.url);
//         console.log('Original URL:', req.originalUrl);
//         console.log('Full target URL:', 'http://localhost:8080/econews' + req.url.replace(/^\/econews/, ''));
//
//         // Log headers for debugging
//         console.log('Request headers:', JSON.stringify(req.headers, null, 2));
//
//         // Ensure the content-type is set correctly for POST requests
//         if (req.method === 'POST' && req.body) {
//           console.log('Request body:', JSON.stringify(req.body, null, 2));
//           if (!proxyReq.getHeader('content-type')) {
//             proxyReq.setHeader('content-type', 'application/json');
//           }
//         }
//       },
//       onProxyRes: (proxyRes, req, res) => {
//         console.log('econews proxy response status:', proxyRes.statusCode);
//         console.log('Response headers:', JSON.stringify(proxyRes.headers, null, 2));
//       },
//       onError: (err, req, res) => {
//         console.error('econews proxy error:', err);
//         console.error('Error details:', err.stack);
//         // Provide a fallback for connection errors
//         if (err.code === 'ECONNREFUSED') {
//           console.log('Connection refused for econews proxy');
//           res.statusCode = 503;
//           res.end(JSON.stringify({ error: 'Service unavailable', message: 'Could not connect to econews service' }));
//         }
//       }
//     })
//   );
//
//   // Add a proxy for ownSecurity endpoints
//   app.use(
//     '/ownSecurity',
//     createProxyMiddleware({
//       target: 'http://localhost:8060',
//       changeOrigin: true,
//     })
//   );
//
//   // Add a direct proxy for googleSecurity endpoints
//   app.use(
//     '/googleSecurity',
//     createProxyMiddleware({
//       target: 'http://localhost:8060',
//       changeOrigin: true,
//       secure: false,
//       // No pathRewrite needed as we want to keep the path as is
//       onProxyReq: (proxyReq, req, res) => {
//         console.log('googleSecurity proxy handling request:', req.method, req.url);
//         console.log('Full target URL:', 'http://localhost:8060' + req.url);
//
//         // Log request body if it's a POST request
//         if (req.method === 'POST' && req.body) {
//           console.log('Request body:', JSON.stringify(req.body, null, 2));
//         }
//
//         // Log request headers
//         console.log('Request headers:', JSON.stringify(req.headers, null, 2));
//       },
//       onProxyRes: (proxyRes, req, res) => {
//         console.log('googleSecurity proxy response status:', proxyRes.statusCode);
//         console.log('Response headers:', JSON.stringify(proxyRes.headers, null, 2));
//       },
//       onError: (err, req, res) => {
//         console.error('googleSecurity proxy error:', err);
//         // Provide a fallback for connection refused errors
//         if (err.code === 'ECONNREFUSED') {
//           console.log('Connection refused for googleSecurity proxy');
//           res.statusCode = 503;
//           res.end(JSON.stringify({ error: 'Service unavailable', message: 'Could not connect to authentication service' }));
//         }
//       }
//     })
//   );
//
//   app.use(
//     '/googleSecurityHeader',
//     createProxyMiddleware({
//       target: 'http://localhost:8060',
//       changeOrigin: true,
//       secure: false,
//       // No pathRewrite needed as we want to keep the path as is
//       onProxyReq: (proxyReq, req, res) => {
//         console.log('googleSecurityHeader proxy handling request:', req.method, req.url);
//         console.log('Full target URL:', 'http://localhost:8060' + req.url);
//
//         // Log the request body if it's a POST request
//         if (req.method === 'POST' && req.body) {
//           console.log('Request body:', JSON.stringify(req.body, null, 2));
//         }
//
//         // Log request headers
//         console.log('Request headers:', JSON.stringify(req.headers, null, 2));
//       },
//       onProxyRes: (proxyRes, req, res) => {
//         console.log('googleSecurityHeader proxy response status:', proxyRes.statusCode);
//         console.log('Response headers:', JSON.stringify(proxyRes.headers, null, 2));
//       },
//       onError: (err, req, res) => {
//         console.error('googleSecurityHeader proxy error:', err);
//         // Provide a fallback for connection refused errors
//         if (err.code === 'ECONNREFUSED') {
//           console.log('Connection refused for googleSecurityHeader proxy');
//           res.statusCode = 503;
//           res.end(JSON.stringify({ error: 'Service unavailable', message: 'Could not connect to authentication service' }));
//         }
//       }
//     })
//   );
//
//   // Keep the old paths for backward compatibility
//   app.use(
//     '/api/user',
//     createProxyMiddleware({
//       target: 'http://localhost:8060',
//       pathRewrite: { '^/api/user': '' },
//       changeOrigin: true,
//     })
//   );
//
//   app.use(
//     '/api/mvp',
//     createProxyMiddleware({
//       target: 'http://localhost:8080',
//       pathRewrite: { '^/api/mvp': '' },
//       changeOrigin: true,
//     })
//   );
//
//   // Add specific proxy for /api/googleSecurity
//   app.use(
//     '/api/googleSecurity',
//     createProxyMiddleware({
//       target: 'http://localhost:8060',
//       pathRewrite: { '^/api': '' },
//       changeOrigin: true,
//       secure: false,
//       onProxyReq: (proxyReq, req, res) => {
//         console.log('API googleSecurity proxy handling request:', req.method, req.url);
//         console.log('Full target URL after pathRewrite:', 'http://localhost:8060/googleSecurity' + req.url.replace(/^\/api\/googleSecurity/, ''));
//
//         // Log request body if it's a POST request
//         if (req.method === 'POST' && req.body) {
//           console.log('Request body:', JSON.stringify(req.body, null, 2));
//         }
//
//         // Log request headers
//         console.log('Request headers:', JSON.stringify(req.headers, null, 2));
//       },
//       onProxyRes: (proxyRes, req, res) => {
//         console.log('API googleSecurity proxy response status:', proxyRes.statusCode);
//         console.log('Response headers:', JSON.stringify(proxyRes.headers, null, 2));
//       },
//       onError: (err, req, res) => {
//         console.error('API googleSecurity proxy error:', err);
//         // Provide a fallback for connection refused errors
//         if (err.code === 'ECONNREFUSED') {
//           console.log('Connection refused for API googleSecurity proxy');
//           res.statusCode = 503;
//           res.end(JSON.stringify({ error: 'Service unavailable', message: 'Could not connect to authentication service' }));
//         }
//       }
//     })
//   );
//
//   // Add specific proxy for /api/eco-news
//   app.use(
//     '/api/eco-news',
//     createProxyMiddleware({
//       target: 'http://localhost:8080',
//       pathRewrite: { '^/api/eco-news': '/econews' }, // Rewrite path to match backend controller path
//       changeOrigin: true,
//       secure: false,
//       onProxyReq: (proxyReq, req, res) => {
//         // Log the original URL and the URL after rewriting
//         console.log('API eco-news proxy handling request:', req.method, req.url);
//         console.log('Original URL:', req.originalUrl);
//         console.log('Full target URL after pathRewrite:', 'http://localhost:8080/econews' + req.url.replace(/^\/api\/eco-news/, ''));
//
//         // Log headers for debugging
//         console.log('Request headers:', JSON.stringify(req.headers, null, 2));
//
//         // Ensure content-type is set correctly for POST requests
//         if (req.method === 'POST' && req.body) {
//           console.log('Request body:', JSON.stringify(req.body, null, 2));
//           if (!proxyReq.getHeader('content-type')) {
//             proxyReq.setHeader('content-type', 'application/json');
//           }
//         }
//       },
//       onProxyRes: (proxyRes, req, res) => {
//         console.log('API eco-news proxy response status:', proxyRes.statusCode);
//         console.log('Response headers:', JSON.stringify(proxyRes.headers, null, 2));
//       },
//       onError: (err, req, res) => {
//         console.error('API eco-news proxy error:', err);
//         console.error('Error details:', err.stack);
//         // Provide a fallback for connection refused errors
//         if (err.code === 'ECONNREFUSED') {
//           console.log('Connection refused for API eco-news proxy');
//           res.statusCode = 503;
//           res.end(JSON.stringify({ error: 'Service unavailable', message: 'Could not connect to econews service' }));
//         }
//       }
//     })
//   );
//
//   // Add a catch-all proxy for other /api paths
//   app.use(
//     '/api',
//     createProxyMiddleware({
//       target: 'http://localhost:8060',
//       pathRewrite: { '^/api': '' },
//       changeOrigin: true,
//       secure: false,
//       onProxyReq: (proxyReq, req, res) => {
//         console.log('API catch-all proxy handling request:', req.method, req.url);
//         console.log('Full target URL after pathRewrite:', 'http://localhost:8060' + req.url.replace(/^\/api/, ''));
//
//         // Log request body if it's a POST request
//         if (req.method === 'POST' && req.body) {
//           console.log('Request body:', JSON.stringify(req.body, null, 2));
//         }
//       },
//       onProxyRes: (proxyRes, req, res) => {
//         console.log('API catch-all proxy response status:', proxyRes.statusCode);
//       },
//       onError: (err, req, res) => {
//         console.error('API catch-all proxy error:', err);
//         // Provide a fallback for connection refused errors
//         if (err.code === 'ECONNREFUSED') {
//           console.log('Connection refused for API catch-all proxy');
//           res.statusCode = 503;
//           res.end(JSON.stringify({ error: 'Service unavailable', message: 'Could not connect to backend service' }));
//         }
//       }
//     })
//   );
// };
// const express = require('express');
// const path = require('path');
// const fs = require('fs');
// const { createProxyMiddleware } = require('http-proxy-middleware');
//
// const handlePreflight = (req, res) => {
//     if (req.method === 'OPTIONS') {
//         console.log('Handling CORS preflight for:', req.url);
//         res.writeHead(200, {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//             'Access-Control-Allow-Headers': 'Content-Type, Authorization'
//         });
//         res.end();
//         return true;
//     }
//     return false;
// };
// module.exports = function(app) {
//     // Автоматично віддаємо файли з public
//     app.use(express.static(path.join(__dirname, '../public')));
//
//     // Головний middleware — тільки для static, assets та favicon
//     app.use((req, res, next) => {
//         if (
//             req.url.startsWith('/static') ||
//             req.url.startsWith('/assets') ||
//             req.url.startsWith('/favicon.ico')
//         ) {
//             const publicPath = path.resolve(__dirname, '../public', req.url.replace(/^\//, ''));
//             if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
//                 console.log('Found local static file:', publicPath);
//                 const ext = path.extname(publicPath).toLowerCase();
//                 const mimeTypes = {
//                     '.html': 'text/html',
//                     '.js': 'text/javascript',
//                     '.css': 'text/css',
//                     '.json': 'application/json',
//                     '.png': 'image/png',
//                     '.jpg': 'image/jpeg',
//                     '.jpeg': 'image/jpeg',
//                     '.gif': 'image/gif',
//                     '.svg': 'image/svg+xml',
//                     '.ico': 'image/x-icon',
//                     '.webp': 'image/webp'
//                 };
//                 const mimeType = mimeTypes[ext] || 'application/octet-stream';
//                 res.setHeader('Content-Type', mimeType);
//                 fs.createReadStream(publicPath).pipe(res);
//                 return;
//             }
//         }
//         next();
//     });
//
//     // Проксі для API на бекенд 8060 (user, security тощо)
//     app.use('/api', createProxyMiddleware({
//         target: 'http://localhost:8060',
//         changeOrigin: true
//     }));
//
//     // Проксі для eco-news на бекенд 8080 з pathRewrite
//     app.use('/eco-news', createProxyMiddleware({
//         target: 'http://localhost:8080',
//         changeOrigin: true,
//         pathRewrite: { '^/eco-news': '/econews' }
//     }));
//
//     // Якщо у тебе є прямий /econews — теж прокси на 8080
//     app.use('/econews', createProxyMiddleware({
//         target: 'http://localhost:8080',
//         changeOrigin: true
//     }));
//
//     // Аналогічно можна додати /user чи /googleSecurity
//     app.use('/user', createProxyMiddleware({
//         target: 'http://localhost:8060',
//         changeOrigin: true
//     }));
//
//     app.use('/googleSecurity', createProxyMiddleware({
//         target: 'http://localhost:8060',
//         changeOrigin: true
//     }));
//
//     app.use('/googleSecurityHeader', createProxyMiddleware({
//         target: 'http://localhost:8060',
//         changeOrigin: true
//     }));
//
//     app.use('/ownSecurity', createProxyMiddleware({
//         target: 'http://localhost:8060',
//         changeOrigin: true
//     }));
//
//     app.use('/profile', createProxyMiddleware({
//         target: 'http://localhost:8060',
//         changeOrigin: true,
//         pathRewrite: {
//             '^/profile/(\\d+)$': '/user/$1/profile/'
//         }
//     }));
//     // app.use('/habit/my', createProxyMiddleware({
//     //     target: 'http://localhost:8080',
//     //     changeOrigin: true,
//     //     pathRewrite: {
//     //         '^/habit/my': '/habit/assign/allForCurrentUser'
//     //     }
//     // }));
//     app.use('/habit/my', createProxyMiddleware({
//         target: 'http://localhost:8080',
//         changeOrigin: true,
//         pathRewrite: { '^/habit/my': '/habit/assign/allForCurrentUser' },
//         onProxyReq: (proxyReq, req, res) => {
//             // Для preflight
//             if (req.method === 'OPTIONS') {
//                 res.writeHead(200, {
//                     'Access-Control-Allow-Origin': '*',
//                     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                     'Access-Control-Allow-Headers': 'Content-Type, Authorization'
//                 });
//                 res.end();
//             }
//         }
//     }));
// };

const express = require('express');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

const handlePreflight = (req, res) => {
    if (req.method === 'OPTIONS') {
        console.log('Handling CORS preflight for:', req.url);
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        res.end();
        return true;
    }
    return false;
};

module.exports = function(app) {
    // Віддаємо статику
    app.use(express.static(path.join(__dirname, '../public')));

    // Для static, assets, favicon
    app.use((req, res, next) => {
        if (
            req.url.startsWith('/static') ||
            req.url.startsWith('/assets') ||
            req.url.startsWith('/favicon.ico')
        ) {
            const publicPath = path.resolve(__dirname, '../public', req.url.replace(/^\//, ''));
            if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
                console.log('Found local static file:', publicPath);
                const ext = path.extname(publicPath).toLowerCase();
                const mimeTypes = {
                    '.html': 'text/html',
                    '.js': 'text/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.gif': 'image/gif',
                    '.svg': 'image/svg+xml',
                    '.ico': 'image/x-icon',
                    '.webp': 'image/webp'
                };
                const mimeType = mimeTypes[ext] || 'application/octet-stream';
                res.setHeader('Content-Type', mimeType);
                fs.createReadStream(publicPath).pipe(res);
                return;
            }
        }
        next();
    });

    // Проксі для /profile -> /user/{id}/profile
    app.use('/profile', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8060',
            changeOrigin: true,
            pathRewrite: (path, req) => {
                const userId = path.split('/')[2];
                console.log(`Rewriting /profile/${userId} -> /user/${userId}/profile/`);
                return `/user/${userId}/profile/`;
            }
        })(req, res, next);
    });

    // Проксі для /habit/my -> /habit/assign/allForCurrentUser
    app.use('/habit/my', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: { '^/habit/my': '/habit/assign/allForCurrentUser' }
        })(req, res, next);
    });
    app.use('/habit/assign', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true
        })(req, res, next);
    });
    app.use('/habit', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true
        })(req, res, next);
    });

    // Проксі для /eco-news -> /econews
    app.use('/eco-news', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: { '^/eco-news': '/econews' }
        })(req, res, next);
    });

    // Проксі для /econews без rewrite
    app.use('/econews', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true
        })(req, res, next);
    });

    // Проксі для /user
    app.use('/user', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8060',
            changeOrigin: true
        })(req, res, next);
    });

    // Проксі для /googleSecurity
    app.use('/googleSecurity', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8060',
            changeOrigin: true
        })(req, res, next);
    });

    // Проксі для /googleSecurityHeader
    app.use('/googleSecurityHeader', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8060',
            changeOrigin: true
        })(req, res, next);
    });

    // Проксі для /ownSecurity
    app.use('/ownSecurity', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8060',
            changeOrigin: true
        })(req, res, next);
    });
    app.use('/habit/statistic', (req, res, next) => {
        if (handlePreflight(req, res)) return next();
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true
        })(req, res, next);
    });

    // Універсальний для /api
    app.use('/api', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8060',
            changeOrigin: true
        })(req, res, next);
    });
};
