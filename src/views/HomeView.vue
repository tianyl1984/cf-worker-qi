<script setup>
import api from '@/api'
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSuccessToast } from '@/composables/useSuccessToast.js'
import { useConfirm } from '@/composables/useConfirm.js'

const { showToast } = useSuccessToast()
const { showConfirm } = useConfirm()

const dataList = ref([])

const fetchData = async () => {
    
}

const init = async () => {
    await fetchData()
}

onMounted(init);

</script>

<template>
    <div class="container">
        <h1 class="header">xx管理</h1>
    </div>
</template>
