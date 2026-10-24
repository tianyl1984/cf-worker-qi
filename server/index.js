import auth from './auth.js';
import util from './util.js';
import service from './service.js';

export default {
    async fetch(request, env, ctx) {
        try {
            return await _handle(request, env, ctx);
        } catch (err) {
            console.error('Unhandled error:', err);
            return new Response(err.message, { status: 500 });
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
    if (!service[method]) {
        return util.jsonResp({ error: 404 });
    }
    const body = req.body ? (await req.json()) : null;
    const result = await service[method](body, env, ctx);
    return util.jsonResp(result);
}


