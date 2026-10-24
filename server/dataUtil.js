const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function base58Encode(bytes) {
    let intVal = BigInt('0x' + [...bytes].map(b => b.toString(16).padStart(2,'0')).join(''));
    let result = '';

    while (intVal > 0) {
        const remainder = intVal % 58n;
        intVal = intVal / 58n;
        result = BASE58_ALPHABET[Number(remainder)] + result;
    }

    for (let byte of bytes) {
        if (byte === 0) result = '1' + result;
        else break;
    }

    return result;
}

function parseData(jsonStr) {
    jsonStr = jsonStr.trim();
    if (jsonStr.startsWith('{')) {
        const data = parseObj(jsonStr);
        checkData(data);
        return data;
    }
    if (jsonStr.startsWith('[')) {
        const data = JSON.parse(jsonStr);
        checkData(data);
        return data;
    }
    throw new Error('格式错误');
}

function parseObj(jsonStr) {
    const obj = JSON.parse(jsonStr);
    const result = [];
    for (const key in obj['api_site']) {
        const item = obj['api_site'][key];
        if (!item.name) {
            item.name = key;
        }
        result.push({ id: key, name: item.name, url: item.api })
    }
    return result;
}

function checkData(data) {
    for (const item of data) {
        if (!item.id || !item.name || !item.url) {
            throw new Error('格式错误:' + JSON.stringify(item));
        }
    }
}

function convertToSubscribe(data) {
    const obj = {
        cache_time: 9200,
        api_site: {

        }
    };
    for(const item of data) {
        obj['api_site'][item.id] = {
            name: item.name,
            api: item.url
        }
    }
    return base58Encode(new TextEncoder().encode(JSON.stringify(obj)));
}

export default {
    parseData,
    convertToSubscribe,
}