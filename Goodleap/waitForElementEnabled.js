/**
 * This is only one function within a page that holds common functions that are used within multiple pages. 
 * Goodleap was very collaborative, so I didn't write entire files, but rather functions within the files.
 * This code will check for whether or not an element on the page given by a locator is enabled. 
*/


async waitForElemEnabled(locator, bufferTime = 0, timeoutMs = 10000, intervalMs = 1000) {
    console.table('inside waitForElemEnabled...');
    locator = locator.bind(this);
    const element = await locator();
    await element.waitForEnabled({
        timeout: timeoutMs,
        reverse: false, // Set this to true if checking that element is NOT enabled
        timeoutMsg: 'Element is not enabled',
        interval: intervalMs
    });
    await global.wait(bufferTime);
}