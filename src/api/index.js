import { useLoading } from '@/composables/useLoading.js'
import { useSuccessToast } from '@/composables/useSuccessToast.js'

const BASE_URL = import.meta.env.VITE_BASE_URL || '';

async function getUser() {
    return await _doFetch('/api/user');
}

function logout() {
    window.location.href = `${BASE_URL}/logout`;
}

async function _doFetch(url, body, isShowToast = true) {
    const { showLoading, hideLoading } = useLoading()
    const { showToast } = useSuccessToast()

    try {
        showLoading('请求中...')
        if (!body) {
            body = {}
        }
        const resp = await fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            body: JSON.stringify(body)
        });

        if (resp.status === 500) {
            alert('服务异常:' + (await resp.text()));
            return
        }

        const data = await resp.json();
        _checkResp(data);

        if (!data.error && isShowToast) {
            showToast('操作成功');
        }

        return data;
    } finally {
        hideLoading()
    }
}

function _checkResp(data) {
    if (data.error) {
        if (data.error == 302) {
            window.location.href = data.location;
            return;
        }
        if (data.error == 404) {
            alert('接口不存在');
            return;
        }
        alert('未知错误:' + data.error);
    }
}

export default {
    getUser,
    logout,
}
