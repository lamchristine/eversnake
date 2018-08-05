window.onload = function() {
  var snakeArr = [];
  var snakeHeadCoord;
  var appleId;
  var appleCoord;
  var blacklist = []; //to store all cells that are already taken
  var rockArr = [];
  var gridHidden = []; //to store ids of out of bound cells


  function setBoard(rows, columns) {
    var row;
    var colmIdArr = [];

    for (let i = rows; i >= 0; i--) {
      let rowId = "row-" + i;
      row = document.createElement('div');
      row.setAttribute('id', rowId);
      row.setAttribute('class', 'row');
      document.getElementById('board').appendChild(row);
      for (let j = 0; j < columns; j++) {
        let boardId = j + '-' + i;
        let boardCell = document.createElement('div');
        boardCell.setAttribute('id', boardId);
        boardCell.classList.add('grid');
        row.appendChild(boardCell);
      }
    }

    //hide first and last row
    var row17 = document.getElementById("row-17").children;
    var row0 = document.getElementById("row-0").children;

    for (let i = 0; i < row17.length; i++) {
      row17[i].classList.add('hide');
      blacklist.push(row17[i].id);
      gridHidden.push(row17[i].id);
    }
    for (let i = 0; i < row0.length; i++) {
      row0[i].classList.add('hide');
      blacklist.push(row0[i].id);
      gridHidden.push(row0[i].id);
    }

    //generate ids for first colm
    for (let i = 1; i < rows; i++) {
      colmIdArr.push('0-' + i);
    }
    //generate ids for last colm
    for (let i = 1; i < rows; i++) {
      colmIdArr.push('21-' + i);
    }
    //hide last column and add to blacklist
    colmIdArr.forEach(function (colmId) {
      document.getElementById(colmId).classList.add('hide');
      blacklist.push(colmId);
      gridHidden.push(colmId);
    });
  }

  function setRocks(numOfRocks) {
    for (let i = 0; i < numOfRocks; i++) {
      generateRock();
    }
  }

  function generateRock() {
    var rockId1, rockId2, rockId3, rockId4;
    var tempRockArr = [];

    do {
      let rockCord = getRandomInt();
      rockId1 = rockCord[0] + '-' + rockCord[1];
      rockId2 = rockCord[0] + '-' + (rockCord[1] + 1);
      rockId3 = (rockCord[0] + 1) + '-' + (rockCord[1] + 1);
      rockId4 = (rockCord[0] + 1) + '-' + rockCord[1];
      tempRockArr.push(rockId1,rockId2,rockId3,rockId4);
    } while ( tempRockArr.some(rock => blacklist.includes(rock)) )

    document.getElementById(rockId1).classList.add('rock');
    document.getElementById(rockId2).classList.add('rock');
    document.getElementById(rockId3).classList.add('rock');
    document.getElementById(rockId4).classList.add('rock');
    blacklist.push(rockId1,rockId2,rockId3,rockId4);
    rockArr.push(rockId1,rockId2,rockId3,rockId4);
  }

  function setSnake() {
    snakeHeadCoord = getRandomInt(1, 20, 1, 16);
    var snakeHeadId = snakeHeadCoord[0] + '-' + snakeHeadCoord[1];
    snakeArr.push(snakeHeadId);
    document.getElementById(snakeHeadId).classList.add('head');
    setSnakeTail();
  }

  function setSnakeTail() {
    var snakeTailId;

    do {
      let snakeHeadX, snakeHeadY, snakeTailX, snakeTailY;
      let snakeTailDirection = getTailDirection(1, 4); //1 being up, 2 being right, etc clock wise;

      switch(snakeTailDirection) {
        case 1: //tail 'up' of head
          snakeTailX = snakeHeadCoord[0];
          snakeTailY = snakeHeadCoord[1] + 1;
          break;
        case 2: //tail 'right' of head
          snakeTailX = snakeHeadCoord[0] + 1;
          snakeTailY = snakeHeadCoord[1];
          break;
        case 3: //tail 'down' of head
          snakeTailX = snakeHeadCoord[0];
          snakeTailY = snakeHeadCoord[1] - 1;
          break;
        case 4: //tail 'left' of head
          snakeTailX = snakeHeadCoord[0] - 1;
          snakeTailY = snakeHeadCoord[1];
          break;
      }
      snakeTailId = snakeTailX + '-' + snakeTailY;
    } while ( blacklist.includes(snakeTailId) );
    document.getElementById(snakeTailId).classList.add('tail');
    snakeArr.push(snakeTailId);
  }

  function setApple() {
    do {
      appleCoord = getRandomInt(1, 20, 1, 16);
      appleId = appleCoord[0] + '-' + appleCoord[1];
    } while ( blacklist.includes(appleId) || snakeArr.includes(appleId) );
    document.getElementById(appleId).classList.add('apple');
  }

  function getRandomInt(minX=1, maxX=19, minY=1, maxY=15) {
    var gridIdX, gridIdY, gridId;
    do {
        gridIdX = Math.floor(Math.random() * (maxX - minX + 1) + minX);
        gridIdY = Math.floor(Math.random() * (maxY - minY + 1) + minY);
        gridId = gridIdX + '-' + gridIdY;
    } while (blacklist.indexOf(gridId) > 0);
    return [gridIdX, gridIdY];
  }

  function getTailDirection(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  document.onkeydown = function(e) {
    var tempNewHeadId;
    switch (e.keyCode) {
      case 37:
        tempNewHeadId = snakeHeadCoord[0] - 1 + '-' + snakeHeadCoord[1];
        if (tempNewHeadId === snakeArr[1]) { //if new head location is equal to the adjacent tail, invalid move
          alert('Uh oh, invalid move. Snake cannot move backwards.');
        } else {
          //set snake head cord with new cord
          snakeHeadCoord = [snakeHeadCoord[0] - 1, snakeHeadCoord[1]];
          moveSnake(tempNewHeadId);
        }
        break;
      case 38:
        tempNewHeadId = snakeHeadCoord[0] + '-' + (snakeHeadCoord[1] + 1);
        if (tempNewHeadId === snakeArr[1]) {
          alert('Uh oh, invalid move. Snake cannot move backwards.');
        } else {
          snakeHeadCoord = [snakeHeadCoord[0], snakeHeadCoord[1] + 1];
          moveSnake(tempNewHeadId);
        }
        break;
      case 39:
        tempNewHeadId = (snakeHeadCoord[0] + 1) + '-' + snakeHeadCoord[1];
        if (tempNewHeadId === snakeArr[1]) {
          alert('Uh oh, invalid move. Snake cannot move backwards.');
        } else {
          snakeHeadCoord = [snakeHeadCoord[0] + 1, snakeHeadCoord[1]];
          moveSnake(tempNewHeadId);
        }
        break;
      case 40:
        tempNewHeadId = snakeHeadCoord[0] + '-' + (snakeHeadCoord[1] - 1);
        if (tempNewHeadId === snakeArr[1]) {
          alert('Uh oh, invalid move. Snake cannot move backwards.');
        } else {
          snakeHeadCoord = [snakeHeadCoord[0], snakeHeadCoord[1] - 1];
          moveSnake(tempNewHeadId);
        }
        break;
    }
  };

  function moveSnake(tempNewHeadId) {
    //remove all snake class
    document.getElementById(snakeArr[0]).classList.remove('head');
    for (var i = 1; i < snakeArr.length; i++) {
      document.getElementById(snakeArr[i]).classList.remove('tail');
    }

    //holding old snake array
    let oldSnakeArr = []
    snakeArr.forEach(function (snake) {
      oldSnakeArr.push(snake);
    });

    //create new snake array
    snakeArr.unshift(tempNewHeadId);
    snakeArr.pop();

    let snakeTailIdArr = oldSnakeArr.slice(1);
    //check to see if snake hits anything
    if ( snakeArr.some(snake => blacklist.includes(snake)) ) {
      alert('Whoops, you just hit a rock or went out of bounds! Game Over!');
      restartGame();
    } else if( snakeTailIdArr.includes(tempNewHeadId) ) {
      alert('Ouch, you just tried to eat your own tail. Game Over!');
      restartGame();
    } else {
      //check to see if snake has eaten apple
      if ( snakeArr.includes(appleId) ) {
        document.getElementById(appleId).classList.remove('apple');
        let newTail = oldSnakeArr[oldSnakeArr.length - 1]; //old snake segment will now be new snake segment
        snakeArr.push(newTail); //adding new segment to snake array
        //remove apple and set again
        appleId = '';
        appleCoord = [];
        setApple();
      }
      buildSnake();
    }
  }

  function restartGame() {
    //remove all class
    rockArr.forEach(function (rockId) {
      document.getElementById(rockId).classList.remove('rock');
    });
    document.getElementById(snakeArr[0]).classList.remove('head');
    for (let i = 1; i < snakeArr.length; i++) {
      document.getElementById(snakeArr[i]).classList.remove('tail');
    }
    document.getElementById(appleId).classList.remove('apple');
    //resent blacklist to only containing hidden grid
    blacklist = blacklist.filter(function(item) {
      return gridHidden.includes(item);
    });
    //reset snake array
    snakeArr = [];

    setRocks(3);
    setSnake();
    setApple();
  }

  function buildSnake() {
    document.getElementById(snakeArr[0]).classList.add('head');
    for (let i = 1; i < snakeArr.length; i++) {
      document.getElementById(snakeArr[i]).classList.add('tail');
    }
  }

  setBoard(17, 22);
  setRocks(3);
  setSnake();
  setApple();
};
