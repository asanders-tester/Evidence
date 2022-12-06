/**
 * This is one of the page object model's for the Nayya Choose Survey. This particular page will get the elements on the page for the 
 * insurance company name, member id, and group id and fill in the fields with the values provided. It will also fill in the values for
 * the number of doctor, specialist, and dental visits and fill in a preferred provider.
 * 
 * All of the pieces here that are for the Spanish flow were added by Kyle Roth.
 */


import { Page } from 'playwright';
import { BaseChoosePage } from './BaseChoose.page';

export class CoveragePage extends BaseChoosePage {
  constructor(page: Page) {
    super(page);
  }

  getId(): string {
    return 'coverage';
  }

  /** Either check yes or no, and if yes is checked fill in the insurance company, member id and group id */
  async coverage(label: boolean, company = 'AETNA', memberId = '12345', groupId = '12345') {
    await this.checkURL();
    await this.page.getByRole('radio', { name: label ? 'Yes' : 'No' }).check();
    if (label) {
      await this.insuranceCompany(company);
      await this.page.getByLabel('Member ID').type(memberId);
      await this.page.getByLabel('Group ID').type(groupId);
    }
  }

  /**  Select the desired insurance company from the dropdown */
  async insuranceCompany(company: string) {
    await this.page.locator('#current-insurance-company-select-label').click();
    await this.page.getByRole('option', { name: company }).click();
  }

  /** Determine which radio button has been selected, yes or no */
  async isCoverageSelected(label: boolean): Promise<boolean> {
    return this.page.getByRole('radio', { name: label ? 'Yes' : 'No' }).isChecked();
  }
}

export class DoctorVisitsPage extends BaseChoosePage {
  constructor(page: Page) {
    super(page);
  }

  getId(): string {
    return 'doctor_visits';
  }

  /** Click on the field and input the given value */
  async primaryCare(visits: number) {
    const label = await this.isSpanishSelected() ? 'Visitas para cualquier cosa que no fuera prevención / chequeos:' : 'Primary Care Visits';

    await this.page.getByLabel(label).click();
    await this.page.getByRole('option', { name: visits.toString() }).click();
  }

  async getPrimaryCare(): Promise<string> {
    const locatorId = await this.isSpanishSelected() ?
      'visitas-para-cualquier-cosa-que-no-fuera-prevención-/-chequeos:-text-input' : 
      'primary-care-visits-text-input';

    return this.page.locator(`#${locatorId}`).getAttribute('placeholder');
  }

  /** Click on the field and input the given value */
  async specialist(visits: number) {
    const label = await this.isSpanishSelected() ? 'Visitas de Especialistas' : 'Specialist Visits';

    await this.page.getByLabel(label).click();
    await this.page.getByRole('option', { name: visits.toString() }).click();
  }

  async getSpecialist(): Promise<string> {
    const locatorId = await this.isSpanishSelected() ? 'visitas-de-especialistas-text-input' : 'specialist-visits-text-input';

    return this.page.locator(`#${locatorId}`).getAttribute('placeholder');
  }

  /** Click on the field and input the given value */
  async dental(visits: number) {
    const label = await this.isSpanishSelected() ? 'Visitas Dentales' : 'Dental Visits';

    await this.page.getByLabel(label).click();
    await this.page.getByRole('option', { name: visits.toString() }).click();
  }

  async getDental(): Promise<string> {
    const locatorId = await this.isSpanishSelected() ? 'visitas-dentales-text-input' : 'dental-visits-text-input';

    return this.page.locator(`#${locatorId}`).getAttribute('placeholder');
  }
}

export class MentalHealthPage extends BaseChoosePage {
  constructor(page: Page) {
    super(page);
  }

  getId(): string {
    return 'mental_health';
  }
}

export class AddProvidersPage extends BaseChoosePage {
  constructor(page: Page) {
    super(page);
  }

  getId(): string {
    return 'providers';
  }

  /** Enter a provider's name into the field and click the nth option in the list of autosuggested values */
  async addProvider(providerName: string, option: number) {
    await this.page.locator('#add-provider-text-input').type(providerName);
    await this.page.locator('div[role="option"]').nth(option).click();
  }

  /** Select the level of importance for the provider entered for the purpose of determining in-network needs */
  async importance(level: 'Not at all'|'Somewhat'|'Very', option: number) {
    await this.page.getByRole('radio', { name: level }).nth(option).check();
  }
}
