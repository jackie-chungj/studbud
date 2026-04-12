// Reference - learnt from = Chris (2021). stopwatch using javascript - accurate and easy. [online] dev.to. Available at: https://dev.to/chrislemus/stopwatch-using-javascript-accurate-and-easy-5ado

const swTime = document.querySelector('.stopwatch')
const swMainButton = document.querySelector('#stopwatch-main-button')
const lapButton = document.querySelector('#stopwatch-lap-button')
const clearButton = document.querySelector('#stopwatch-reset-button')
const stopwatch = { elapsedTime: 0 }

const swLapList = document.querySelector('.sw-lap-list')
const swLapsEmpty = document.querySelector('.sw-laps-empty')

let lapCount = 0

// Lap button disabled until stopwatch is running
lapButton.disabled = true

swMainButton.addEventListener('click', () => {
  if (swMainButton.innerHTML === 'Start') {
    startStopwatch()
    swMainButton.innerHTML = 'Stop'
    lapButton.disabled = false
  } else {
    stopwatch.elapsedTime += Date.now() - stopwatch.startTime
    clearInterval(stopwatch.intervalId)
    swMainButton.innerHTML = 'Start'
    lapButton.disabled = true
  }
})

lapButton.addEventListener('click', () => {
  lapCount++
  renderLap(lapCount, swTime.innerHTML)
  updateLapEmpty()
})

clearButton.addEventListener('click', () => {
  stopwatch.elapsedTime = 0
  stopwatch.startTime = Date.now()
  displayTime(0, 0, 0, 0)
  lapCount = 0
  swLapList.innerHTML = ''
  updateLapEmpty()
})

function startStopwatch() {
  stopwatch.startTime = Date.now()
  stopwatch.intervalId = setInterval(() => {
    const elapsedTime = Date.now() - stopwatch.startTime + stopwatch.elapsedTime
    const milliseconds = parseInt((elapsedTime % 1000) / 10)
    const seconds = parseInt((elapsedTime / 1000) % 60)
    const minutes = parseInt((elapsedTime / (1000 * 60)) % 60)
    const hour = parseInt((elapsedTime / (1000 * 60 * 60)) % 24)
    displayTime(hour, minutes, seconds, milliseconds)
  }, 100)
}

function displayTime(hour, minutes, seconds, milliseconds) {
  const leadZeroTime = [hour, minutes, seconds, milliseconds].map(t => t < 10 ? `0${t}` : t)
  swTime.innerHTML = leadZeroTime.join(':')
}

function updateLapEmpty() {
  swLapsEmpty.style.display = swLapList.children.length === 0 ? 'block' : 'none'
}

function renderLap(num, timeStr) {
  const li = document.createElement('li')
  li.classList.add('sw-lap-item')

  const numSpan = document.createElement('span')
  numSpan.classList.add('sw-lap-num')
  numSpan.textContent = `${num < 10 ? '0' : ''}${num}`

  const timeSpan = document.createElement('span')
  timeSpan.classList.add('sw-lap-time')
  timeSpan.textContent = timeStr

  const delBtn = document.createElement('button')
  delBtn.innerHTML = '<i class="fas fa-times"></i>'
  delBtn.classList.add('delete-btn')
  delBtn.setAttribute('title', 'Remove lap')

  delBtn.addEventListener('click', () => {
    li.remove()
    // Re-number remaining laps
    Array.from(swLapList.children).forEach((item, i) => {
      const n = i + 1
      item.querySelector('.sw-lap-num').textContent = `${n < 10 ? '0' : ''}${n}`
    })
    lapCount = swLapList.children.length
    updateLapEmpty()
  })

  li.appendChild(numSpan)
  li.appendChild(timeSpan)
  li.appendChild(delBtn)
  swLapList.appendChild(li)
}
