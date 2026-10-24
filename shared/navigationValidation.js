export function isHttpUrl(value) {
    try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname);
    } catch {
        return false;
    }
}

export function validateNavigation(groups) {
    if (!Array.isArray(groups) || groups.length > 50) return '最多支持 50 个分组';
    const ids = new Set();
    let siteCount = 0;
    const text = (value, max) => typeof value === 'string' && value.length <= max;
    const validId = (id) => {
        if (!text(id, 100) || !id || ids.has(id)) return false;
        ids.add(id);
        return true;
    };
    const validIcon = (icon) => text(icon, 2048)
        && (!icon.includes(':') || isHttpUrl(icon));

    for (const [index, group] of groups.entries()) {
        const label = `第 ${index + 1} 个分组`;
        if (!group || !validId(group.id)) return `${label}的标识无效或重复`;
        if (!text(group.name, 80) || !group.name.trim()) return `${label}名称必填，且不超过 80 字`;
        if (!validIcon(group.icon)) return `${label}图标请使用内置名称、Emoji 或 http/https 图片地址`;
        if (!Array.isArray(group.sites)) return `${label}的网站列表无效`;
        siteCount += group.sites.length;
        if (siteCount > 500) return '最多支持 500 个网站';
        for (const [siteIndex, site] of group.sites.entries()) {
            const siteLabel = `${group.name || label}中的第 ${siteIndex + 1} 个网站`;
            if (!site || !validId(site.id)) return `${siteLabel}的标识无效或重复`;
            if (!text(site.name, 80) || !site.name.trim()) return `${siteLabel}名称必填，且不超过 80 字`;
            if (!text(site.url, 2048) || !isHttpUrl(site.url)) return `${siteLabel}请填写完整的 http/https 地址`;
            if (!validIcon(site.icon)) return `${siteLabel}图标请使用内置名称、Emoji 或 http/https 图片地址`;
            if (!text(site.description, 300)) return `${siteLabel}说明不能超过 300 字`;
        }
    }
    return '';
}

export function cleanNavigation(groups) {
    return groups.map(group => ({
        id: group.id,
        name: group.name.trim(),
        icon: group.icon.trim(),
        sites: group.sites.map(site => ({
            id: site.id,
            name: site.name.trim(),
            url: site.url.trim(),
            icon: site.icon.trim(),
            description: site.description.trim()
        }))
    }));
}
