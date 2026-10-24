<template>
    <div v-if="visible" class="confirm-overlay" @click="handleOverlayClick">
        <div class="confirm-dialog" @click.stop>
            <div class="confirm-header">
                <h3 class="confirm-title">{{ title }}</h3>
            </div>

            <div class="confirm-body">
                <p class="confirm-message">{{ message }}</p>
            </div>

            <div class="confirm-footer">
                <button class="confirm-btn cancel-btn" @click="handleCancel">
                    {{ cancelText }}
                </button>
                <button class="confirm-btn confirm-btn-primary" @click="handleConfirm">
                    {{ confirmText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: '提示'
    },
    message: {
        type: String,
        default: '确定要执行此操作吗？'
    },
    confirmText: {
        type: String,
        default: '确定'
    },
    cancelText: {
        type: String,
        default: '取消'
    }
})

const emit = defineEmits(['confirm', 'cancel', 'update:visible'])

const handleConfirm = () => {
    emit('confirm')
    emit('update:visible', false)
}

const handleCancel = () => {
    emit('cancel')
    emit('update:visible', false)
}

const handleOverlayClick = () => {
    // handleCancel()
}
</script>

<style scoped>
.confirm-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
}

.confirm-dialog {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 90%;
    max-width: 400px;
    overflow: hidden;
    animation: confirmSlideIn 0.2s ease-out;
}

@keyframes confirmSlideIn {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.confirm-header {
    padding: 24px 24px 16px;
    border-bottom: 1px solid #e5e7eb;
}

.confirm-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
}

.confirm-body {
    padding: 16px 24px 24px;
}

.confirm-message {
    margin: 0;
    color: #6b7280;
    line-height: 1.5;
    font-size: 14px;
}

.confirm-footer {
    padding: 16px 24px 24px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.confirm-btn {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 70px;
}

.cancel-btn {
    background: white;
    color: #6b7280;
    border-color: #d1d5db;
}

.cancel-btn:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    color: #374151;
}

.confirm-btn-primary {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.confirm-btn-primary:hover {
    background: #2563eb;
    border-color: #2563eb;
}

.confirm-btn:active {
    transform: translateY(1px);
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
    .confirm-dialog {
        background: #1f2937;
    }

    .confirm-header {
        border-bottom-color: #374151;
    }

    .confirm-title {
        color: #f9fafb;
    }

    .confirm-message {
        color: #d1d5db;
    }

    .cancel-btn {
        background: #374151;
        color: #d1d5db;
        border-color: #4b5563;
    }

    .cancel-btn:hover {
        background: #4b5563;
        border-color: #6b7280;
        color: #f3f4f6;
    }
}
</style>