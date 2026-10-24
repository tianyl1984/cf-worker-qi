<script setup>
import { RouterView } from 'vue-router'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useLoading } from '@/composables/useLoading.js'
import { useSuccessToast } from '@/composables/useSuccessToast.js'
import { useConfirm } from '@/composables/useConfirm.js'

const { isLoading, loadingText } = useLoading()
const { isToastVisible, toastText } = useSuccessToast()
const { isConfirmVisible, handleConfirm, handleCancel } = useConfirm()
</script>

<template>
    <RouterView />
    <LoadingOverlay :visible="isLoading" :text="loadingText" />
    <SuccessToast :visible="isToastVisible" :text="toastText" />
    <ConfirmDialog :visible="isConfirmVisible" @confirm="handleConfirm" @cancel="handleCancel" />
</template>