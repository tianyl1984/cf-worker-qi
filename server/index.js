import auth from './auth.js';
import util from './util.js';
import service from './service.js';

export default {
    async fetch(request, env, ctx) {
        try {
            return await _handle(request, env, ctx);
        } catch (err) {
            console.error('Unhandled error:', err);
            return Response.json({ error: 500, message: '服务暂时不可用，请检查数据库初始化后重试' }, { status: 500 });
        }
    },
};

async function _handle(req, env, ctx) {
    const authResult = await auth.checkAuth(req, env, ctx);
    if (authResult.resp != null) {
        return authResult.resp;
    }
    const url = new URL(req.url);
    // 用户信息
    if (url.pathname.startsWith('/api/user')) {
        const user = authResult.user;
        return util.jsonResp({
            name: user.name,
            avatar: user.avatar_url,
            bio: user.bio
        });
    }
    const method = url.pathname.substring(5);
    if (!Object.hasOwn(service, method)) {
        return Response.json({ error: 404, message: '接口不存在' }, { status: 404 });
    }
    if (req.method !== 'POST') {
        return Response.json({ error: 405, message: '请求方法不支持' }, { status: 405, headers: { Allow: 'POST' } });
    }
    if (Number(req.headers.get('Content-Length')) > 1024 * 1024) {
        return Response.json({ error: 413, message: '配置内容过大' }, { status: 413 });
    }
    let body;
    try {
        const raw = await req.text();
        if (new TextEncoder().encode(raw).length > 1024 * 1024) {
            return Response.json({ error: 413, message: '配置内容过大' }, { status: 413 });
        }
        body = raw ? JSON.parse(raw) : null;
    } catch {
        return Response.json({ error: 400, message: '请求内容必须是 JSON' }, { status: 400 });
    }
    const result = await service[method](body, env, ctx);
    return Response.json(result, { status: result.error || 200, headers: { 'Cache-Control': 'no-store' } });
}


