<template>
  <Transition>
    <div class="message" v-if="message">
      {{ message }}
      <div class="pad-10">
        <a style="color: white" v-if="grid" target="_blank" :href="defLink">Définition</a>
        <pre v-if="grid">{{ grid }}</pre>
      </div>
    </div>
  </Transition>

  <teleport to='#headerContent' >
    <div class="pad-10" style="color: white">Mode aléatoire</div> <Toggle @isInfinite="changeMode" />
    <img src="/reload.png" class="reload" @click="() => resetState(true)">
    <router-link to="/score"><img src="/leader.png" class="leader"></router-link>
  </teleport>


    <p style="color:white;text-align: center;">Pseudo : {{ username }}</p>
  
  
  <div id="board">
    <div
      :key="`row_${index}`"
      v-for="(row, index) in board"
      :class="[
        'row',
        shakeRowIndex === index && 'shake',
        success && currentRowIndex === index && 'jump'
      ]">
      <div
        :key="`tile_${index}`"
        v-for="(tile, index) in row"
        :class="['tile', tile.letter && 'filled', tile.state && 'revealed']">
        <div class="front" style="color: white" :style="{ transitionDelay: `${index * tileDelay}ms` }">
          {{ tile.letter }}
        </div>
        <div
          :class="['back', tile.state]"
          :style="{
            transitionDelay: `${index * tileDelay}ms`,
            animationDelay: `${index * 100}ms`
          }"
        >
          {{ tile.letter }}
        </div>
      </div>
    </div>
  </div>
  <Keyboard @key="onKey" :letter-states="letterStates" />
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import {WordsManipulation} from '../models/wordsManipulation'
import Keyboard from './Keyboard.vue'
import {icons, LetterState, LocalStorageKey, Score} from '../models/types'
import Toggle from './Toggle.vue';
import {LocalStorageManipulation} from "../models/localStorageManipulation";
import ScoreManipulation from "../models/scoreManipulation";
import axios from 'axios';

const wordsManipulation = new WordsManipulation()
const localStorageManipulation = new LocalStorageManipulation()
const scoreManipulation = new ScoreManipulation()

// Get word of the day
let answer = $ref('')
let defLink = $computed(() => `https://fr.wikipedia.org/wiki/${answer}`)

let tileDelay = $computed(() => {
  if(answer.length == 5){
    return 300;
  } else if (answer.length == 6){
    return 200;
  } else {
    return 150;
  }
})

// Board state. Each tile is represented as { letter, state }
let board = $ref(Array.from({ length: 6 }, () =>
  Array.from({ length: answer.length }, () => ({
    letter: '',
    state: LetterState.INITIAL
  }))
))

// Current active row.
let currentRowIndex = $ref(0)
const currentRow = $computed(() => board[currentRowIndex])
const isEmptyRow = $computed(() => currentRow.findIndex((it:any) => !it.letter) == 1)

// Feedback state: message and shake
let message = $ref('')
let username = $ref('MataRed')
let grid = $ref('')
let shakeRowIndex = $ref(-1)
let success = $ref(false)

// Game Mode (Infinite or classic)
let isInfinite = $ref(false)

// Keep track of revealed letters for the virtual keyboard
let letterStates: Record<string, LetterState> = $ref({})

function changeMode(newState: boolean){
  isInfinite = newState
  resetState(false)
}

function resetState(force: boolean = false){
  // Try to restore the last state
  if(!force){
    restoreState()
  }

  if(answer == "" || force){
    // Generate a new board if no answer is present or if it's a reset
    generateNewBoard()
  }

  allowInput = true
  currentRowIndex = board.findIndex((it: any) => it[1].letter == '') // Find the first row with empty word since we resume the state
  message = ""
  grid = ""
  username = new String(localStorage.getItem('username')).toString();
  shakeRowIndex = -1
  success = false
  letterStates = {}

  if(currentRowIndex == -1){
    currentRowIndex = 0;
  }

  saveState() // Save the current state as the last one
  fillFirstLetter() // Fill the first letter to help a bit
}

