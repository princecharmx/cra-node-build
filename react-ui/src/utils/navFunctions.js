function moveToField(e, key, navigationArr) {
  let nextItemToFocus;

  for (let i = 0; i < navigationArr.length; i++) {
    for (let j = 0; j < navigationArr[i].length; j++) {
      if (navigationArr[i][j] === key) {
        switch (e.keyCode) {
          case 13:
          case 39:
            nextItemToFocus = right(navigationArr, key, i, j);
            break;
          case 37:
            nextItemToFocus = left(navigationArr, key, i, j);
            break;
          case 38:
            nextItemToFocus = up(navigationArr, key, i, j);
            break;
          case 40:
            nextItemToFocus = down(navigationArr, key, i, j);
            break;
          default:
            break;
        }
      }
    }
  }
  return nextItemToFocus;
}

function right(navigationArr, key, i, j) {
  //right
  // locate j
  // 1. if j <= (RowLenght - 1) then focus on  InputField present at loaction navArr[i][j + 1]
  // 2. if j >  (RowLenght - 1)
  // 2.a. if i <= (ColLength - 1) then evaluate i for edge case, if less than edge case then move focus on navArr[i+1]
  // 2.b. else if i > (ColLength - 1) then move focus to navigation[i][j];
  //

  let nextItemToFocus = '';
  let arrayRowLength = navigationArr.length;
  let arrayColLength = navigationArr[i].length;

  if (j < arrayColLength - 1) {
    nextItemToFocus = navigationArr[i][j + 1];
  } else if (j >= arrayColLength - 1) {
    if (i < arrayRowLength - 1) {
      nextItemToFocus = navigationArr[i + 1][0];
    } else if (i >= arrayRowLength - 1) {
      nextItemToFocus = navigationArr[i][j];
    }
  }
  return nextItemToFocus;
}

function left(navigationArr, key, i, j) {
  //left
  //1. if j > 0 then focus on InputField present at navArr[i][j-1]
  //2. else if j == 0 then
  // 2.a. find if (i>0) then focus on inputFeild present at navArr[i-1][rowLength-1]
  //2.b. else if i == 0 then focus on inputFeild present at navArr[0][0]
  //
  //

  let nextItemToFocus = '';
  if (j > 0) {
    nextItemToFocus = navigationArr[i][j - 1];
  } else if (j === 0) {
    if (i > 0) {
      let arrayColLength = navigationArr[i - 1].length;
      nextItemToFocus = navigationArr[i - 1][arrayColLength - 1]; // :: i need prev row last ele and i is current row
    } else if (i === 0) {
      nextItemToFocus = navigationArr[i][j]; // i=j=0
    }
  }

  return nextItemToFocus;
}

function up(navigationArr, key, i, j) {
  //up
  //check for i greater than 0{
  //if( j > RowLength-1) then move foucs to inputField present on navArr[i-1][arrayRowLength-1]
  // else move focus to inputField present on navArr[i][j]
  // if i==0 fix first feild i.e if navArr[i-1][j] is undefined then focus on inputField present at navArr[0][RowLength-1]
  // else move focus on inputField present at navArr[0][j]
  //

  let nextItemToFocus = '';
  let arrayRowLength = i > 0 && navigationArr[i - 1].length; // row  length

  if (i > 0 && arrayRowLength) {
    // arrayRowLength so that it fails on edge case i.e navigationArr[i-1][arrayLength -1]
    if (j > arrayRowLength - 1) {
      nextItemToFocus = navigationArr[i - 1][arrayRowLength - 1];
    } else {
      nextItemToFocus = navigationArr[i - 1][j];
    }
  } else if (i === 0) {
    nextItemToFocus = navigationArr[i][j];
  }
  return nextItemToFocus;
}

function down(navigationArr, key, i, j) {
  // down
  // if(i< arrayColLength -1 ){
  // if(j< arrayRowLength - 1){ move focus to inputField present at navArr[i+1][j]}
  //}
  //else move focus to inputField present at navArr[i+1][arrayRowLength-1]

  let nextItemToFocus = '';
  let arrayColLength = navigationArr.length;
  let arrayRowLength = i < arrayColLength - 1 && navigationArr[i + 1].length; // row  length

  if (i < arrayColLength - 1 && arrayRowLength) {
    if (j < arrayRowLength - 1) {
      nextItemToFocus = navigationArr[i + 1][j];
    } else {
      nextItemToFocus = navigationArr[i + 1][arrayRowLength - 1];
    }
  } else if (i === arrayColLength - 1) {
    nextItemToFocus = navigationArr[i][j];
  }

  return nextItemToFocus;
}

export { moveToField };
