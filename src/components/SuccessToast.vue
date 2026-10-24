<template>
  <div v-if="visible" class="success-toast">
    <div class="success-toast-content">
      <svg class="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="success-text">{{ text }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: '操作成功'
  }
})
</script>

<style scoped>
.success-toast {
  position: fixed;
  left: 50%;
  bottom: 30%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;
  animation: fadeIn 0.3s ease-out;
}

.success-toast-content {
  background: #2d3748;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  max-width: 300px;
}

.success-icon {
  width: 20px;
  height: 20px;
  color: #68d391;
  flex-shrink: 0;
}

.success-text {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>