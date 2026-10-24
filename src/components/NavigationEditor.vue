<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import api from '@/api'
import SiteIcon from './SiteIcon.vue'
import IconPicker from './IconPicker.vue'
import { cleanNavigation, validateNavigation } from '../../shared/navigationValidation.js'

const props = defineProps({ groups: { type: Array, required: true } })
const emit = defineEmits(['saved', 'cancel'])
const draft = ref(props.groups.map(group => ({ ...group, sites: group.sites.map(site => ({ ...site })) })))
const original = JSON.stringify(draft.value)
const saving = ref(false)
const error = ref('')
const dirty = computed(() => JSON.stringify(draft.value) !== original)
const totalSites = computed(() => draft.value.reduce((sum, group) => sum + group.sites.length, 0))

function cancel() {
    if (dirty.value && !window.confirm('有未保存的修改，确定放弃吗？')) return
    emit('cancel')
}

function addGroup() {
    const group = { id: crypto.randomUUID(), name: '', icon: 'globe', sites: [] }
    draft.value.push(group)
    nextTick(() => document.getElementById(`group-name-${group.id}`)?.focus())
}

function removeGroup(index) {
    const group = draft.value[index]
    if (window.confirm(`确定删除“${group.name || '未命名分组'}”及其中的所有网站吗？保存后生效。`)) {
        draft.value.splice(index, 1)
    }
}

function addSite(group) {
    const id = crypto.randomUUID()
    group.sites.push({ id, name: '', url: '', icon: 'globe', description: '' })
    nextTick(() => document.getElementById(`site-name-${id}`)?.focus())
}

function removeSite(group, index) {
    const site = group.sites[index]
    if (window.confirm(`确定删除“${site.name || '未命名网站'}”吗？保存后生效。`)) group.sites.splice(index, 1)
}

function move(items, index, offset) {
    const [item] = items.splice(index, 1)
    items.splice(index + offset, 0, item)
}

async function save() {
    error.value = validateNavigation(draft.value)
    if (error.value) return
    saving.value = true
    try {
        const data = await api.saveNavigation(cleanNavigation(draft.value))
        emit('saved', data)
    } catch (err) {
        error.value = err.message || '保存失败，请稍后重试；修改仍然保留'
    } finally {
        saving.value = false
    }
}

function beforeUnload(event) {
    if (dirty.value) {
        event.preventDefault()
        event.returnValue = ''
    }
}
window.addEventListener('beforeunload', beforeUnload)
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
</script>

<template>
    <form class="navigation-editor" aria-label="编辑收藏" @submit.prevent="save">
        <div class="editor-toolbar">
            <div class="save-info">
                <strong>编辑收藏</strong>
                <p v-if="error" class="save-error" role="alert">{{ error }}</p>
                <span v-else>{{ dirty ? '有未保存的修改' : '直接修改分组和卡片，完成后保存。' }}</span>
            </div>
            <div class="toolbar-actions">
                <button type="button" class="action-button toolbar-add-group" :disabled="saving || draft.length >= 50" @click="addGroup">
                    ＋ 新增分组
                </button>
                <button type="button" class="action-button" :disabled="saving" @click="cancel">取消</button>
                <button type="submit" class="action-button primary" :disabled="saving">{{ saving ? '保存中…' : '保存配置' }}</button>
            </div>
        </div>
        <fieldset class="editor-content" :disabled="saving">
            <section v-for="(group, groupIndex) in draft" :key="group.id" class="site-section editing-section"
                :aria-label="`${group.name || '未命名分组'} 编辑`" :data-group-id="group.id">
                <div class="section-heading editing-heading">
                    <div class="editing-group-title">
                        <span class="section-icon" :class="['peach', 'lavender', 'sand'][groupIndex % 3]">
                            <SiteIcon :icon="group.icon" />
                        </span>
                        <label class="group-name-field">
                            <span class="sr-only">分组名称</span>
                            <input :id="`group-name-${group.id}`" v-model="group.name" maxlength="80"
                                placeholder="分组名称" autocomplete="off">
                        </label>
                    </div>
                    <div class="inline-actions group-actions">
                        <button type="button" class="icon-button" :aria-label="`分组 ${groupIndex + 1} 上移`"
                            :disabled="groupIndex === 0" @click="move(draft, groupIndex, -1)">↑</button>
                        <button type="button" class="icon-button" :aria-label="`分组 ${groupIndex + 1} 下移`"
                            :disabled="groupIndex === draft.length - 1" @click="move(draft, groupIndex, 1)">↓</button>
                        <button type="button" class="text-button danger" :aria-label="`删除分组 ${groupIndex + 1}`"
                            @click="removeGroup(groupIndex)">删除分组</button>
                    </div>
                </div>
                <div class="group-icon-settings">
                    <span class="group-icon-label">分组图标</span>
                    <IconPicker :id="`group-icon-${group.id}`" v-model="group.icon" :disabled="saving"
                        :label="`分组 ${groupIndex + 1} 选择图标`" />
                </div>
                <div class="site-grid">
                    <article v-for="(site, siteIndex) in group.sites" :key="site.id" class="site-card site-card-edit"
                        :aria-label="`网站 ${siteIndex + 1} 编辑`" :data-site-id="site.id">
                        <div class="site-edit-heading">
                            <span class="site-logo" :class="site.icon">
                                <SiteIcon :icon="site.icon" :fallback="site.name.slice(0, 1)" />
                            </span>
                            <div class="inline-actions">
                                <button type="button" class="icon-button" :aria-label="`网站 ${siteIndex + 1} 前移`"
                                    :disabled="siteIndex === 0" @click="move(group.sites, siteIndex, -1)">←</button>
                                <button type="button" class="icon-button" :aria-label="`网站 ${siteIndex + 1} 后移`"
                                    :disabled="siteIndex === group.sites.length - 1" @click="move(group.sites, siteIndex, 1)">→</button>
                                <button type="button" class="icon-button danger" :aria-label="`删除网站 ${siteIndex + 1}`"
                                    @click="removeSite(group, siteIndex)">×</button>
                            </div>
                        </div>
                        <label class="field">网站名称 <span class="required">*</span>
                            <input :id="`site-name-${site.id}`" v-model="site.name" maxlength="80"
                                placeholder="例如：Dribbble" autocomplete="off">
                        </label>
                        <label class="field">网站地址 <span class="required">*</span>
                            <input v-model="site.url" maxlength="2048" placeholder="https://example.com" inputmode="url" autocomplete="off">
                        </label>
                        <div class="field">
                            <span class="field-label">网站图标</span>
                            <IconPicker :id="`site-icon-${site.id}`" v-model="site.icon" :disabled="saving"
                                :label="`网站 ${siteIndex + 1} 选择图标`" />
                        </div>
                        <label class="field">说明
                            <textarea v-model="site.description" rows="2" maxlength="300" placeholder="用一句话介绍这个网站"></textarea>
                        </label>
                    </article>
                    <button type="button" class="add-site-card" :disabled="totalSites >= 500" @click="addSite(group)">
                        <span class="add-mark">＋</span><span>添加网站</span>
                    </button>
                </div>
            </section>
            <p v-if="!draft.length" class="editor-empty">还没有分组，添加一个分组，开始整理收藏。</p>
            <button type="button" class="add-group-button" :disabled="draft.length >= 50" @click="addGroup">＋ 新增分组</button>
        </fieldset>
    </form>
</template>
