<script setup>
import { onMounted, ref } from 'vue'
import api from '@/api'
import SiteIcon from '@/components/SiteIcon.vue'
import NavigationEditor from '@/components/NavigationEditor.vue'
import { useSuccessToast } from '@/composables/useSuccessToast.js'

const groups = ref([])
const loading = ref(true)
const error = ref('')
const editing = ref(false)
const { showToast } = useSuccessToast()

async function load() {
    loading.value = true
    error.value = ''
    try {
        const data = await api.getNavigation()
        groups.value = data.groups
    } catch (err) {
        error.value = err.message || '加载失败，请检查网络后重试'
    } finally {
        loading.value = false
    }
}

function saved(data) {
    groups.value = data.groups
    editing.value = false
    showToast('配置已保存')
}

onMounted(load)
</script>

<template>
    <a class="skip-link" href="#main">跳转到收藏</a>
    <main id="main">
        <header class="personal-note">
            <span class="note-icon" aria-hidden="true"><SiteIcon icon="leaf" /></span>
            <h1>常用的网站，都在这里。</h1>
            <span v-if="editing" class="editing-badge">编辑中</span>
            <button v-else class="settings-button" aria-label="编辑收藏" title="编辑收藏"
                :disabled="loading || !!error" @click="editing = true">
                <SiteIcon icon="settings" />
            </button>
        </header>

        <div v-if="loading" class="page-state" role="status">正在整理你的收藏…</div>
        <div v-else-if="error" class="page-state" role="alert">
            <p>{{ error }}</p>
            <button class="action-button" @click="load">重新加载</button>
        </div>
        <NavigationEditor v-else-if="editing" :groups="groups" @saved="saved" @cancel="editing = false" />
        <template v-else>
            <section v-for="(group, index) in groups" :key="group.id" class="site-section" :aria-labelledby="`title-${group.id}`">
                <div class="section-heading">
                    <div>
                        <span class="section-icon" :class="['peach', 'lavender', 'sand'][index % 3]"><SiteIcon :icon="group.icon" /></span>
                        <h2 :id="`title-${group.id}`">{{ group.name }}</h2>
                    </div>
                </div>
                <div v-if="group.sites.length" class="site-grid">
                    <a v-for="site in group.sites" :key="site.id" class="site-card" :href="site.url" target="_blank" rel="noopener noreferrer">
                        <span class="site-logo" :class="site.icon">
                            <SiteIcon :icon="site.icon" :fallback="site.name.slice(0, 1)" />
                        </span>
                        <span class="site-info"><h3>{{ site.name }}</h3><p>{{ site.description }}</p></span>
                        <SiteIcon icon="arrow" class="external-arrow" />
                    </a>
                </div>
                <p v-else class="empty-group">这个分组还没有网站，点击右上角配置添加。</p>
            </section>
            <div v-if="!groups.length" class="page-state">
                <span class="empty-leaf"><SiteIcon icon="leaf" /></span>
                <h2>收藏，从这里开始。</h2>
                <p>建一个分组，留住你常去的好网站。</p>
                <button class="action-button primary" @click="editing = true">添加第一个分组</button>
            </div>
        </template>
    </main>
</template>
