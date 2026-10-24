<script setup>
import { computed, ref, watch } from 'vue'
import { iconPresets } from './iconPresets.js'
import { isHttpUrl } from '../../shared/navigationValidation.js'

const props = defineProps({ icon: { type: String, default: '' }, fallback: { type: String, default: '◇' } })
const failed = ref(false)
const preset = computed(() => Object.hasOwn(iconPresets, props.icon) ? iconPresets[props.icon] : null)
const image = computed(() => isHttpUrl(props.icon))
const letters = { behance: 'Bē', pinterest: 'P', mdn: 'M_' }
const label = computed(() => Object.hasOwn(letters, props.icon) ? letters[props.icon] : props.icon)
watch(() => props.icon, () => { failed.value = false })
</script>

<template>
    <img v-if="image && !failed" :src="icon" alt="" referrerpolicy="no-referrer" @error="failed = true">
    <svg v-else-if="preset" v-bind="preset.attrs" aria-hidden="true">
        <component :is="shape.tag" v-for="(shape, index) in preset.shapes" :key="index" v-bind="shape.attrs" />
    </svg>
    <span v-else class="icon-text" aria-hidden="true">{{ image ? fallback : (label || fallback) }}</span>
</template>