function generateNewBoard(){
  answer = wordsManipulation.getNextWord(isInfinite)
  board = Array.from({ length: 6 }, () =>
    Array.from({ length: answer.length }, () => ({
      letter: '',
      state: LetterState.INITIAL
    }))
  )
}

function saveState(){
  localStorageManipulation.put(LocalStorageKey.ANSWER, answer, true)
  localStorageManipulation.put(LocalStorageKey.BOARD, board)
  localStorageManipulation.put(LocalStorageKey.LETTER_STATE, letterStates)
}

function restoreState(){
  if(localStorageManipulation.has(LocalStorageKey.BOARD)){
    board = localStorageManipulation.get(LocalStorageKey.BOARD)
  }

  answer = localStorageManipulation.get(LocalStorageKey.ANSWER, '', true)

  if(localStorageManipulation.has(LocalStorageKey.LETTER_STATE)){
    letterStates = localStorageManipulation.get(LocalStorageKey.LETTER_STATE)
  }
}

function fillFirstLetter(){
  // Init first letter like Sutom
  if(board){
    board[currentRowIndex][0].letter = answer[0]
    board[currentRowIndex][0].state = LetterState.CORRECT
  }

  saveState()
}

// Handle keyboard input.
let allowInput = true
const onKeyup = (e: KeyboardEvent) => onKey(e.key)
window.addEventListener('keyup', onKeyup)
onUnmounted(() => {
  window.removeEventListener('keyup', onKeyup)
})

function onKey(key: string) {
  if (!allowInput) return
  if (/^[a-zA-Z]$/.test(key)) {
    fillTile(key.toLowerCase())
  } else if (key === 'Suppr.' || key === 'Backspace') {
    clearTile()
  } else if (key === 'Entrer' || key === 'Enter') {
    completeRow()
  }
}

function fillTile(letter: string) {
  // Ignore entry if the user enter the same letter as the first correct one
  if(isEmptyRow && currentRow[0].letter == letter){
    return;
  }

  // Fill the next available letter
  for (const tile of currentRow) {
    if (!tile.letter) {
      tile.letter = letter
      break
    }
  }
}

function clearTile() {
  for (const tile of [...currentRow].reverse()) {
    if (tile.letter) {
      tile.letter = ''
      tile.state = LetterState.INITIAL
      break
    }
  }
}

function completeRow() {
  saveState()

  if (currentRow.every((tile: { letter: any; }) => tile.letter)) {
    const guess = currentRow.map((tile: { letter: any; }) => tile.letter).join('')
    if (!wordsManipulation.allWords.find(it => it.normalize("NFD").replace(/[\u0300-\u036f]/g, "") == guess) && guess !== answer) {
      shake()
      showMessage(`Non présent dans la liste de mots`)
      return
    }

    const answerLetters: (string | null)[] = answer.split('')
    // first pass: mark correct ones
    currentRow.forEach((tile: { letter: string; state: LetterState; }, i: number) => {
      if (answerLetters[i] === tile.letter) {
        tile.state = letterStates[tile.letter] = LetterState.CORRECT
        answerLetters[i] = null
      }
    })
    // second pass: mark the present
    currentRow.forEach((tile: { state: LetterState; letter: string; }) => {
      if (!tile.state && answerLetters.includes(tile.letter)) {
        tile.state = LetterState.PRESENT
        answerLetters[answerLetters.indexOf(tile.letter)] = null
        if (!letterStates[tile.letter]) {
          letterStates[tile.letter] = LetterState.PRESENT
        }
      }
    })
    // 3rd pass: mark absent
    currentRow.forEach((tile: { state: LetterState; letter: string|number; }) => {
      if (!tile.state) {
        tile.state = LetterState.ABSENT
        if (!letterStates[tile.letter]) {
          letterStates[tile.letter] = LetterState.ABSENT
        }
      }
    })

    allowInput = false
    if (currentRow.every((tile: { state: LetterState; }) => tile.state === LetterState.CORRECT)) {
      // yay!
      setTimeout(() => {
        saveResult()
        grid = genResultGrid()
        showMessage(
          ['Génial', 'Magnifique', 'Impressionnant', 'Splendide', 'Super', 'Ouf'][currentRowIndex],
          -1
        )
        success = true
        axios.get("https://192.168.42.12/api/playerAddGame.php",{ params: { username: username } } )
      }, 1600)
    } else if (currentRowIndex < board.length - 1) {
      // go the next row
      currentRowIndex++
      setTimeout(() => {
        allowInput = true
        fillFirstLetter()
      }, 1600)
    } else {
      // game over :(
      setTimeout(() => {
        grid = genResultGrid()
        showMessage(answer.toUpperCase(), -1)
      }, 1600)
    }
  } else {
    shake()
    showMessage('Pas assez de lettres')
  }
}

