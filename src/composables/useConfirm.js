import { ref } from 'vue'

const isConfirmVisible = ref(false)

let confirmCb = () => {}

export function useConfirm() {

    const showConfirm = (cb) => {
        isConfirmVisible.value = true;
        confirmCb = cb
    }

    const handleConfirm = () => {
        confirmCb()
        isConfirmVisible.value = false
        confirmCb = () => {}
    }

    const handleCancel = () => {
        isConfirmVisible.value = false
    }

    return {
        isConfirmVisible,
        showConfirm,
        handleConfirm,
        handleCancel,
    }
}