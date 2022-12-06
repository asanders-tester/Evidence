/**
 * This is only one function within a page that enters all of the information for the borrower. Goodleap was very
 * collaborative, so I didn't write entire files, but rather functions within the files.
 * This code will select a specific date of birth on a mobile date picker. Initially we were just using the
 * pre-populated date that appeared which was Jan. 1, 1970. 
 * 
 * I only worked on the Android portion of this, I believe either Janis Rancourt or Kyle Musler wrote the iOS portion.
 */


async enterDateOfBirth(dob) {
    // Android will use the default date of January 1, 1970
    if (this.platform === 'android') {
        await global.wait(500);
        await this.pressEnterOnKeypad();
        await this.clickDateOfBirthField();
        await this.waitForElem(this.getDateOfBirthOK);
        // Select year
        if (dob.year < '1968' || dob.year > '1974') {
            await this.scrollToElemWithText(dob.year);
            await (await this.getDateOfBirthYear(dob.year)).click();
        } else {
            await (await this.getDateOfBirthYear(dob.year)).click();
        }
        // Change month
        const date = await (await this.getHeaderDate()).getText();
        if (date.substring(5, 8) !== dob.month.substring(0, 3)) {
            await (await this.getDateOfBirthNextMonth()).click();
        }
        // Click day
        await (await this.getDateOfBirthDay(dob.day)).click();
        // Click ok
        await this.clickDateOfBirthOK();
    } else if (dob && this.platform === 'ios') {
        await this.clickDateOfBirthField();
        await (await this.getiOSPickerWheel(1)).setValue(dob.month);
        await (await this.getiOSPickerWheel(2)).setValue(dob.day);
        await (await this.getiOSPickerWheel(3)).setValue(dob.year);
        await (await this.client.$('~Done')).click();
    }
}