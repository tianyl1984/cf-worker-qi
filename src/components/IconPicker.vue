<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import SiteIcon from './SiteIcon.vue'
import { iconCategories } from './iconPresets.js'

const props = defineProps({
    id: { type: String, required: true },
    modelValue: { type: String, default: 'globe' },
    label: { type: String, default: '选择图标' },
    disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])
const opened = ref(false)
const activeCategory = ref('common')
const trigger = ref(null)
const panel = ref(null)
const icons = iconCategories.flatMap(category => category.icons)
const selectedLabel = computed(() => icons.find(([value]) => value === props.modelValue)?.[1] || '当前图标')
const categoryIcons = computed(() => iconCategories.find(category => category.id === activeCategory.value).icons)

function updatePosition() {
    if (!opened.value || !panel.value || !trigger.value) return
    const viewport = window.visualViewport
    const leftEdge = (viewport?.offsetLeft || 0) + 12
    const topEdge = (viewport?.offsetTop || 0) + 12
    const rightEdge = leftEdge + (viewport?.width || window.innerWidth) - 24
    const bottomEdge = topEdge + (viewport?.height || window.innerHeight) - 24
    const anchor = trigger.value.getBoundingClientRect()
    if (anchor.bottom < topEdge || anchor.top > bottomEdge) {
        close(false)
        return
    }
    const width = Math.min(320, rightEdge - leftEdge)
    panel.value.style.width = `${width}px`
    const border = panel.value.offsetHeight - panel.value.clientHeight
    const height = Math.min(panel.value.scrollHeight + border, bottomEdge - topEdge)
    const below = bottomEdge - anchor.bottom - 8
    const above = anchor.top - topEdge - 8
    const placeBelow = below >= height || below >= above
    panel.value.style.maxHeight = `${Math.max(0, placeBelow ? below : above)}px`
    const actualHeight = panel.value.getBoundingClientRect().height
    const top = placeBelow ? anchor.bottom + 8 : anchor.top - actualHeight - 8
    Object.assign(panel.value.style, {
        left: `${Math.max(leftEdge, Math.min(anchor.left, rightEdge - width))}px`,
        top: `${Math.max(topEdge, Math.min(top, bottomEdge - actualHeight))}px`,
        visibility: 'visible'
    })
}

function outside(event) {
    if (!trigger.value?.contains(event.target) && !panel.value?.contains(event.target)) close(false)
}

function escape(event) {
    if (event.key !== 'Escape') return
    event.preventDefault()
    event.stopPropagation()
    close()
}

function scroll(event) {
    if (!panel.value?.contains(event.target)) updatePosition()
}

function removeListeners() {
    document.removeEventListener('pointerdown', outside, true)
    document.removeEventListener('focusin', outside)
    document.removeEventListener('keydown', escape)
    window.removeEventListener('scroll', scroll, true)
    window.removeEventListener('resize', updatePosition)
    window.visualViewport?.removeEventListener('resize', updatePosition)
    window.visualViewport?.removeEventListener('scroll', updatePosition)
}

async function toggle() {
    if (opened.value) return close()
    if (props.disabled) return
    activeCategory.value = iconCategories.find(category => category.icons.some(([value]) => value === props.modelValue))?.id || 'common'
    opened.value = true
    await nextTick()
    if (!opened.value) return
    updatePosition()
    if (!opened.value) return
    document.addEventListener('pointerdown', outside, true)
    document.addEventListener('focusin', outside)
    document.addEventListener('keydown', escape)
    window.addEventListener('scroll', scroll, true)
    window.addEventListener('resize', updatePosition)
    window.visualViewport?.addEventListener('resize', updatePosition)
    window.visualViewport?.addEventListener('scroll', updatePosition)
    panel.value.querySelector('.picker-option[aria-pressed="true"], .picker-categories [aria-pressed="true"]')
        ?.focus({ preventScroll: true })
}

function close(restoreFocus = true) {
    opened.value = false
    removeListeners()
    if (restoreFocus) nextTick(() => trigger.value?.focus({ preventScroll: true }))
}

function select(value) {
    emit('update:modelValue', value)
    close()
}

watch(activeCategory, () => nextTick(updatePosition))
watch(() => props.disabled, value => { if (value) close(false) })
onBeforeUnmount(removeListeners)
</script>

<template>
    <div class="icon-picker">
        <button :id="id" ref="trigger" type="button" class="icon-picker-trigger" :aria-label="label"
            :aria-expanded="opened" :aria-controls="`${id}-options`" aria-haspopup="dialog" :disabled="disabled" @click="toggle">
            <span class="picker-preview"><SiteIcon :icon="modelValue" /></span>
            <span class="picker-current">{{ selectedLabel }}</span>
            <span class="picker-change">{{ opened ? '收起' : '选择图标' }}</span>
            <span class="picker-chevron" aria-hidden="true">{{ opened ? '⌃' : '⌄' }}</span>
        </button>
        <Teleport to="body">
            <div v-if="opened" :id="`${id}-options`" ref="panel" class="icon-picker-panel"
                role="dialog" :aria-label="`${label}选项`">
                <div class="picker-caption"><span>内置图标</span><span>{{ icons.length }} 个可选</span></div>
                <div class="picker-categories" aria-label="图标分类">
                    <button v-for="category in iconCategories" :key="category.id" type="button" :data-category="category.id"
                        :aria-pressed="activeCategory === category.id" @click="activeCategory = category.id">{{ category.label }}</button>
                </div>
                <div class="picker-grid">
                    <button v-for="[value, name] in categoryIcons" :key="value" type="button" class="picker-option"
                        :title="name" :aria-label="`选择${name}图标`" :aria-pressed="modelValue === value"
                        :data-icon="value" @click="select(value)">
                        <span class="picker-option-icon" :class="value"><SiteIcon :icon="value" /></span>
                    </button>
                </div>
            </div>
        </Teleport>
    </div>
</template>
