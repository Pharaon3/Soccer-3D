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
    'https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/match_timelinedelta/36794569',
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
      // hometeamname = 'This team name is longer than 16 characters'
      if(hometeamname.length > 16){
        teamNames['home'] = hometeamname.substr(0, 13) + '...';
      }
      if(awayteamname.length > 16){
        teamNames['away'] = awayteamname.substr(0, 13) + '...';
      }
      document.getElementById('homeTeamName').textContent = teamNames['home']
      document.getElementById('awayTeamName').textContent = teamNames['away']
      document.getElementById('fade_homeTeamName').textContent = teamNames['home']
      document.getElementById('fade_awayTeamName').textContent = teamNames['away']
      document.getElementById('period').textContent = match['status']['name']
      // Score Setting
      var result = match['result']
      if (result['home']) homeScore = result['home']
      if (result['away']) awayScore = result['away']
      // document.getElementById('score').textContent = homeScore + ':' + awayScore
      document.getElementById('score').textContent = homeScore + ' - ' + awayScore
      document.getElementById('fade_score').textContent = homeScore + ' - ' + awayScore

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

// New function added for websocket.
function handleEventData(data) {

	/*
		data.info		=> (matchinfo)
		data.match		=> match (match_timelinedelta)
		data.events		=> events (match_timelinedelta)
	*/

	console.log(data);

	if (data.info) {
		handleInfoData(data);
	}

  //var doc = data['doc'][0]
  //if (doc['_dob'] == dob) return
  //dob = doc['_dob']
  //var data_ = doc['data']
  //var match = data_['match']
  var match = data['match']

	if (match) {

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
  // hometeamname = 'This team name is longer than 16 characters'
  if(hometeamname.length > 16){
	teamNames['home'] = hometeamname.substr(0, 13) + '...';
  }
  if(awayteamname.length > 16){
	teamNames['away'] = awayteamname.substr(0, 13) + '...';
  }
  document.getElementById('homeTeamName').textContent = teamNames['home']
  document.getElementById('awayTeamName').textContent = teamNames['away']
  document.getElementById('fade_homeTeamName').textContent = teamNames['home']
  document.getElementById('fade_awayTeamName').textContent = teamNames['away']
  document.getElementById('period').textContent = match['status']['name']
  // Score Setting
  var result = match['result']
  if (result['home']) homeScore = result['home']
  if (result['away']) awayScore = result['away']
  // document.getElementById('score').textContent = homeScore + ':' + awayScore
  document.getElementById('score').textContent = homeScore + ' - ' + awayScore
  document.getElementById('fade_score').textContent = homeScore + ' - ' + awayScore
	}

  //var events = data_['events']
  var events = data['events'] || {};

  var newEvents = new Array()
  Object.values(events).forEach((event) => {
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
}

function handleInfoData(data) {
      var data1 = data.info;
      var jerseys = data1['jerseys']
      homePlayerColor = jerseys['home']['player']['base']
      awayPlayerColor = jerseys['away']['player']['base']
      homePlayerStripesColor = jerseys['home']['player']['stripes']
      awayPlayerStripesColor = jerseys['away']['player']['stripes']
      homePlayerSleeveColor = jerseys['home']['player']['sleeve']
      awayPlayerSleeveColor = jerseys['away']['player']['sleeve']
      homePlayerLongSleeveColor = jerseys['home']['player']['sleevelong']
      awayPlayerLongSleeveColor = jerseys['away']['player']['sleevelong']
      document.getElementById('homePlayerBase').setAttribute('fill', '#'+ homePlayerColor);
      document.getElementById('awayPlayerBase').setAttribute('fill', '#'+ awayPlayerColor);
      document.getElementById('fade_homePlayerBase').setAttribute('fill', '#'+ homePlayerColor);
      document.getElementById('fade_awayPlayerBase').setAttribute('fill', '#'+ awayPlayerColor);
      document.getElementById('state_homePlayerBase').setAttribute('fill', '#'+ homePlayerColor);
      document.getElementById('state_awayPlayerBase').setAttribute('fill', '#'+ awayPlayerColor);
      if(homePlayerSleeveColor){
        document.getElementById('homePlayerLeftSleeve').setAttribute('fill', '#'+ homePlayerSleeveColor);
        document.getElementById('homePlayerRightSleeve').setAttribute('fill', '#'+ homePlayerSleeveColor);
        document.getElementById('fade_homePlayerLeftSleeve').setAttribute('fill', '#'+ homePlayerSleeveColor);
        document.getElementById('fade_homePlayerRightSleeve').setAttribute('fill', '#'+ homePlayerSleeveColor);
        document.getElementById('state_homePlayerLeftSleeve').setAttribute('fill', '#'+ homePlayerSleeveColor);
        document.getElementById('state_homePlayerRightSleeve').setAttribute('fill', '#'+ homePlayerSleeveColor);
      } else {
        document.getElementById('homePlayerLeftSleeve').setAttribute('fill', '#'+ homePlayerColor);
        document.getElementById('homePlayerRightSleeve').setAttribute('fill', '#'+ homePlayerColor);
        document.getElementById('fade_homePlayerLeftSleeve').setAttribute('fill', '#'+ homePlayerColor);
        document.getElementById('fade_homePlayerRightSleeve').setAttribute('fill', '#'+ homePlayerColor);
        document.getElementById('state_homePlayerLeftSleeve').setAttribute('fill', '#'+ homePlayerColor);
        document.getElementById('state_homePlayerRightSleeve').setAttribute('fill', '#'+ homePlayerColor);
      }
      if(awayPlayerSleeveColor){
        document.getElementById('awayPlayerLeftSleeve').setAttribute('fill', '#'+ awayPlayerSleeveColor);
        document.getElementById('awayPlayerRightSleeve').setAttribute('fill', '#'+ awayPlayerSleeveColor);
        document.getElementById('fade_awayPlayerLeftSleeve').setAttribute('fill', '#'+ awayPlayerSleeveColor);
        document.getElementById('fade_awayPlayerRightSleeve').setAttribute('fill', '#'+ awayPlayerSleeveColor);
        document.getElementById('state_awayPlayerLeftSleeve').setAttribute('fill', '#'+ awayPlayerSleeveColor);
        document.getElementById('state_awayPlayerRightSleeve').setAttribute('fill', '#'+ awayPlayerSleeveColor);
      } else {
        document.getElementById('awayPlayerLeftSleeve').setAttribute('fill', '#'+ awayPlayerColor);
        document.getElementById('awayPlayerRightSleeve').setAttribute('fill', '#'+ awayPlayerColor);
        document.getElementById('fade_awayPlayerLeftSleeve').setAttribute('fill', '#'+ awayPlayerColor);
        document.getElementById('fade_awayPlayerRightSleeve').setAttribute('fill', '#'+ awayPlayerColor);
        document.getElementById('state_awayPlayerLeftSleeve').setAttribute('fill', '#'+ awayPlayerColor);
        document.getElementById('state_awayPlayerRightSleeve').setAttribute('fill', '#'+ awayPlayerColor);
      }
      if(homePlayerLongSleeveColor){
        document.getElementById('homePlayerLeftLongSleeve').setAttribute('fill', '#'+ homePlayerLongSleeveColor);
        document.getElementById('homePlayerRightLongSleeve').setAttribute('fill', '#'+ homePlayerLongSleeveColor);
        document.getElementById('fade_homePlayerLeftLongSleeve').setAttribute('fill', '#'+ homePlayerLongSleeveColor);
        document.getElementById('fade_homePlayerRightLongSleeve').setAttribute('fill', '#'+ homePlayerLongSleeveColor);
        document.getElementById('state_homePlayerLeftLongSleeve').setAttribute('fill', '#'+ homePlayerLongSleeveColor);
        document.getElementById('state_homePlayerRightLongSleeve').setAttribute('fill', '#'+ homePlayerLongSleeveColor);
      } else {
        document.getElementById('homePlayerLeftLongSleeve').setAttribute('fill', '#'+ homePlayerColor);
        document.getElementById('homePlayerRightLongSleeve').setAttribute('fill', '#'+ homePlayerColor);
        document.getElementById('fade_homePlayerLeftLongSleeve').setAttribute('fill', '#'+ homePlayerColor);
        document.getElementById('fade_homePlayerRightLongSleeve').setAttribute('fill', '#'+ homePlayerColor);
        document.getElementById('state_homePlayerLeftLongSleeve').setAttribute('fill', '#'+ homePlayerColor);
        document.getElementById('state_homePlayerRightLongSleeve').setAttribute('fill', '#'+ homePlayerColor);
      }
      if(awayPlayerLongSleeveColor){
        document.getElementById('awayPlayerLeftLongSleeve').setAttribute('fill', '#'+ awayPlayerLongSleeveColor);
        document.getElementById('awayPlayerRightLongSleeve').setAttribute('fill', '#'+ awayPlayerLongSleeveColor);
        document.getElementById('fade_awayPlayerLeftLongSleeve').setAttribute('fill', '#'+ awayPlayerLongSleeveColor);
        document.getElementById('fade_awayPlayerRightLongSleeve').setAttribute('fill', '#'+ awayPlayerLongSleeveColor);
        document.getElementById('state_awayPlayerLeftLongSleeve').setAttribute('fill', '#'+ awayPlayerLongSleeveColor);
        document.getElementById('state_awayPlayerRightLongSleeve').setAttribute('fill', '#'+ awayPlayerLongSleeveColor);
      } else {
        document.getElementById('awayPlayerLeftLongSleeve').setAttribute('fill', '#'+ awayPlayerColor);
        document.getElementById('awayPlayerRightLongSleeve').setAttribute('fill', '#'+ awayPlayerColor);
        document.getElementById('fade_awayPlayerLeftLongSleeve').setAttribute('fill', '#'+ awayPlayerColor);
        document.getElementById('fade_awayPlayerRightLongSleeve').setAttribute('fill', '#'+ awayPlayerColor);
        document.getElementById('state_awayPlayerLeftLongSleeve').setAttribute('fill', '#'+ awayPlayerColor);
        document.getElementById('state_awayPlayerRightLongSleeve').setAttribute('fill', '#'+ awayPlayerColor);
      }
      if(homePlayerStripesColor){
        document.getElementById('homeStripes').setAttribute('fill', '#'+ homePlayerStripesColor);
        document.getElementById('fade_homeStripes').setAttribute('fill', '#'+ homePlayerStripesColor);
        document.getElementById('state_homeStripes').setAttribute('fill', '#'+ homePlayerStripesColor);
      } else {
        document.getElementById('homeStripes').setAttribute('fill', '#'+ homePlayerColor);
        document.getElementById('fade_homeStripes').setAttribute('fill', '#'+ homePlayerColor);
        document.getElementById('state_homeStripes').setAttribute('fill', '#'+ homePlayerColor);
      }
      if(awayPlayerStripesColor){
        document.getElementById('awayStripes').setAttribute('fill', '#'+ awayPlayerStripesColor);
        document.getElementById('fade_awayStripes').setAttribute('fill', '#'+ awayPlayerStripesColor);
        document.getElementById('state_awayStripes').setAttribute('fill', '#'+ awayPlayerStripesColor);
      } else {
        document.getElementById('awayStripes').setAttribute('fill', '#'+ awayPlayerColor);
        document.getElementById('fade_awayStripes').setAttribute('fill', '#'+ awayPlayerColor);
        document.getElementById('state_awayStripes').setAttribute('fill', '#'+ awayPlayerColor);
      }
}



