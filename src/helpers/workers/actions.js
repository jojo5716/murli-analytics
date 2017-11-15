module.exports = {
    saveChangeCurrencyAction,
    saveAddRoomAction
};

function saveChangeCurrencyAction(currentCurrencyActions, currencyActionValue) {
    const newCurrencyActions = Object.assign({}, currentCurrencyActions);

    // Currency action data
    const lastCurrencySelected = currencyActionValue.lastCurrencySelected;
    const newCurrencyCode = currencyActionValue.newCurrencyCode;
    const newCurrencyConversion = currencyActionValue.newCurrencyConversion.replaceAll('.', '#');

    if (!newCurrencyActions[lastCurrencySelected]) {
        newCurrencyActions[lastCurrencySelected] = {};
    }

    if (!newCurrencyActions[lastCurrencySelected][newCurrencyCode]) {
        newCurrencyActions[lastCurrencySelected][newCurrencyCode] = {};
    }

    if (!newCurrencyActions[lastCurrencySelected][newCurrencyCode][newCurrencyConversion]) {
        newCurrencyActions[lastCurrencySelected][newCurrencyCode][newCurrencyConversion] = 0;
    }

    newCurrencyActions[lastCurrencySelected][newCurrencyCode][newCurrencyConversion] += 1;

    return newCurrencyActions;
}


function saveAddRoomAction(currentRoomActions, roomAction) {
    const newRoomActions = Object.assign({}, currentRoomActions);

    const hotelCode = roomAction.hotelCode;
    const roomCode = roomAction.roomCode;
    const boardCode = roomAction.boardCode;
    const rateCode = roomAction.rateCode;
    const occupancyCode = roomAction.occupancyCode;
    const childAges = (roomAction.childAges.length > 0) ? roomAction.childAges : 'No ages';
    const currencyCode = roomAction.currencyCode;
    const price = String(roomAction.price).replaceAll('.', '#');

    if (!newRoomActions[hotelCode]) {
        newRoomActions[hotelCode] = {}
    }

    if (!newRoomActions[hotelCode][roomCode]) {
        newRoomActions[hotelCode][roomCode] = {}
    }

    if (!newRoomActions[hotelCode][roomCode][boardCode]) {
        newRoomActions[hotelCode][roomCode][boardCode] = {}
    }

    if (!newRoomActions[hotelCode][roomCode][boardCode][rateCode]) {
        newRoomActions[hotelCode][roomCode][boardCode][rateCode] = {}
    }

    if (!newRoomActions[hotelCode][roomCode][boardCode][rateCode][occupancyCode]) {
        newRoomActions[hotelCode][roomCode][boardCode][rateCode][occupancyCode] = {}
    }

    if (!newRoomActions[hotelCode][roomCode][boardCode][rateCode][occupancyCode][childAges]) {
        newRoomActions[hotelCode][roomCode][boardCode][rateCode][occupancyCode][childAges] = {}
    }

    if (!newRoomActions[hotelCode][roomCode][boardCode][rateCode][occupancyCode][childAges][currencyCode]) {
        newRoomActions[hotelCode][roomCode][boardCode][rateCode][occupancyCode][childAges][currencyCode] = {}
    }

    if (!newRoomActions[hotelCode][roomCode][boardCode][rateCode][occupancyCode][childAges][currencyCode][price]) {
        newRoomActions[hotelCode][roomCode][boardCode][rateCode][occupancyCode][childAges][currencyCode][price] = 0;
    }

    newRoomActions[hotelCode][roomCode][boardCode][rateCode][occupancyCode][childAges][currencyCode][price] += 1;

    return newRoomActions;
}
