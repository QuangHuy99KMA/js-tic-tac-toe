import { TURN, CELL_VALUE, GAME_STATUS } from "./constants.js";
import {
    getCellElementList,
    getCurrentTurnElement,
    getGameStatusElement,
    getCellElementAtIdx,
    getReplayButtonElement
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";

// console.log(checkGameStatus(["X", "", "X", "X", "O", "X", "O", "X", "O"]));

// console.log(getCellElementList());
// console.log(getCurrentTurnElement());
// console.log(getGameStatusElement());
// console.log(getCellElementAtIdx(4));


/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function toogleTurn() {
    // toggle turn
    currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
        currentTurnElement.classList.add(currentTurn);
    }
}

function updateGameStatus(newGameStatus) {
    gameStatus = newGameStatus;

    const gameStatusElement = getGameStatusElement();
    if (gameStatusElement) gameStatusElement.textContent = newGameStatus;
}

function showReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.add("show");
}

function hideReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.remove("show");
}

function highlightWinCell(winPositions) {
    if (!Array.isArray(winPositions) || winPositions.length != 3) {
        throw new Error('Invalid win positions');
    };

    for (const position of winPositions) {
        const cell = getCellElementAtIdx(position);
        if (cell) cell.classList.add('win');
    }
}

function handleCellClick(cell, index) {
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    const isEndGame = gameStatus != GAME_STATUS.PLAYING;
    if (isClicked || isEndGame) return;

    // set selected cell
    cell.classList.add(currentTurn);

    //update cellValue
    cellValues[index] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    //toggle turn 
    toogleTurn();

    // check game status
    const game = checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.ENDED: {
            updateGameStatus(game.status);
            showReplayButton();
            break;
        }

        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN: {
            updateGameStatus(game.status);
            showReplayButton();
            highlightWinCell(game.winPositions);
            break;
        }

        default:
    }
}

function initCellElementList() {
    const cellElementList = getCellElementList();
    cellElementList.forEach((cell, index) => {
        cell.addEventListener("click", () => handleCellClick(cell, index));
    })
}

function resetGame() {
    // reset temp global values
    currentTurn = TURN.CROSS;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(() => '');

    // reset dom elements: reset game status, currentTurn, gameBroad, Replay Button
    updateGameStatus(GAME_STATUS.PLAYING);

    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
        currentTurnElement.classList.add(TURN.CROSS);
    }

    const cellElementList = getCellElementList();
    for (const cellElement of cellElementList) {
        cellElement.className = "";
    }

    hideReplayButton();
}

function initReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) {
        replayButton.addEventListener("click", resetGame);
    }
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
    initReplayButton();
})()