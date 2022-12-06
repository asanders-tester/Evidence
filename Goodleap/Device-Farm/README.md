# Device Farm

## Prerequisites:
Follow instructions for setting up in the project level README.md. Be sure to run npm install the first time.

## Running Tests:
1. Check your `environment.js` file and fill in all required info for the awsConfig section using environment_TEMPLATE.js as a guide. 
    * Make sure androidDevice is set to `AWSAndroid` and/or iOSDevice is set to `AWSiOS`. 
    * This will allow AWS to use the pre-configured settings, otherwise the environment file will override them and the run will fail.
    * You will also need to fill in `localAndroidAppLocation` with the path to the .apk file you are using.
2. Check your `environment.json` file and fill in the df-credentials key pair values. 
    * This is the key pair for the Ultranauts AWS account. 
    * If you don't have access, please contact John Allen (for Ultranauts team members).
3. Open the `androidTestSpecs.yml` or `iosTestSpecs.yml` depending on which platform the test is being run on.
    * Find the line `npx jest verifyMailingAddress.test.js --config mobile/jest.mobile_aws.config.js` and replace verifyMailingAddress with the test you intend to run.
4. In the terminal run `npm run compress`.
    * This is a script set up in package.json. First it will run npm-bundle to create the tarball file, then it will compress the tarball into a .zip file.
    * After those steps are completed, the test will begin running.
    * The test process will begin and may take up to 30 minutes to complete.
    * You can open multiple terminals to run tests in parallel. If the devices are busy, it will take longer for the test to begin running.
    * I have found that tests should be staggered so that they aren't all trying to hit the dynamo events at the same time.

### Note About Android Devices:
When running tests on an Android device, it's best to use a Google Pixel 4 or Google Pixel 6 Pro. If using a Pixel with a screen larger than 4 or smaller than 6 Pro (such as a 4a or 5), the fourth checkbox on the disclosures page is out of bounds and can't be clicked, yet the test thinks it's on the screen on won't scroll to it. This is just because a tiny part of the outline of the textbox is visible at the bottom of the screen. When using a Pixel 4, the smaller screen means that the checkbox is totally off screen and will scroll to it. When using a Pixel 6 Pro, the larger screen means that the checkbox is visible on the screen and can be clicked.

## Post Test Run:
Open the artifacts folder within mobile/outputs to find the downloaded artifacts. These files will be within another folder that has the same name as the run. Sometimes a test will get replaced with another, so make sure to check the logs to verify that the test you intended to run is the one that completed.

Check [Confluence](https://ultratesting.atlassian.net/wiki/spaces/L/pages/2075656207/Getting+Started+With+AWS+Device+Farm) for more detailed info.