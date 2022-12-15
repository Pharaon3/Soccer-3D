var currentState = 0

var topLeft = 232,
  topPosition = 448
var pitchX = 710,
  pitchY = 140
var w1 = pitchX / 2,
  w2 = 486 / 2,
  hp = pitchY
var x1 = 0,
  y1 = hp / 2,
  x2 = 0,
  y2 = hp / 2
var xb = 0,
  yb = 0
var t, L, H, ll, hh, h1, k
var x = 0,
  y = mapY(0, hp / 2),
  x_1 = 0,
  y_1 = mapY(0, hp / 2),
  x_b = 0,
  y_b = mapY(0, hp / 2)
var ballRadius = 15

x_1_1 = mapX(x1, y1)
y_1_1 = mapY(x1, y1)
x_1_2 = mapX(x2, y2)
y_1_2 = mapY(x2, y2)

var time,
  timeInterval = 10
var lineX = [
  mapX(0, hp / 2) + w2 + topLeft,
  mapX(0, hp / 2) + w2 + topLeft,
  mapX(0, hp / 2) + w2 + topLeft,
  mapX(0, hp / 2) + w2 + topLeft,
]
var lineY = [
  mapY(0, hp / 2) + topPosition,
  mapY(0, hp / 2) + topPosition,
  mapY(0, hp / 2) + topPosition,
  mapY(0, hp / 2) + topPosition,
]

var timeFlag // 0: not set, 1: set
var currentTeam
var rectId, currentRectId // 0: none, 1: homeSafe, 2: homeAttack, 3: homeDangerousAttack, -3: awaySafe, -2: awayAttack, -1: awayDangerousAttack;
var timeSet

var isGoal

