function jsonResp(obj) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json; charset=utf-8");
    const body = typeof obj === "string" ? obj : JSON.stringify(obj);
    return new Response(body, { headers });
}

function textResp(text) {
    const headers = new Headers();
    headers.append("Content-Type", "text/plain; charset=utf-8");
    return new Response(text, { headers });
}

function genUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) | (c === "y" ? 8 : 0);
        return r.toString(16);
    });
}

function getCurTime() {
    const date = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // 月份从 0 开始
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getTimestampSeconds() {
    return Math.floor(Date.now() / 1000);
}

// 转换为 Base36
function genShortId(ts = getTimestampSeconds()) {
    return ts.toString(36);
}

export default {
    jsonResp,
    textResp,
    genUUID,
    genShortId,
    getCurTime,
};
