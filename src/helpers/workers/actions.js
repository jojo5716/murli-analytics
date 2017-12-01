const objectTools = require('../../utilities/objects');


module.exports = {
    saveChangeCurrencyAction,
    saveRoomActions,
    saveDeletePacksAction
};

function saveChangeCurrencyAction(currentCurrencyActions, currencyActionValue) {
    const newCurrencyActions = Object.assign({}, currentCurrencyActions);

    // Currency action data
    const lastCurrencySelected = currencyActionValue.lastCurrencySelected;
    const newCurrencyCode = currencyActionValue.newCurrencyCode;
    const newCurrencyConversion = currencyActionValue.newCurrencyConversion.replaceAll('.', '#');

    const keyPath = [
        lastCurrencySelected,
        newCurrencyCode,
        newCurrencyConversion
    ];

    const currencyCounts = objectTools.getValueFromNestedObject(newCurrencyActions, keyPath, 0);

    return objectTools.createNestedObject(newCurrencyActions, keyPath, currencyCounts + 1);
}

function saveRoomActions(currentRoomActions, roomAction) {
    const newRoomActions = Object.assign({}, currentRoomActions);

    const hotelCode = roomAction.hotelCode;
    const roomCode = roomAction.roomCode;
    const boardCode = roomAction.boardCode;
    const rateCode = roomAction.rateCode;
    const occupancyCode = roomAction.occupancyCode;
    const childAges = (roomAction.childAges.length > 0) ? roomAction.childAges : 'No ages';
    const currencyCode = roomAction.currencyCode;
    const price = parseFloat(roomAction.price).toFixed(2).replaceAll('.', '#');

    const keyPath = [
        hotelCode,
        roomCode,
        boardCode,
        rateCode,
        occupancyCode,
        childAges,
        currencyCode,
        price
    ];

    const deleteRoomsCount = objectTools.getValueFromNestedObject(newRoomActions, keyPath, 0);

    return objectTools.createNestedObject(newRoomActions, keyPath, deleteRoomsCount + 1);

}

function saveDeletePacksAction(currentPackActions, packAction) {
    const newPackActions = Object.assign({}, currentPackActions);
    const hotelCode = packAction.hotelCode;
    const packName = packAction.packName.replaceAll('.', '#');
    const optionPackName = packAction.optionPackName.replaceAll('.', '#');
    const currencyCode = packAction.currencyCode;
    const price = parseFloat(packAction.price).toFixed(2).replaceAll('.', '#');

    const keyPath = [
        hotelCode,
        packName,
        optionPackName,
        currencyCode,
        price
    ];

    const deletePacksCount = objectTools.getValueFromNestedObject(newPackActions, keyPath, 0);

    return objectTools.createNestedObject(newPackActions, keyPath, deletePacksCount + 1);
}