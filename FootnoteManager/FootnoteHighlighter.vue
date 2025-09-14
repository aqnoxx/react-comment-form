<template>
  <div class="footnote-container">
    <div class="text-content">
      <template v-for="(paragraph, idx) in processedContent" :key="idx">
        <p class="paragraph">
          <template v-for="(chunk, chunkIdx) in paragraph.tokens" :key="chunkIdx">
            <template v-if="chunk.type === 'word'">
              <FootnoteWord
                :word="chunk.text"
                :footnote="getFootnote(chunk.text)"
              />
            </template>
            <template v-else-if="chunk.type === 'space'">
              {{ chunk.text }}
            </template>
            <template v-else>
              {{ chunk.text }}
            </template>
          </template>
        </p>
      </template>
    </div>

    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal">
        <h3>Добавить сноску</h3>
        <textarea
          v-model="noteText"
          placeholder="Введите пояснение..."
          rows="4"
          class="footnote-textarea"
        ></textarea>
        <button @click="saveNote" class="btn">Сохранить</button>
        <button @click="cancelNote" class="btn btn-cancel">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import FootnoteWord from './FootnoteWord.vue'

const content = ref(`
<p>В древности люди верили, что Земля плоская. Это убеждение держалось веками, пока не появились первые научные наблюдения.</p>
<p>Аристотель, один из величайших философов античности, уже в IV веке до нашей эры предположил, что Земля имеет форму шара. Он основывался на наблюдении за лунными затмениями — тень Земли всегда круглая.</p>
<p>Позже, в III веке до н.э., Эратосфен вычислил окружность Земли с поразительной точностью, используя тени в двух городах — Александрии и Сиене.</p>
<p>Однако идея шарообразности Земли не сразу стала общепринятой. В средние века многие считали её ошибочной, и лишь с эпохи Возрождения она получила широкое распространение.</p>
<p>Сегодня каждый школьник знает, что Земля — планета, вращающаяся вокруг Солнца. Но это знание стало возможным благодаря тысячелетиям наблюдений, экспериментов и смелых идей.</p>
`)

const footnoteVersion = reactive({ version: 0 })

function getFootnote(word) {
  const saved = localStorage.getItem('footnotes')
  if (!saved) return ''
  const footnotes = JSON.parse(saved)
  return footnotes[word] || ''
}

function bumpFootnoteVersion() {
  footnoteVersion.version += 1
}

const processedContent = computed(() => {
  footnoteVersion.version 

  const paragraphs = content.value.match(/<p>(.*?)<\/p>/gs) || []

  return paragraphs.map(p => {
    const innerText = p.replace(/<\/?p>/g, '')
    const tokens = []
    let currentWord = ''

    for (let i = 0; i < innerText.length; i++) {
      const char = innerText[i]

      if (/[a-zA-Zа-яА-ЯёЁ0-9]/.test(char)) {
        currentWord += char
      } else {
        if (currentWord) {
          tokens.push({ type: 'word', text: currentWord })
          currentWord = ''
        }

        if (char === ' ') {
          tokens.push({ type: 'space', text: ' ' })
        } else {
          tokens.push({ type: 'punct', text: char })
        }
      }
    }

    if (currentWord) {
      tokens.push({ type: 'word', text: currentWord })
    }

    return { type: 'paragraph', tokens }
  })
})

const isModalOpen = ref(false)
const noteText = ref('')
const selectedRange = ref(null)

function handleSelection() {
  const selection = window.getSelection()
  if (selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  let selectedText = range.toString().trim()
  selectedText = selectedText.replace(/[.,!?;:()"']/g, '')

  if (selectedText.length < 2) return

  selectedRange.value = range
  noteText.value = ''
  isModalOpen.value = true
}

async function saveNote() {
  if (!noteText.value.trim()) return

  const selectedText = selectedRange.value.toString().trim().replace(/[.,!?;:()"']/g, '')
  if (!selectedText) return

  const currentFootnotes = JSON.parse(localStorage.getItem('footnotes') || '{}')
  currentFootnotes[selectedText] = noteText.value.trim()
  localStorage.setItem('footnotes', JSON.stringify(currentFootnotes))

  bumpFootnoteVersion() 

  isModalOpen.value = false
  noteText.value = ''
  selectedRange.value = null
}

function cancelNote() {
  isModalOpen.value = false
  noteText.value = ''
  selectedRange.value = null
}

onMounted(() => {
  const container = document.querySelector('.text-content')
  if (container) {
    container.addEventListener('mouseup', handleSelection)
  }

  const handleFootnoteDeleted = () => {
    bumpFootnoteVersion()
  }

  window.addEventListener('footnote-deleted', handleFootnoteDeleted)

  onUnmounted(() => {
    window.removeEventListener('footnote-deleted', handleFootnoteDeleted)
  })
})
</script>

<style scoped>
.footnote-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.7;
}

.text-content {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  position: relative;
  line-height: 1.8;
  font-size: 16px;
}

.paragraph {
  margin-bottom: 1.5rem;
  line-height: 1.7;
  font-size: 16px;
}

.footnote-textarea {
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  background-color: var(--bg-secondary);
  color: #000;
  resize: vertical;
  min-height: 80px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.btn {
  background-color: #1e90ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.btn-cancel {
  background-color: #ccc;
  color: #333;
}

.btn:hover {
  opacity: 0.9;
}
</style>