/**
 * Игра "Крестики-нолики".
 *
 */

/**
 * Отрисовка таблицы
 */
var renderTable = function() {
    document.write('<table id="game-table">');
    for (var i = 0; i < 3; i++) {
        document.write('<tr>');
        for (var j = 0; j < 3; j++) {
            document.write('<td id="cell-' + i + '-' + j +'"></td>');
        }
        document.write('</tr>');
    }
    document.write('</table>');
};
renderTable();



var stateClassCross = 'state-cross';
var stateClassZero = 'state-zero';
var lastState = 0; // 1 = cross; 2 = zero;


/**
 * Событие по клику
 */
var gameTable = document.getElementById('game-table');
var cells = gameTable.getElementsByTagName('td');
for (var i = 0; i < cells.length; i++) {
    cells[i].onmousedown = game;
}


/**
 * Сама игра
 *
 * @param event
 */
function game(event) {
    var el = this;
    var elID = el.getAttribute('id');

    // если ячейка еще не нажималась
    if (!checkState(el)) {
        if (lastState === 1) {
            el.setAttribute('class', stateClassZero);
            lastState = 2;
        } else {
            el.setAttribute('class', stateClassCross);
            lastState = 1;
        }

        // Получаем положение ячейки
        var pos = getElementPosition(elID);

        // Записываем значение в матрицу
        gameField[pos.x][pos.y] = lastState;

        // Проверяем есть ли выиграшная комбинация
        if (checkCombination(gameField)) {
            alert('Ура');
            if (lastState===1) {
                alert('Победили крестики');
            } else if (lastState===2) {
                alert('Победили нолики');
            }

        }
    }
}


/**
 * Проверка: есть состояние у ячейки
 * @param el
 * @returns {boolean}
 */
function checkState(el) {
    var stateClass = el.getAttribute('class');
    if ( stateClass === stateClassCross || stateClass === stateClassZero ) {
        return true;
    } else {
        return false;
    }
}


/**
 * Создаем пустое игровое поле
 * @type {Array}
 */
var gameField = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
];


/**
 * Проверка присутствия правильной комбинации
 * @param field
 * @type {Array}
 * @returns {boolean}
 */
function checkCombination(field) {
    var isWin = false;

    // проверка горизонтальной линии
    if ( !isWin )
        checkStraightLine(field);

    // проверка вертикальной линии
    if ( !isWin )
        checkStraightLine(field, true);

    // проверка диагональной линии
    if ( !isWin )
        checkTopLeftBottomRightLine(field);

    // проверка диагональной линии
    if ( !isWin )
        checkTopRightBottomLeftLine(field);

    /**
     * Проверка "прямых", т.е. не диагональных, линий на наличие выиграшной комбинации.
     *
     * @param field
     * @type {Array}
     * @param revers
     * @type {boolean}
     */
    function checkStraightLine(field, revers) {
        for ( var i = 0; i < 3; i++ ) {
            var firstValue = (revers) ? field[i][0] : field[0][i];
            var matchLine = false;

            for ( var j = 1; j < 3; j++ ) {
                var cellValue = (revers) ? field[i][j] : field[j][i];

                if ( cellValue !== firstValue || cellValue === 0 ) {
                    matchLine = false;
                    break;
                } else {
                    matchLine = true;
                }
            }

            if (matchLine) {
                isWin = true;
                break;
            }
        }
    }

    /**
     * Проверка диагональной линии, линии сверху слева вниз вправо.
     * Пример:
     * 100
     * 010
     * 001
     *
     * @param field
     */
    function checkTopLeftBottomRightLine(field) {
        var firstValue = field[0][0];
        var matchLine = false;

        for ( var i = 0; i < 3; i++ ) {
            if ( field[i][i] !== firstValue || field[i][i] === 0 ) {
                matchLine = false;
                break;
            } else {
                matchLine = true;
            }
        }

        if ( matchLine ) {
            isWin = true;
        }
    }

    /**
     * Проверка диагональной линии, линии сверху справа вниз влево
     * Пример:
     * 001
     * 010
     * 100
     *
     * @param field
     */
    function checkTopRightBottomLeftLine(field) {
        var firstValue = field[0][2];
        var matchLine = false;

        for ( var i = 0; i < 3; i++ ) {
            var value = field[i][2-i];
            if ( value !== firstValue || value === 0 ) {
                matchLine = false;
                break;
            } else {
                matchLine = true;
            }
        }

        if ( matchLine )
            isWin = true;
    }

    return isWin;
}


/**
 * Парсинг атрибута 'id' и нахождение положения элемента.
 * Возвращает JSON (x,y)
 * --> y
 * |
 * ˅ x
 *
 * @param id
 * @type {String}
 * @return {Object}
 */
function getElementPosition(id) {
    var myRegExp = /^cell-(\d)-(\d)$/;
    var myRegExpArray = myRegExp.exec(id);
    return {
        x: myRegExpArray[1],
        y: myRegExpArray[2]
    };
}