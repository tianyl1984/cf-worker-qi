-- 每条记录对应一个分组；分组按 sort_order 排序，网站按 sites_json 数组顺序展示。
CREATE TABLE IF NOT EXISTS navigation_groups (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL CHECK (sort_order >= 0),
    sites_json TEXT NOT NULL CHECK (json_valid(sites_json) AND json_type(sites_json) = 'array'),
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_navigation_groups_sort_order ON navigation_groups (sort_order, id);
