var homePlayerColor, awayPlayerColor, homePlayerStripesColor, awayPlayerStripesColor, homePlayerSleeveColor, awayPlayerSleeveColor
function getMatchJsonData() {
  fetch(
    'https://lmt.fn.sportradar.com/common/en/Etc:UTC/gismo/match_info/37368549',
  )
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      var doc1 = data['doc'][0]
      var data1 = doc1['data']
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
      if(homePlayerSleeveColor){
        document.getElementById('homePlayerLeftSleeve').setAttribute('fill', '#'+ homePlayerSleeveColor);
        document.getElementById('homePlayerRightSleeve').setAttribute('fill', '#'+ homePlayerSleeveColor);
      } else {
        document.getElementById('homePlayerLeftSleeve').setAttribute('fill', '#'+ homePlayerColor);
        document.getElementById('homePlayerRightSleeve').setAttribute('fill', '#'+ homePlayerColor);
      }
      if(awayPlayerSleeveColor){
        document.getElementById('awayPlayerLeftSleeve').setAttribute('fill', '#'+ awayPlayerSleeveColor);
        document.getElementById('awayPlayerRightSleeve').setAttribute('fill', '#'+ awayPlayerSleeveColor);
      } else {
        document.getElementById('awayPlayerLeftSleeve').setAttribute('fill', '#'+ awayPlayerColor);
        document.getElementById('awayPlayerRightSleeve').setAttribute('fill', '#'+ awayPlayerColor);
      }
      if(homePlayerLongSleeveColor){
        document.getElementById('homePlayerLeftLongSleeve').setAttribute('fill', '#'+ homePlayerLongSleeveColor);
        document.getElementById('homePlayerRightLongSleeve').setAttribute('fill', '#'+ homePlayerLongSleeveColor);
      } else {
        document.getElementById('homePlayerLeftLongSleeve').setAttribute('fill', '#'+ homePlayerColor);
        document.getElementById('homePlayerRightLongSleeve').setAttribute('fill', '#'+ homePlayerColor);
      }
      if(awayPlayerLongSleeveColor){
        document.getElementById('awayPlayerLeftLongSleeve').setAttribute('fill', '#'+ awayPlayerLongSleeveColor);
        document.getElementById('awayPlayerRightLongSleeve').setAttribute('fill', '#'+ awayPlayerLongSleeveColor);
      } else {
        document.getElementById('awayPlayerLeftLongSleeve').setAttribute('fill', '#'+ awayPlayerColor);
        document.getElementById('awayPlayerRightLongSleeve').setAttribute('fill', '#'+ awayPlayerColor);
      }
      if(homePlayerStripesColor){
        document.getElementById('homeStripes').setAttribute('fill', '#'+ homePlayerStripesColor);
      } else {
        document.getElementById('homeStripes').setAttribute('fill', '#'+ homePlayerColor);
      }
      if(awayPlayerStripesColor){
        document.getElementById('awayStripes').setAttribute('fill', '#'+ awayPlayerStripesColor);
      } else {
        document.getElementById('awayStripes').setAttribute('fill', '#'+ awayPlayerColor);
      }
    })
}
