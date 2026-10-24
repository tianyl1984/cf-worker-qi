const BASE_URL = import.meta.env.VITE_BASE_URL || '';

async function request(method, body = {}) {
    const response = await fetch(`${BASE_URL}/api/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await response.json();
    if (data.error === 302) {
        window.location.assign(data.location);
        throw new Error('请先登录');
    }
    if (!response.ok || data.error) throw new Error(data.message || '请求失败，请稍后重试');
    return data;
}

export default {
    getUser: () => request('user'),
    getNavigation: () => request('getNavigation'),
    saveNavigation: (groups) => request('saveNavigation', { groups }),
    logout: () => window.location.assign(`${BASE_URL}/logout`)
};
