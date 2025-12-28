<template>
  <span :class="['badge', variantClass, sizeClass]">
    <slot />
  </span>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const variantClass = {
  'badge-default': props.variant === 'default',
  'badge-primary': props.variant === 'primary',
  'badge-success': props.variant === 'success',
  'badge-warning': props.variant === 'warning',
  'badge-danger': props.variant === 'danger',
}

const sizeClass = {
  'badge-sm': props.size === 'sm',
  'badge-md': props.size === 'md',
  'badge-lg': props.size === 'lg',
}
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 9999px;
  white-space: nowrap;
}

.badge-sm {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  line-height: 1;
}

.badge-md {
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  line-height: 1.25;
}

.badge-lg {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  line-height: 1.375;
}

.badge-default {
  background: #f3f4f6;
  color: #374151;
}

.badge-primary {
  background: #dbeafe;
  color: #1e40af;
}

.badge-success {
  background: #dcfce7;
  color: #166534;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}

.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}
</style>