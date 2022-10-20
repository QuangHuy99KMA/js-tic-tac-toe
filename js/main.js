import { TURN } from "./constants.js";
import {
    getCellElementList,
    getCurrentTurnElement,
    getGameStatusElement,
    getCellElementAtIdx
} from "./selectors.js";

// console.log(getCellElementList());
// console.log(getCurrentTurnElement());
// console.log(getGameStatusElement());
// console.log(getCellElementAtIdx(4));


/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill("");

function toogleTurn() {
    // toggle turn
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

    // update turn on DOM element
    const curentTurnElemnt = getCurrentTurnElement();
    if (curentTurnElemnt) {
        curentTurnElemnt.classList.remove(TURN.CIRCLE, TURN.CROSS);
        curentTurnElemnt.classList.add(currentTurn);
    }
}

function handleCellClick(cell, index) {
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    if (isClicked) return;

    // set selected cell
    cell.classList.add(currentTurn);

    //toggle turn 
    toogleTurn();

    // console.log('click', cell, index);
}

function initCellElementList() {
    const cellElementList = getCellElementList();
    cellElementList.forEach((cell, index) => {
        cell.addEventListener("click", () => handleCellClick(cell, index));
    })
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
    // bind click event for all li elements
    initCellElementList();
    // bind click event for replay button
})()