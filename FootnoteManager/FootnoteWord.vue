<template>
  <span
    :data-footnote-word="wordId"
    :class="{ 'footnote-word': hasFootnote, 'has-footnote': hasFootnote }"
    class="footnote-word-container"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
    @click="handleClick"
  >
    {{ word }}

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
  word: {
    type: String,
    required: true
  },
  footnote: {
    type: String,
    default: ''
  }
})

const showTooltip = ref(false)
const tooltipPosition = ref({ left: 0, top: 0 })
const wordId = `word-${Math.random().toString(36).substr(2, 9)}`

const hasFootnote = computed(() => !!props.footnote)

const updateTooltipPosition = () => {
  const el = document.querySelector(`[data-footnote-word="${props.word}"]`)
  if (!el) return

  const rect = el.getBoundingClientRect()
  const tooltipWidth = 180
  const viewportWidth = window.innerWidth

  let left = rect.left + window.pageXOffset
  let top = rect.top + window.pageYOffset - 40

  if (left + tooltipWidth > viewportWidth) {
    left = rect.right + window.pageXOffset - tooltipWidth
  }

  tooltipPosition.value = { left, top }
}

const handleMouseEnter = () => {
  showTooltip.value = true
  updateTooltipPosition()
}

const handleMouseLeave = () => {
  showTooltip.value = false
}

const handleClick = () => {
  if (!hasFootnote.value) return

  const currentFootnotes = JSON.parse(localStorage.getItem('footnotes') || '{}')
  delete currentFootnotes[props.word]
  localStorage.setItem('footnotes', JSON.stringify(currentFootnotes))

  window.dispatchEvent(new CustomEvent('footnote-deleted'))
}
</script>

<style scoped>
.footnote-word-container {
  display: inline;
  cursor: pointer;
  color: #333;
  transition: color 0.2s ease;
  margin: 0 1px;
  position: relative;
  z-index: 1;
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
  z-index: 1001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-100%) translateX(-50%);
  left: 50%;
  margin-top: 5px;
  min-width: 120px;
  text-align: center;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-110%) translateX(-50%); }
  to { opacity: 1; transform: translateY(-100%) translateX(-50%); }
}
</style>