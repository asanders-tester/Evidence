/**
 * This is only one function within a page that holds common functions that are used within multiple pages. 
 * Goodleap was very collaborative, so I didn't write entire files, but rather functions within the files.
 * This code will press enter on a mobile keypad which is sometimes necessary in order to close the keypad or 
 * continue to the next page.
*/


 async pressEnterOnKeypad() {
    await this.client.pressKeyCode(66);
}