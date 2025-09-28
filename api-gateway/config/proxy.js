const { createProxyMiddleware } = require('http-proxy-middleware');
const { GATEWAY_SECRET_KEY } = require('./env');

const proxyOptions = (target, pathRewrite = null) => ({
    target,
    changeOrigin: true,
    pathRewrite,
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log(`[PROXY] Request to ${req.method} ${req.originalUrl} -> Forwarding to ${target}${proxyReq.path}`);

            proxyReq.setHeader('X-Gateway-Secret', GATEWAY_SECRET_KEY);

            if (req.user) {
                proxyReq.setHeader('x-user-email', req.user.email);
                proxyReq.setHeader('x-employee-id', req.user.employeeId);
                proxyReq.setHeader('x-user-fullname', req.user.fullName);
                proxyReq.setHeader('x-user-role', req.user.role);
            }

            if (req.body && Object.keys(req.body).length > 0) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        },
        error: (err, req, res) => {
            console.error(`[API Gateway] Proxy Error to ${target}:`, err);
            if (!res.headersSent) {
                res.status(502).json({ message: 'Bad Gateway' });
            }
        }
    }
});

module.exports = {
    proxyOptions,
    createProxyMiddleware
};
