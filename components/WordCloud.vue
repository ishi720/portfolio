<template>
  <div ref="container" class="wordcloud-container">
    <canvas ref="canvasRef" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import WordCloud from 'wordcloud'

interface WordData {
  text: string
  size: number
}

interface Props {
  words: WordData[]
  width?: number
  height?: number
  fontFamily?: string
  minFontSize?: number
  maxFontSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 500,
  fontFamily: 'Poppins, sans-serif',
  minFontSize: 12,
  maxFontSize: 80
})

const container = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// カラーパレット
const colors = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
  '#008080', '#e6beff', '#9a6324', '#800000', '#aaffc3',
  '#808000', '#ffd8b1', '#000075', '#808080', '#ff6b6b',
  '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8',
  '#a29bfe', '#6c5ce7', '#00b894', '#e17055', '#0984e3'
]

const renderCloud = () => {
  if (!canvasRef.value || props.words.length === 0) return

  const maxCount = Math.max(...props.words.map(w => w.size))
  const minCount = Math.min(...props.words.map(w => w.size))

  // サイズを正規化
  const wordList: [string, number][] = props.words.map((w, i) => {
    const normalizedSize = ((w.size - minCount) / (maxCount - minCount)) * (props.maxFontSize - props.minFontSize) + props.minFontSize
    return [w.text, Math.round(normalizedSize)]
  })

  let colorIndex = 0

  WordCloud(canvasRef.value, {
    list: wordList,
    fontFamily: props.fontFamily,
    fontWeight: 'bold',
    color: () => {
      const color = colors[colorIndex % colors.length]
      colorIndex++
      return color
    },
    rotateRatio: 0.5, //回転する単語の割合
    rotationSteps: 10, // 回転角度のステップ数
    backgroundColor: 'transparent', // 背景色
    gridSize: 4, // 配置グリッドのサイズ
    weightFactor: 1.2, //フォントサイズの倍率
    shuffle: true, // 単語の配置順をシャッフルするか
    shape: 'circle', // 配置の形状
    ellipticity: 0.65, // 楕円率
    shrinkToFit: false
  })
}

onMounted(() => {
  nextTick(() => {
    if (props.words.length > 0) {
      renderCloud()
    }
  })
})

watch(() => props.words, (newWords) => {
  if (newWords.length > 0) {
    nextTick(() => {
      renderCloud()
    })
  }
}, { deep: true })
</script>

<style scoped>
.wordcloud-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wordcloud-container canvas {
  max-width: 100%;
  height: auto;
}
</style>