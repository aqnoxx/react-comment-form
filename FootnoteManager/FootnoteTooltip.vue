<template>
  <span
    class="footnote-word"
    :class="{ 'has-footnote': footnote }"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
    @click.prevent
  >
    <slot />
    <div
      v-if="showTooltip && footnote"
      class="footnote-tooltip"
      :style="{ left: tooltipPosition.left + 'px', top: tooltipPosition.top + 'px' }"
    >
      {{ footnote }}
    </div>
  </span>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  footnote: {
    type: String,
    default: ''
  }
})

const showTooltip = ref(false)
const tooltipPosition = ref({ left: 0, top: 0 })

const handleMouseEnter = (e) => {
  const rect = e.target.getBoundingClientRect()
  tooltipPosition.value = {
    left: rect.left + window.pageXOffset,
    top: rect.top + window.pageYOffset - 40
  }
}

if (props.footnote) {

}
</script>

<style scoped>
.footnote-word {
  position: relative;
  cursor: pointer;
  color: #333;
  transition: color 0.2s ease;
}

.footnote-word.has-footnote {
  color: #1e90ff;
  border-bottom: 1px dashed #1e90ff;
}

.footnote-tooltip {
  position: absolute;
  background-color: #333;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transform: translateY(-100%) translateX(-50%);
  left: 50%;
  margin-top: 5px;
}
</style>