function countdown() {
  var interval = setInterval(function () {
    //every 10ms
    time += timeInterval
    if (Math.floor(time) % 100 == 0) {
      // every 100ms
      getJsonData()
    }
    if (currentState == 0) {
      // This is very at first. Need to initialize the state and wait.
      if (time > 60000) {
        // about 1min
        // time = 0
        //Need to show that it is faild.
      }
      if (gameState.length > 0) {
        // Need to go next
        stepInitialize()
      }
    } else {
      // Normal case
      if (Math.floor(time) % 900 == 0) {
        //every 500ms
        stepInitialize()
      }
      t += 1 / 91
      var seconds = Math.floor(time / 1000)
      var minute = Math.floor(seconds / 60)
      var second = seconds % 60
      document.getElementById('time').textContent =
        Math.floor(minute / 10) +
        '' +
        (minute % 10) +
        ':' +
        Math.floor(second / 10) +
        '' +
        (second % 10)
      ballPosition()
      drawRect()
      displayState()
      if (x2 == x1 && y2 == y1) {
        bounceBall()
      } else {
        if(gameState[currentState]['type']){
          bounceBall();
        } else {
          kickBall()
        }
      }
      drawTrack()
      showState()
    }
    
  }, timeInterval)
}
function load() {
  xb = x1 + w1
  yb = y1
  t = 0.005
  time = 0
  playMode = 0
  tmpV = true
  exceeded = true
  timeFlag = 0
  rectId = 0
  currentRectId = 0
  homeScore = 0
  awayScore = 0
  timeSet = 0;
  isGoal = 0
  getMatchJsonData()
  countdown()
}
function bounceBall() {
  tt = t
  x_1 = mapX(x, y)
  y_1 = ((y * y) / hp + y) / 2
  document
    .getElementById('ball')
    .setAttribute('x', x_b + w2 - ballRadius / 2 + topLeft)
  document
    .getElementById('ball')
    .setAttribute(
      'y',
      y_b - ballRadius + topPosition - 10 + 10 * (tt - 0.5) * (tt - 0.5) * 4,
    )
  document.getElementById('ball').setAttribute('width', ballRadius)
  document.getElementById('ball_shadow').setAttribute('cx', x_b + w2 + topLeft)
  document.getElementById('ball_shadow').setAttribute('cy', y_b + topPosition)
  document.getElementById('ball_shadow').setAttribute('rx', 10 * tt)
  document.getElementById('ball_shadow').setAttribute('ry', 5 * tt)
}
function ballPosition() {
  x = x1 + (x2 - x1) * t
  y = y1 + (y2 - y1) * t // x is (-0.5, 0.5) in square pitch
  x_1 = mapX(x, y)
  y_1 = mapY(x, y) // x_1 is in polygon pitch
  // For Draw Extra Lines Begin
  // lineX[0] = x_1_1 + w2 + topLeft
  // lineY[0] = y_1_1 + topPosition
  // For Draw Extra Lines End
  L = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
  if (L < 0.001) L = 0.001
  H = L / 8
  ll = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y))
  hh = H * (1 - (4 * (ll - L / 2) * (ll - L / 2)) / (L * L))
  h1 = ((w2 + ((w1 - w2) / hp) * y) * hh) / w1
  x_b = x_1
  y_b = y_1 - h1
  ballRadius = mapX(15, y)
  xs = x_1_1 + (x_1_2 - x_1_1) * t
  ys = y_1_1 + (y_1_2 - y_1_1) * t
}
function kickBall() {
  document
    .getElementById('ball')
    .setAttribute('x', x_b + w2 - ballRadius / 2 + topLeft)
  document
    .getElementById('ball')
    .setAttribute('y', y_b - ballRadius + topPosition)
  document.getElementById('ball').setAttribute('width', ballRadius)
  document.getElementById('ball_shadow').setAttribute('cx', x_1 + w2 + topLeft)
  document.getElementById('ball_shadow').setAttribute('cy', y_1 + topPosition)
  if (hh + H > 0) {
    document
      .getElementById('ball_shadow')
      .setAttribute('rx', ((ballRadius + 20) * H * 0.25) / (hh + H))
    document
      .getElementById('ball_shadow')
      .setAttribute('ry', ((ballRadius + 20) * H * 0.25) / (hh + H) / 2)
  } else {
    document.getElementById('ball_shadow').setAttribute('rx', 0)
    document.getElementById('ball_shadow').setAttribute('ry', 0)
  }
}
function drawTrack() {
  x_l = x_1_1 + (x_1_2 - x_1_1) * t
  y_l = y_1_1 + (y_1_2 - y_1_1) * t
  document.getElementById('ballLine1').setAttribute('x1', lineX[0])
  document.getElementById('ballLine1').setAttribute('y1', lineY[0])
  document.getElementById('ballLine1').setAttribute('x2', x_l + w2 + topLeft)
  document.getElementById('ballLine1').setAttribute('y2', y_l + topPosition)

  document.getElementById('ballLine2').setAttribute('x1', lineX[1])
  document.getElementById('ballLine2').setAttribute('y1', lineY[1])
  document.getElementById('ballLine2').setAttribute('x2', lineX[0])
  document.getElementById('ballLine2').setAttribute('y2', lineY[0])

  document.getElementById('ballLine3').setAttribute('x1', lineX[2])
  document.getElementById('ballLine3').setAttribute('y1', lineY[2])
  document.getElementById('ballLine3').setAttribute('x2', lineX[1])
  document.getElementById('ballLine3').setAttribute('y2', lineY[1])

  document.getElementById('ballLine4').setAttribute('x1', lineX[3])
  document.getElementById('ballLine4').setAttribute('y1', lineY[3])
  document.getElementById('ballLine4').setAttribute('x2', lineX[2])
  document.getElementById('ballLine4').setAttribute('y2', lineY[2])

  document.getElementById('TractDot1').setAttribute('cx', lineX[0])
  document.getElementById('TractDot1').setAttribute('cy', lineY[0])
  document.getElementById('TractDot2').setAttribute('cx', lineX[1])
  document.getElementById('TractDot2').setAttribute('cy', lineY[1])
  document.getElementById('TractDot3').setAttribute('cx', lineX[2])
  document.getElementById('TractDot3').setAttribute('cy', lineY[2])
}
function resetTrack() {
  lineX[3] = x_1_1 + w2 + topLeft
  lineX[2] = x_1_1 + w2 + topLeft
  lineX[1] = x_1_1 + w2 + topLeft
  lineX[0] = x_1_1 + w2 + topLeft
  lineY[3] = y_1_1 + topPosition
  lineY[2] = y_1_1 + topPosition
  lineY[1] = y_1_1 + topPosition
  lineY[0] = y_1_1 + topPosition
}
function stepInitialize() {
  // For setting time
  if (timeFlag == 0) {
    if (currentState > 0) {
      if (gameState[currentState]['seconds'] > -1) {
        // time = gameState[currentState]['seconds'] * 1000
        timeFlag = 1
      }
    }
  }
  // For initializing ball position
  t = 0
  x1 = x2
  y1 = y2
  if (currentState < gameState.length - 1) {
    currentState++
    if (gameState[currentState]['X'] > -1) {
      x2 = ((gameState[currentState]['X'] - 50) * w1) / 50
      y2 = (gameState[currentState]['Y'] * hp) / 100
      if (gameState[currentState]['type']) {
        x1 = x2
        y1 = y2
        x_1_1 = mapX(x1, y1)
        y_1_1 = mapY(x1, y1)
        x_1_2 = mapX(x2, y2)
        y_1_2 = mapY(x2, y2)
        resetTrack()
      } else {
        x_1_1 = mapX(x1, y1)
        y_1_1 = mapY(x1, y1)
        x_1_2 = mapX(x2, y2)
        y_1_2 = mapY(x2, y2)
        lineX[3] = lineX[2]
        lineY[3] = lineY[2]
        lineX[2] = lineX[1]
        lineY[2] = lineY[1]
        lineX[1] = lineX[0]
        lineY[1] = lineY[0]
        lineX[0] = x_1_1 + w2 + topLeft
        lineY[0] = y_1_1 + topPosition
      }
    } else {
      x2 = x1
      y2 = y1
      x_1_1 = mapX(x1, y1)
      y_1_1 = mapY(x1, y1)
      x_1_2 = mapX(x2, y2)
      y_1_2 = mapY(x2, y2)
      resetTrack()
    }
  } else {
    x1 = x2
    y1 = y2
    x_1_1 = mapX(x1, y1)
    y_1_1 = mapY(x1, y1)
    x_1_2 = mapX(x2, y2)
    y_1_2 = mapY(x2, y2)
  }
  // For setting currentTeam
  if (gameState[currentState]['team'] != currentTeam) {
    currentTeam = gameState[currentState]['team']
    resetTrack()
  }
  rectId = currentRectId
  if(gameState[currentState]['type'] == 'goal')isGoal ++;
  else isGoal = 0;
}
function drawRect() {
  rt = t * 2
  if (rt > 1) rt = 1
  if (gameState[currentState]['team'] == 'home') {
    document.getElementById('awayStatePolygon').style.fill = 'url(#none)'
    if ((x2 * 50) / w1 + 50 < 50) {
      if (rectId == 0 || rectId == 1) {
        document.getElementById('homeStatePolygon').points[1].x = 440
        document.getElementById('homeStatePolygon').points[2].x = 480
        document.getElementById('homeStatePolygon').points[3].x = 424
      }
      if (rectId == 2) {
        document.getElementById('homeStatePolygon').points[1].x =
          510 + (440 - 510) * rt
        document.getElementById('homeStatePolygon').points[2].x =
          550 + (480 - 550) * rt
        document.getElementById('homeStatePolygon').points[3].x =
          526 + (424 - 526) * rt
      }
      if (rectId == 3) {
        document.getElementById('homeStatePolygon').points[1].x =
          614 + (440 - 614) * rt
        document.getElementById('homeStatePolygon').points[2].x =
          700 + (480 - 700) * rt
        document.getElementById('homeStatePolygon').points[3].x =
          678 + (424 - 678) * rt
      }
      if (rectId < 0) {
        document.getElementById('homeStatePolygon').points[1].x =
          232 + (440 - 232) * rt
        document.getElementById('homeStatePolygon').points[2].x =
          180 + (480 - 180) * rt
        document.getElementById('homeStatePolygon').points[3].x =
          120 + (424 - 120) * rt
      }
      currentRectId = 1
    } else if ((x2 * 50) / w1 + 50 < 75) {
      document.getElementById('homeStatePolygon').style.fill =
        'url(#homeAttack)'
      currentRectId = 2
      if (rectId == 0 || rectId == 2) {
        document.getElementById('homeStatePolygon').points[1].x = 510
        document.getElementById('homeStatePolygon').points[2].x = 550
        document.getElementById('homeStatePolygon').points[3].x = 526
      }
      if (rectId == 1) {
        document.getElementById('homeStatePolygon').points[1].x =
          440 + (510 - 440) * rt
        document.getElementById('homeStatePolygon').points[2].x =
          480 + (550 - 480) * rt
        document.getElementById('homeStatePolygon').points[3].x =
          424 + (526 - 424) * rt
      }
      if (rectId == 3) {
        document.getElementById('homeStatePolygon').points[1].x =
          614 + (510 - 614) * rt
        document.getElementById('homeStatePolygon').points[2].x =
          700 + (550 - 700) * rt
        document.getElementById('homeStatePolygon').points[3].x =
          678 + (526 - 678) * rt
      }
      if (rectId < 0) {
        document.getElementById('homeStatePolygon').points[1].x =
          232 + (510 - 232) * rt
        document.getElementById('homeStatePolygon').points[2].x =
          180 + (550 - 180) * rt
        document.getElementById('homeStatePolygon').points[3].x =
          120 + (526 - 120) * rt
      }
    } else {
      currentRectId = 3
      if (rectId == 0 || rectId == 3) {
        document.getElementById('homeStatePolygon').style.fill =
          'url(#homeDangerousAttack)'
        document.getElementById('homeStatePolygon').points[1].x = 614
        document.getElementById('homeStatePolygon').points[2].x = 700
        document.getElementById('homeStatePolygon').points[3].x = 678
      }
      if (rectId == 1) {
        document.getElementById('homeStatePolygon').style.fill =
          'url(#homeDangerousAttack)'
        document.getElementById('homeStatePolygon').points[1].x =
          440 + (614 - 440) * rt
        document.getElementById('homeStatePolygon').points[2].x =
          480 + (700 - 480) * rt
        document.getElementById('homeStatePolygon').points[3].x =
          424 + (678 - 424) * rt
      }
      if (rectId == 2) {
        document.getElementById('homeStatePolygon').style.fill =
          'url(#homeDangerousAttack)'
        document.getElementById('homeStatePolygon').points[1].x =
          510 + (614 - 510) * rt
        document.getElementById('homeStatePolygon').points[2].x =
          550 + (700 - 550) * rt
        document.getElementById('homeStatePolygon').points[3].x =
          526 + (678 - 526) * rt
      }
      if (rectId < 0) {
        document.getElementById('homeStatePolygon').style.fill =
          'url(#homeDangerousAttack)'
        document.getElementById('homeStatePolygon').points[1].x =
          232 + (614 - 232) * rt
        document.getElementById('homeStatePolygon').points[2].x =
          180 + (700 - 180) * rt
        document.getElementById('homeStatePolygon').points[3].x =
          120 + (678 - 120) * rt
      }
    }
  } else {
    document.getElementById('homeStatePolygon').style.fill = 'url(#none)'
    if ((x2 * 50) / w1 + 50 < 25) {
      currentRectId = -1
      if (rectId == 0 || rectId == -1) {
        document.getElementById('awayStatePolygon').style.fill =
          'url(#awayDangerousAttack)'
        document.getElementById('awayStatePolygon').points[1].x = 336
        document.getElementById('awayStatePolygon').points[0].x = 250
        document.getElementById('awayStatePolygon').points[4].x = 272
      }
      if (rectId == -2) {
        document.getElementById('awayStatePolygon').style.fill =
          'url(#awayDangerousAttack)'
        document.getElementById('awayStatePolygon').points[1].x =
          440 + (336 - 440) * rt
        document.getElementById('awayStatePolygon').points[0].x =
          400 + (250 - 400) * rt
        document.getElementById('awayStatePolygon').points[4].x =
          424 + (272 - 424) * rt
      }
      if (rectId == -3) {
        document.getElementById('awayStatePolygon').style.fill =
          'url(#awayDangerousAttack)'
        document.getElementById('awayStatePolygon').points[1].x =
          510 + (336 - 510) * rt
        document.getElementById('awayStatePolygon').points[0].x =
          470 + (250 - 470) * rt
        document.getElementById('awayStatePolygon').points[4].x =
          526 + (272 - 526) * rt
      }
      if (rectId > 0) {
        document.getElementById('awayStatePolygon').style.fill =
          'url(#awayDangerousAttack)'
        document.getElementById('awayStatePolygon').points[1].x =
          718 + (336 - 718) * rt
        document.getElementById('awayStatePolygon').points[0].x =
          775 + (250 - 775) * rt
        document.getElementById('awayStatePolygon').points[4].x =
          830 + (272 - 830) * rt
      }
    } else if ((x2 * 50) / w1 + 50 < 50) {
      currentRectId = -2
      if (rectId == 0 || rectId == -2) {
        document.getElementById('awayStatePolygon').style.fill =
          'url(#awayAttack)'
        document.getElementById('awayStatePolygon').points[1].x = 440
        document.getElementById('awayStatePolygon').points[0].x = 400
        document.getElementById('awayStatePolygon').points[4].x = 424
      }
      if (rectId == -1) {
        document.getElementById('awayStatePolygon').style.fill =
          'url(#awayAttack)'
        document.getElementById('awayStatePolygon').points[1].x =
          336 + (440 - 336) * rt
        document.getElementById('awayStatePolygon').points[0].x =
          250 + (400 - 250) * rt
        document.getElementById('awayStatePolygon').points[4].x =
          272 + (424 - 272) * rt
      }
      if (rectId == -3) {
        document.getElementById('awayStatePolygon').style.fill =
          'url(#awayAttack)'
        document.getElementById('awayStatePolygon').points[1].x =
          510 + (440 - 510) * rt
        document.getElementById('awayStatePolygon').points[0].x =
          470 + (400 - 470) * rt
        document.getElementById('awayStatePolygon').points[4].x =
          526 + (424 - 526) * rt
      }
      if (rectId > 0) {
        document.getElementById('awayStatePolygon').style.fill =
          'url(#awayAttack)'
        document.getElementById('awayStatePolygon').points[1].x =
          718 + (440 - 718) * rt
        document.getElementById('awayStatePolygon').points[0].x =
          775 + (400 - 775) * rt
        document.getElementById('awayStatePolygon').points[4].x =
          830 + (424 - 830) * rt
      }
    } else {
      currentRectId = -3
      if (rectId == 0 || rectId == -3) {
        document.getElementById('awayStatePolygon').style.fill =
          'url(#awaySafe)'
        document.getElementById('awayStatePolygon').points[1].x = 510
        document.getElementById('awayStatePolygon').points[0].x = 470
        document.getElementById('awayStatePolygon').points[4].x = 526
      }
      if (rectId == -2) {
        document.getElementById('awayStatePolygon').style.fill =
          'url(#awaySafe)'
        document.getElementById('awayStatePolygon').points[1].x =
          440 + (510 - 440) * rt
        document.getElementById('awayStatePolygon').points[0].x =
          400 + (470 - 400) * rt
        document.getElementById('awayStatePolygon').points[4].x =
          424 + (526 - 424) * rt
      }
      if (rectId == -1) {
        document.getElementById('awayStatePolygon').style.fill =
          'url(#awaySafe)'
        document.getElementById('awayStatePolygon').points[1].x =
          336 + (510 - 336) * rt
        document.getElementById('awayStatePolygon').points[0].x =
          250 + (470 - 250) * rt
        document.getElementById('awayStatePolygon').points[4].x =
          272 + (526 - 272) * rt
      }
      if (rectId > 0) {
        document.getElementById('awayStatePolygon').style.fill =
          'url(#awaySafe)'
        document.getElementById('awayStatePolygon').points[1].x =
          718 + (510 - 718) * rt
        document.getElementById('awayStatePolygon').points[0].x =
          775 + (470 - 775) * rt
        document.getElementById('awayStatePolygon').points[4].x =
          830 + (526 - 830) * rt
      }
    }
  }
}
function showState() {
  document.getElementById('actionBoard').setAttribute('width', 0)
  document.getElementById('actionBoard').setAttribute('height', 0)
  document.getElementById('stateBoardLine').setAttribute('stroke-opacity', 0)
  document.getElementById('ballState').textContent = ''
  document.getElementById('holder').textContent = ''

  // Goal
  document.getElementById('score-fade-out').setAttribute('opacity', 0);

  // Substitution
  document.getElementById('substitutionOut').setAttribute('fill-opacity', 0)
  document.getElementById('substitutionIn').setAttribute('fill-opacity', 0)
  document.getElementById('substitutionOutPlayer').textContent = ''
  document.getElementById('substitutionInPlayer').textContent = ''

  document.getElementById('bottom_rect').setAttribute('fill-opacity', 0)
  document.getElementById('bottom_text').textContent = ''
  document.getElementById('bottom2_text').textContent = ''
  document.getElementById('center_rect').setAttribute('fill-opacity', 0)
  document.getElementById('center_text').textContent = ''
  document.getElementById('offsideRect').points[0].x = 232
  document.getElementById('offsideRect').points[1].x = 718
  document.getElementById('offsideRect').points[2].x = 830
  document.getElementById('offsideRect').points[3].x = 120
  document.getElementById('offsideRect').setAttribute('fill-opacity', 0)
  document.getElementById('awayKickPolygon').style.fill = 'url(#none)'
  document.getElementById('homeKickPolygon').style.fill = 'url(#none)'


  if(gameState[currentState]['type']){
    remove()
    if(gameState[currentState]['team'])showAction()
    if(gameState[currentState]['name'] == 'Yellow card'){
      showAction()
      document.getElementById('ballState').textContent = gameState[currentState]['name']
      document.getElementById('holder').textContent = teamNames[gameState[currentState]['team']].toUpperCase()
      var rectWidth = document.getElementById('ballState').getBBox().width;
      rectWidth = max(rectWidth, document.getElementById('holder').getBBox().width) + 20
      document.getElementById('actionBoard').setAttribute('width', rectWidth + 50)
      document.getElementById('actionBoard').setAttribute('height', 50)
      document.getElementById('actionBoard').setAttribute('x', x_b + w2 + topLeft - rectWidth - 10 - 50)
      document.getElementById('actionBoard').setAttribute('y', y_b + topPosition - 50 - 10)

      document.getElementById('cardBoard').setAttribute('width', 30)
      document.getElementById('cardBoard').setAttribute('height', 50)
      document.getElementById('cardBoard').setAttribute('x', x_b + w2 + topLeft - rectWidth - 10)
      document.getElementById('cardBoard').setAttribute('y', y_b + topPosition - 50 - 10)
      document.getElementById('cardBoard').style.fill = 'url(#ff0)'

      document.getElementById('holder').setAttribute('x', x_b + w2 + topLeft - 20 - 50)
      document.getElementById('holder').setAttribute('y', y_b + topPosition - 12 - 5)
      document.getElementById('ballState').setAttribute('x', x_b + w2 + topLeft - 20 - 50)
      document.getElementById('ballState').setAttribute('y', y_b + topPosition - 37 - 5)
      document.getElementById('stateBoardLine').setAttribute('stroke-opacity', 0.9)
      document.getElementById('stateBoardLine').setAttribute('x1', x_b + w2 + topLeft - 15)
      document.getElementById('stateBoardLine').setAttribute('x2', x_b + w2 + topLeft - 15)
      document.getElementById('stateBoardLine').setAttribute('y1', y_b + topPosition - 50 - 5)
      document.getElementById('stateBoardLine').setAttribute('y2', y_b + topPosition - 15)
      // document.getElementById('stateBoardLine').setAttribute('stroke-opacity', 0)
      // document.getElementById('bottom_rect').setAttribute('fill-opacity', 0.3)
      // document.getElementById('bottom_rect').setAttribute('height', 70)
      // document.getElementById('bottom_text').textContent = teamNames[gameState[currentState]['team']]
      // document.getElementById('bottom2_text').textContent = gameState[currentState]['player']['name']
    }
    if(gameState[currentState]['name'] == 'Red card'){
      showAction()
      document.getElementById('ballState').textContent = gameState[currentState]['name']
      document.getElementById('holder').textContent = teamNames[gameState[currentState]['team']].toUpperCase()
      var rectWidth = document.getElementById('ballState').getBBox().width;
      rectWidth = max(rectWidth, document.getElementById('holder').getBBox().width) + 20
      document.getElementById('actionBoard').setAttribute('width', rectWidth + 50)
      document.getElementById('actionBoard').setAttribute('height', 50)
      document.getElementById('actionBoard').setAttribute('x', x_b + w2 + topLeft - rectWidth - 10 - 50)
      document.getElementById('actionBoard').setAttribute('y', y_b + topPosition - 50 - 10)

      document.getElementById('cardBoard').setAttribute('width', 30)
      document.getElementById('cardBoard').setAttribute('height', 50)
      document.getElementById('cardBoard').setAttribute('x', x_b + w2 + topLeft - rectWidth - 10)
      document.getElementById('cardBoard').setAttribute('y', y_b + topPosition - 50 - 10)
      document.getElementById('cardBoard').style.fill = 'url(#f00)'

      document.getElementById('holder').setAttribute('x', x_b + w2 + topLeft - 20 - 50)
      document.getElementById('holder').setAttribute('y', y_b + topPosition - 12 - 5)
      document.getElementById('ballState').setAttribute('x', x_b + w2 + topLeft - 20 - 50)
      document.getElementById('ballState').setAttribute('y', y_b + topPosition - 37 - 5)
      document.getElementById('stateBoardLine').setAttribute('stroke-opacity', 0.9)
      document.getElementById('stateBoardLine').setAttribute('x1', x_b + w2 + topLeft - 15)
      document.getElementById('stateBoardLine').setAttribute('x2', x_b + w2 + topLeft - 15)
      document.getElementById('stateBoardLine').setAttribute('y1', y_b + topPosition - 50 - 5)
      document.getElementById('stateBoardLine').setAttribute('y2', y_b + topPosition - 15)
      // document.getElementById('redCard').style.display = 'block'
      // document.getElementById('bottom_rect').setAttribute('fill-opacity', 0.3)
      // document.getElementById('bottom_rect').setAttribute('height', 70)
      // document.getElementById('bottom_text').textContent = teamNames[gameState[currentState]['team']]
      // document.getElementById('bottom2_text').textContent = gameState[currentState]['player']['name']
    }
    if(gameState[currentState]['type'] == 'goal'){
      showAction()
      if(isGoal == 1){
        document.getElementById('score-fade-out').setAttribute('opacity', 1);
        if(t < 0.5){
          if(gameState[currentState]['team'] == 'home') document.getElementById('fade_score').textContent = homeScore - 1 + ' - ' + awayScore
          if(gameState[currentState]['team'] == 'away') document.getElementById('fade_score').textContent = homeScore + ' - ' + awayScore - 1
        }
      }
      if(isGoal == 2){
        document.getElementById('score-fade-out').setAttribute('opacity', 1 - t);
      }
    }      
    if(gameState[currentState]['type'] == 'substitution'){
      document.getElementById('substitutionOut').setAttribute('fill-opacity', 0.5)
      document.getElementById('substitutionIn').setAttribute('fill-opacity', 0.5)
      if(gameState[currentState]['playerin']['name']) document.getElementById('substitutionInPlayer').textContent = gameState[currentState]['playerin']['name'] + ' IN'
      if(gameState[currentState]['playerout']['name']) document.getElementById('substitutionOutPlayer').textContent = 'OUT ' + gameState[currentState]['playerout']['name']
    }
    if(gameState[currentState]['type'] == 'throwin'){
     showAction()
      // document.getElementById('center_rect').setAttribute('fill-opacity', 0.3)
      // document.getElementById('center_text').textContent = gameState[currentState]['name']
      // document.getElementById('bottom_rect').setAttribute('fill-opacity', 0.3)
      // document.getElementById('bottom_rect').setAttribute('height', 40)
      // document.getElementById('bottom_text').textContent = teamNames[gameState[currentState]['team']]

      if (gameState[currentState]['team'] == 'home') {
        document.getElementById('homeKickPolygon').style.fill = 'url(#homeKick)'
        if(y2 < hp * 0.3 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeTopKick)'
        if(y2 > hp * 0.7 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeBottomKick)'
        document.getElementById('homeKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('homeKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('homeState').textContent = gameState[currentState]['name']
      } else {
        document.getElementById('awayKickPolygon').style.fill = 'url(#awayKick)'
        if(y2 < hp * 0.3 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayTopKick)'
        if(y2 > hp * 0.7 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayBottomKick)'
        document.getElementById('awayKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('awayKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('awayState').textContent = gameState[currentState]['name']
      }
    }
    if(gameState[currentState]['type'] == 'freekick'){
      showAction()
      if (gameState[currentState]['team'] == 'home') {
        document.getElementById('homeKickPolygon').style.fill = 'url(#homeKick)'
        if(y2 < hp * 0.3 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeTopKick)'
        if(y2 > hp * 0.7 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeBottomKick)'
        document.getElementById('homeKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('homeKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('homeState').textContent = gameState[currentState]['name']
      } else {
        document.getElementById('awayKickPolygon').style.fill = 'url(#awayKick)'
        if(y2 < hp * 0.3 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayTopKick)'
        if(y2 > hp * 0.7 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayBottomKick)'
        document.getElementById('awayKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('awayKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('awayState').textContent = gameState[currentState]['name']
      }
    }
    if(gameState[currentState]['type'] == 'shotofftarget'){
      showAction()
      // document.getElementById('center_rect').setAttribute('fill-opacity', 0.3)
      // document.getElementById('center_text').textContent = gameState[currentState]['name']
      // document.getElementById('bottom_rect').setAttribute('fill-opacity', 0.3)
      // document.getElementById('bottom_rect').setAttribute('height', 40)
      // document.getElementById('bottom_text').textContent = teamNames[gameState[currentState]['team']]

      if (gameState[currentState]['team'] == 'home') {
        document.getElementById('homeKickPolygon').style.fill = 'url(#homeKick)'
        if(y2 < hp * 0.3 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeTopKick)'
        if(y2 > hp * 0.7 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeBottomKick)'
        document.getElementById('homeKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('homeKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('homeState').textContent = gameState[currentState]['name']
      } else {
        document.getElementById('awayKickPolygon').style.fill = 'url(#awayKick)'
        if(y2 < hp * 0.3 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayTopKick)'
        if(y2 > hp * 0.7 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayBottomKick)'
        document.getElementById('awayKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('awayKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('awayState').textContent = gameState[currentState]['name']
      }
    }
    if(gameState[currentState]['type'] == 'shotontarget'){
      showAction()
      if (gameState[currentState]['team'] == 'home') {
        document.getElementById('homeKickPolygon').style.fill = 'url(#homeKick)'
        if(y2 < hp * 0.3 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeTopKick)'
        if(y2 > hp * 0.7 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeBottomKick)'
        document.getElementById('homeKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('homeKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('homeState').textContent = gameState[currentState]['name']
      } else {
        document.getElementById('awayKickPolygon').style.fill = 'url(#awayKick)'
        if(y2 < hp * 0.3 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayTopKick)'
        if(y2 > hp * 0.7 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayBottomKick)'
        document.getElementById('awayKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('awayKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('awayState').textContent = gameState[currentState]['name']
      }
    }
    if(gameState[currentState]['type'] == 'goal_kick'){
      showAction()
      if (gameState[currentState]['team'] == 'home') {
        document.getElementById('homeKickPolygon').style.fill = 'url(#homeKick)'
        if(y2 < hp * 0.3 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeTopKick)'
        if(y2 > hp * 0.7 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeBottomKick)'
        document.getElementById('homeKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('homeKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('homeState').textContent = gameState[currentState]['name']
      } else {
        document.getElementById('awayKickPolygon').style.fill = 'url(#awayKick)'
        if(y2 < hp * 0.3 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayTopKick)'
        if(y2 > hp * 0.7 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayBottomKick)'
        document.getElementById('awayKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('awayKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('awayState').textContent = gameState[currentState]['name']
      }
    }
    if(gameState[currentState]['type'] == 'match_ended'){
      document.getElementById('center_rect').setAttribute('fill-opacity', 0.3)
      document.getElementById('center_text').textContent = gameState[currentState]['name']
    }
    if(gameState[currentState]['type'] == 'periodstart'){
      document.getElementById('center_rect').setAttribute('fill-opacity', 0.3)
      document.getElementById('center_text').textContent = gameState[currentState]['name']
      // 
    }
    if(gameState[currentState]['type'] == 'periodscore'){
      document.getElementById('center_rect').setAttribute('fill-opacity', 0.3)
      document.getElementById('center_text').textContent = gameState[currentState]['name']
      // 
    }
    if(gameState[currentState]['type'] == 'corner'){
      showAction()
    }
    if(gameState[currentState]['type'] == 'offside'){
      showAction()
      if(gameState[currentState]['team'] == 'home'){
        document.getElementById('offsideRect').points[1].x = ((x2 * 50) / w1 + 50) * (718 - 232) / 100 + 232
        document.getElementById('offsideRect').points[2].x = ((x2 * 50) / w1 + 50) * (830 - 120) / 100 + 120
        document.getElementById('offsideRect').setAttribute('fill-opacity', 0.5)
      } 
      else {
        document.getElementById('offsideRect').points[0].x = ((x2 * 50) / w1 + 50) * (718 - 232) / 100 + 232
        document.getElementById('offsideRect').points[3].x = ((x2 * 50) / w1 + 50) * (830 - 120) / 100 + 120
        document.getElementById('offsideRect').setAttribute('fill-opacity', 0.5)
      }
    }
    if(gameState[currentState]['type'] == 'injurytimeshown'){
      document.getElementById('center_rect').setAttribute('fill-opacity', 0.3)
      document.getElementById('center_text').textContent = 'Injury time: ' + gameState[currentState]['minutes'] + 'mins'
    }
    if(gameState[currentState]['type'] == 'injury'){
      document.getElementById('center_rect').setAttribute('fill-opacity', 0.3)
      document.getElementById('center_text').textContent = gameState[currentState]['name']
      document.getElementById('bottom_rect').setAttribute('fill-opacity', 0.3)
      document.getElementById('bottom_rect').setAttribute('height', 40)
      document.getElementById('bottom_text').textContent = teamNames[gameState[currentState]['team']]
      if(gameState[currentState]['player']['name']){
        document.getElementById('bottom_rect').setAttribute('height', 70)
        document.getElementById('bottom2_text').textContent = gameState[currentState]['player']['name']
      }
    }
  }
  else {
    // document.getElementById('homeStateLabels').style.display = 'block'
    // document.getElementById('awayStateLabels').style.display = 'block'
  }
}
function remove() {
  document.getElementById('homeStatePolygon').style.fill = 'url(#none)'
  document.getElementById('awayStatePolygon').style.fill = 'url(#none)'
  document.getElementById('homeKickPolygon').style.fill = 'url(#none)'
  document.getElementById('awayKickPolygon').style.fill = 'url(#none)'
  document.getElementById('homeStateLabels').style.display = 'none'
  document.getElementById('awayStateLabels').style.display = 'none'
  document.getElementById('goalImage').style.display = 'none'
  document.getElementById('injury').style.display = 'none'
  document.getElementById('yellowCard').style.display = 'none'
  document.getElementById('redCard').style.display = 'none'
  document.getElementById('stateBoard').setAttribute('fill-opacity', 0)

      document.getElementById('cardBoard').setAttribute('width', 0)
      document.getElementById('cardBoard').setAttribute('height', 0)
      document.getElementById('cardBoard').setAttribute('x', 10)
      document.getElementById('cardBoard').setAttribute('y', 10)
      document.getElementById('cardBoard').style.fill = 'url(#f00)'
}
function max(a, b) {
  if(a > b) return a;
  return b;
}
function mapX(x11, y11) {
  x_11 = ((w2 + ((w1 - w2) * y11) / hp) * x11) / w1
  return x_11
}
function mapY(x11, y11) {
  y_11 = ((y11 * y11) / hp + 1.5 * y11) / 2.5
  return y_11
}
function showAction() {
  document.getElementById('ballState').textContent = gameState[currentState]['name']
  document.getElementById('holder').textContent = teamNames[gameState[currentState]['team']].toUpperCase()
  var rectWidth = document.getElementById('ballState').getBBox().width;
  rectWidth = max(rectWidth, document.getElementById('holder').getBBox().width) + 20
  document.getElementById('actionBoard').setAttribute('width', rectWidth)
  document.getElementById('actionBoard').setAttribute('height', 50)
  document.getElementById('actionBoard').setAttribute('x', x_b + w2 + topLeft - rectWidth - 10)
  document.getElementById('actionBoard').setAttribute('y', y_b + topPosition - 50 - 10)
  document.getElementById('holder').setAttribute('text-anchor', 'end')
  document.getElementById('ballState').setAttribute('text-anchor', 'end')
  document.getElementById('holder').setAttribute('x', x_b + w2 + topLeft - 20)
  document.getElementById('holder').setAttribute('y', y_b + topPosition - 12 - 5)
  document.getElementById('ballState').setAttribute('x', x_b + w2 + topLeft - 20)
  document.getElementById('ballState').setAttribute('y', y_b + topPosition - 37 - 5)
  document.getElementById('stateBoardLine').setAttribute('stroke-opacity', 0.9)
  document.getElementById('stateBoardLine').setAttribute('x1', x_b + w2 + topLeft - 15)
  document.getElementById('stateBoardLine').setAttribute('x2', x_b + w2 + topLeft - 15)
  document.getElementById('stateBoardLine').setAttribute('y1', y_b + topPosition - 50 - 5)
  document.getElementById('stateBoardLine').setAttribute('y2', y_b + topPosition - 15)
  if(gameState[currentState]['team'] == 'away'){
    document.getElementById('actionBoard').setAttribute('x', x_b + w2 + topLeft + 10)
    document.getElementById('holder').setAttribute('text-anchor', 'start')
    document.getElementById('ballState').setAttribute('text-anchor', 'start')
    document.getElementById('holder').setAttribute('x', x_b + w2 + topLeft + 20)
    document.getElementById('ballState').setAttribute('x', x_b + w2 + topLeft + 20)
    document.getElementById('stateBoardLine').setAttribute('stroke-opacity', 0.9)
    document.getElementById('stateBoardLine').setAttribute('x1', x_b + w2 + topLeft + 15)
    document.getElementById('stateBoardLine').setAttribute('x2', x_b + w2 + topLeft + 15)
  }  
}
function displayState() {
  var statePositionX, statePositionY
  document.getElementById('stateLabels').style.display = 'block'
  document.getElementById('teamName').textContent = teamNames[gameState[currentState]['team']].toUpperCase()
  if ((y2 * 100) / hp < 30) {
    statePositionY = 500
  } else if ((y2 * 100) / hp < 70) {
    statePositionY = 540
  } else {
    statePositionY = 500
  }
  if(gameState[currentState]['team'] == 'home'){
    document.getElementById('state').setAttribute('text-anchor', 'end')
    document.getElementById('teamName').setAttribute('text-anchor', 'end')
    document.getElementById('stateLine').setAttribute('x1', '-10')
    document.getElementById('stateLine').setAttribute('x2', '-10')
    document.getElementById('state').setAttribute('x', '-15')
    document.getElementById('teamName').setAttribute('x', '-15')
    if ((x2 * 50) / w1 + 50 < 50) {
      document.getElementById('state').textContent = 'Ball Safe'
      statePositionX = 350
    } else if ((x2 * 50) / w1 + 50 < 75) {
      document.getElementById('state').textContent = 'Attacking'
      statePositionX = 550
    } else {
      document.getElementById('state').textContent = 'Dangerous Attack'
      statePositionX = 700
    }
  }
  else {
    document.getElementById('state').setAttribute('text-anchor', 'start')
    document.getElementById('teamName').setAttribute('text-anchor', 'start')
    document.getElementById('stateLine').setAttribute('x1', '10')
    document.getElementById('stateLine').setAttribute('x2', '10')
    document.getElementById('state').setAttribute('x', '15')
    document.getElementById('teamName').setAttribute('x', '15')
    document.getElementById('state').textContent = 'Ball Safe'
    statePositionX = 700
    if ((x2 * 50) / w1 + 50 < 50) {
      document.getElementById('state').textContent = 'Attacking'
      statePositionX = 550
    } 
    if ((x2 * 50) / w1 + 50 < 25) {
      document.getElementById('state').textContent = 'Dangerous Attack'
      statePositionX = 350
    }
  }
  document.getElementById('stateLabels').setAttribute('transform', 'translate(' + statePositionX + ',' + statePositionY + ')');
}