function saveResult(){
  scoreManipulation.put(currentRowIndex)
}

function showMessage(msg: string, time = 1000) {
  message = msg
  if (time > 0) {
    setTimeout(() => {
      message = ''
    }, time)
  }
}

function shake() {
  shakeRowIndex = currentRowIndex
  setTimeout(() => {
    shakeRowIndex = -1
  }, 1000)
}

function genResultGrid(): string {
  return board
    .slice(0, currentRowIndex + 1)
    .map((row) => row.map((tile) => icons[tile.state]).join(''))
    .join('\n')
}
</script>

<style scoped>
.source{
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
    text-align: center;

}

#board {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 5px;
  padding: 10px;
  box-sizing: border-box;
  --height: min(420px, calc(var(--vh, 100vh) - 370px));
  height: var(--height);
  width: min(350px, calc(var(--height) / 6 * 5));
  margin: 0px auto;
}
.message {
  text-align: center;
  position: absolute;
  left: 50%;
  top: 80px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.85);
  padding: 16px 20px;
  z-index: 2;
  border-radius: 4px;
  transform: translateX(-50%);
  transition: opacity 0.3s ease-out;
  font-weight: 600;
}
.message.v-leave-to {
  opacity: 0;
}

.message > a:active {
  color: white;
}

.row {
  display: flex;
}
.tile {
  width: 100%;
  font-size: 2rem;
  line-height: 2rem;
  font-weight: bold;
  vertical-align: middle;
  text-transform: uppercase;
  user-select: none;
  position: relative;
  margin: 3px;
}
.tile.filled {
  animation: zoom 0.2s;
}
.tile .front,
.tile .back {
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.tile .front {
  border: 2px solid #d3d6da;
}
.tile.filled .front {
  border-color: #999;
}
.tile .back {
  transform: rotateX(180deg);
}
.tile.revealed .front {
  transform: rotateX(180deg);
}
.tile.revealed .back {
  transform: rotateX(0deg);
}

@keyframes zoom {
  0% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0% {
    transform: translate(1px);
  }
  10% {
    transform: translate(-2px);
  }
  20% {
    transform: translate(2px);
  }
  30% {
    transform: translate(-2px);
  }
  40% {
    transform: translate(2px);
  }
  50% {
    transform: translate(-2px);
  }
  60% {
    transform: translate(2px);
  }
  70% {
    transform: translate(-2px);
  }
  80% {
    transform: translate(2px);
  }
  90% {
    transform: translate(-2px);
  }
  100% {
    transform: translate(1px);
  }
}

.jump .tile .back {
  animation: jump 0.5s;
}

@keyframes jump {
  0% {
    transform: translateY(0px);
  }
  20% {
    transform: translateY(5px);
  }
  60% {
    transform: translateY(-25px);
  }
  90% {
    transform: translateY(3px);
  }
  100% {
    transform: translateY(0px);
  }
}

@media (max-height: 680px) {
  .tile {
    font-size: 3vh;
  }
}
</style>
