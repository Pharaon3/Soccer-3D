var dob = 0
var gameId = 34231107
var gameState = new Array()
var lastEvents = new Array()
var awayteamname, hometeamname
var homeScore, awayScore
var teamNames = new Array()
const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b)
function getJsonData() {
  fetch(
    'https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/match_timelinedelta/37368549',
  )
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      var doc = data['doc'][0]
      if (doc['_dob'] == dob) return
      dob = doc['_dob']
      var data_ = doc['data']
      var match = data_['match']
      // Team Name Setting
      var teams = match['teams']
      var hometeam = teams['home']
      if (hometeam['name']) hometeamname = hometeam['name']
      // document.getElementById('homeNameLabel').textContent = hometeamname
      var awayteam = teams['away']
      if (awayteam['name']) awayteamname = awayteam['name']
      // document.getElementById('awayNameLabel').textContent = awayteamname
      teamNames['home'] = hometeamname;
      teamNames['away'] = awayteamname;
      document.getElementById('homeTeamName').textContent = teamNames['home']
      document.getElementById('awayTeamName').textContent = teamNames['away']
      document.getElementById('period').textContent = match['status']['name']
      // Score Setting
      var result = match['result']
      if (result['home']) homeScore = result['home']
      if (result['away']) awayScore = result['away']
      // document.getElementById('score').textContent = homeScore + ':' + awayScore
      document.getElementById('score').textContent = homeScore + ' : ' + awayScore

      var events = data_['events']
      var newEvents = new Array()
      events.forEach((event) => {
        if(event['seconds'] > 0 && timeSet == 0){
          time = event['seconds'] * 1000;
          timeSet = 1;
        }
        if (
          event['type'] != 'possession' &&
          event['type'] != 'matchsituation' &&
          event['type'] != 'coordinates' &&
          event['type'] != 'ballcoordinates' &&
          event['type'] != 'goal_kick' &&
          event['type'] != 'corner' &&
          event['type'] != 'possible_event'
        ) {
          newEvents.push(event)
        }
        if (event['type'] == 'corner') {
          if (event['side'] == 'left') {
            if (event['team'] == 'home') {
              var events1 = event;
              events1['X'] = 100
              events1['Y'] = 0
              newEvents.push(events1)
              // newEvents.push({
              //   id: event['_id'],
              //   type: event['type'],
              //   seconds: event['seconds'],
              //   X: 100,
              //   Y: 0,
              //   team: event['team'],
              //   side: event['side'],
              //   name: event['name'],
              // })
            }
            if (event['team'] == 'away') {
              var events1 = event;
              events1['X'] = 0
              events1['Y'] = 100
              newEvents.push(events1)
              // newEvents.push({
              //   id: event['_id'],
              //   type: event['type'],
              //   seconds: event['seconds'],
              //   X: 0,
              //   Y: 100,
              //   team: event['team'],
              //   side: event['side'],
              //   name: event['name'],
              // })
            }
          } else if (event['side'] == 'right') {
            if (event['team'] == 'home') {
              var events1 = event;
              events1['X'] = 100
              events1['Y'] = 100
              newEvents.push(events1)
              // newEvents.push({
              //   id: event['_id'],
              //   type: event['type'],
              //   seconds: event['seconds'],
              //   X: 100,
              //   Y: 100,
              //   team: event['team'],
              //   side: event['side'],
              //   name: event['name'],
              // })
            }
            if (event['team'] == 'away') {
              var events1 = event;
              events1['X'] = 0
              events1['Y'] = 0
              newEvents.push(events1)
              // newEvents.push({
              //   id: event['_id'],
              //   type: event['type'],
              //   seconds: event['seconds'],
              //   X: 0,
              //   Y: 0,
              //   team: event['team'],
              //   side: event['side'],
              //   name: event['name'],
              // })
            }
          } else
            newEvents.push(event)
        }
        if (event['type'] == 'goal_kick') {
          if (event['team'] == 'home') {
              var events1 = event;
              events1['X'] = 5
              events1['Y'] = 50
              newEvents.push(events1)
            // newEvents.push({
            //   id: event['_id'],
            //   type: event['type'],
            //   seconds: event['seconds'],
            //   X: 5,
            //   Y: 50,
            //   team: event['team'],
            //   name: event['name'],
            // })
          } else if (event['team'] == 'away') {
              var events1 = event;
              events1['X'] = 95
              events1['Y'] = 50
              newEvents.push(events1)
            // newEvents.push({
            //   id: event['_id'],
            //   type: event['type'],
            //   seconds: event['seconds'],
            //   X: 95,
            //   Y: 50,
            //   team: event['team'],
            //   name: event['name'],
            // })
          } else
            newEvents.push(event)
        }
        // if (event['type'] == 'goal') {
        //   if (event['team'] == 'home') {
        //       var events1 = event;
        //       events1['X'] = 100
        //       events1['Y'] = 50
        //       newEvents.push(events1)
        //     // newEvents.push({
        //     //   id: event['_id'],
        //     //   type: event['type'],
        //     //   seconds: event['seconds'],
        //     //   X: 100,
        //     //   Y: 50,
        //     //   team: event['team'],
        //     //   name: event['name'],
        //     // })
        //   } else if (event['team'] == 'away') {
        //       var events1 = event;
        //       events1['X'] = 0
        //       events1['Y'] = 50
        //       newEvents.push(events1)
        //     // newEvents.push({
        //     //   id: event['_id'],
        //     //   type: event['type'],
        //     //   seconds: event['seconds'],
        //     //   X: 0,
        //     //   Y: 50,
        //     //   team: event['team'],
        //     //   name: event['name'],
        //     // })
        //   } else
        //     newEvents.push(event)
        // }
        if (event['type'] == 'ballcoordinates') {
          var coordinates = event['coordinates']
          var tmpCoordinate = new Array()
          coordinates
            .slice()
            .reverse()
            .forEach((item) => {
              newEvents.push(item)
            })
        }
      })
      // Compare newEvents with lastEvents and push new events to gameState;
      newEvents.forEach((newEvent) => {
        var flag = 1
        lastEvents.forEach((lastEvent) => {
          if (equals(newEvent, lastEvent)) flag = 0
        })
        if (flag == 1) {
          gameState.push(newEvent)
        }
      })
      lastEvents = newEvents
    })
}
