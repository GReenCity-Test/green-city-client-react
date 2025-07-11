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

    app.use(express.static(path.join(__dirname, '../public')));
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

    app.use('/eco-news', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: { '^/eco-news': '/econews' }
        })(req, res, next);
    });

    app.use('/econews', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true
        })(req, res, next);
    });

    app.use('/user', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8060',
            changeOrigin: true
        })(req, res, next);
    });

    app.use('/googleSecurity', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8060',
            changeOrigin: true
        })(req, res, next);
    });

    app.use('/googleSecurityHeader', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8060',
            changeOrigin: true
        })(req, res, next);
    });

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

    app.use('/api', (req, res, next) => {
        if (handlePreflight(req, res)) return next();

        createProxyMiddleware({
            target: 'http://localhost:8060',
            changeOrigin: true
        })(req, res, next);
    });
};
