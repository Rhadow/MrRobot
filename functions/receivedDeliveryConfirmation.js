'use strict';

const receivedDeliveryConfirmation = (event) => {
    const delivery = event.delivery;
    console.log(`All messages before timestamp ${delivery.watermark} is read!`);
};

module.exports = receivedDeliveryConfirmation;
