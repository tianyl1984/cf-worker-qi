import { validateNavigation, cleanNavigation } from '../shared/navigationValidation.js';

export default {
    async getNavigation(body, env) {
        const data = await env.DB.prepare(
            'SELECT id, name, icon, sites_json FROM navigation_groups ORDER BY sort_order, id'
        ).all();
        const groups = data.results.map(row => ({
            id: row.id,
            name: row.name,
            icon: row.icon,
            sites: JSON.parse(row.sites_json)
        }));
        return { groups };
    },

    async saveNavigation(body, env) {
        const error = validateNavigation(body?.groups);
        if (error) return { error: 400, message: error };
        const groups = cleanNavigation(body.groups);
        for (const [index, group] of groups.entries()) {
            await env.DB.prepare(
                `INSERT INTO navigation_groups (id, name, icon, sort_order, sites_json)
                 VALUES (?, ?, ?, ?, ?)
                 ON CONFLICT(id) DO UPDATE SET name = excluded.name, icon = excluded.icon,
                 sort_order = excluded.sort_order, sites_json = excluded.sites_json, updated_at = CURRENT_TIMESTAMP`
            ).bind(group.id, group.name, group.icon, index, JSON.stringify(group.sites)).run();
        }
        if (groups.length) {
            const placeholders = groups.map(() => '?').join(', ');
            await env.DB.prepare(`DELETE FROM navigation_groups WHERE id NOT IN (${placeholders})`)
                .bind(...groups.map(group => group.id)).run();
        } else {
            await env.DB.prepare('DELETE FROM navigation_groups').run();
        }
        return { groups };
    }
};
