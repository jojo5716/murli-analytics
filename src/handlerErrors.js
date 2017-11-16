
const Raven = require('raven');

if (process.env.PLATFORM_ENV !== 'development') {
    Raven.config('https://7b643b05433743a0a419685a349eface:30e70947497243f48acba3322b9ad5a4@sentry.io/245193').install();
}

function sendErrorToSentry(err) {
    console.log(err);
    if (process.env.PLATFORM_ENV !== 'development') {
        Raven.captureException(err);
    }
}

process.on('uncaughtException',sendErrorToSentry);

process.on('unhandledRejection', sendErrorToSentry);

