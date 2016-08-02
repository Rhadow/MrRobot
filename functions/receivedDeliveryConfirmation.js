'use strict';

const receivedDeliveryConfirmation = (event) => {
    const delivery = event.delivery;
    console.log(`All messages before timestamp ${new Date(delivery.watermark)} is read!`);
};

export default receivedDeliveryConfirmation;
