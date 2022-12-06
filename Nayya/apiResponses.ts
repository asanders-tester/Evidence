/**
 * This is a utility page that will get an API response from the front end and return a needed value for querying the database.
 */


import { Page } from 'playwright';
import { BasePage } from '../models/Base.page';

export class Requests extends BasePage {
  constructor(page: Page) {
    super(page);
  }
    
  getPageURL(): string {
    return '/api/smart_select_surveys.json';
  }

  /** Get the profile_id value from the front end API call */
  async getProfileId() {
    const promise = await this.page.waitForResponse('https://qa.app.nayya.com/api/smart_select_surveys.json');
    const response = promise;
    const resp = await response.json();

    const id = resp.survey_results.profile_id;

    return id;
  }

  /** Get the user_id value from the front end API call */
  async getUserId() {
    const promise = await this.page.waitForResponse('https://qa.app.nayya.com/api/smart_select_surveys.json');
    const response = promise;
    const resp = await response.json();

    const id = resp.survey_results.user_id;

    return id;
  }
}