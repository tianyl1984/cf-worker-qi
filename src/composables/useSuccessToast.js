import { ref } from 'vue'

const isToastVisible = ref(false)
const toastText = ref('操作成功')
let toastTimer = null

export function useSuccessToast() {
    const showToast = (text = '操作成功') => {
        if (toastTimer) {
            clearTimeout(toastTimer)
        }

        toastText.value = text
        isToastVisible.value = true

        toastTimer = setTimeout(() => {
            isToastVisible.value = false
        }, 3000)
    }

    const hideToast = () => {
        if (toastTimer) {
            clearTimeout(toastTimer)
        }
        isToastVisible.value = false
        toastText.value = '操作成功'
    }

    return {
        isToastVisible,
        toastText,
        showToast,
        hideToast
    }
}