/**
 * This is one of the page object model's for the Nayya Choose Survey. This particular page will assert the bullet points on the 
 * Key Factors page.
 * Key Factors is a summary of what the user has submitted in the survey.
 * 
 * All of the pieces here that are for the Spanish flow were added by Kyle Roth.
 */


import { Page } from 'playwright';
import { expect } from '@playwright/test';
import { BaseChoosePage } from './BaseChoose.page';
import { BasePage } from './Base.page';

export class KeyFactorsPage extends BaseChoosePage {
  constructor(page: Page) {
    super(page);
  }

  getId(): string {
    return 'explanation';
  }

  async waitForBulletText() {
    await this.page.waitForSelector('ul > li > span:not(:empty)');
  }

  /** Verify that the values in the summary for demographics are correctly matching what was entered into the survey */
  async checkDemographicValues(
    age: string,
    status: 'single'|'married'|'domestic partnership'|'casado/a',
    children: boolean,
    income: string) {
    await this.checkURL();

    let childrenLabel = children ? 'have' : 'don\'t';

    if (await this.isSpanishSelected()) {
      childrenLabel = children ? 'tiene' : 'no tiene';
    }

    await expect.soft(this.page.locator('ul > li > span').first()).toContainText(age);
    await expect.soft(this.page.locator('ul > li > span').first()).toContainText(status);
    await expect.soft(this.page.locator('ul > li > span').first()).toContainText(childrenLabel);
    await expect.soft(this.page.locator('ul > li > span').first()).toContainText(income);
  }

  /** Verify that the values in the summary for health are correctly matching what was entered into the survey */
  async checkHealthValues(
    underlyingConditions: string,
    doctorSpecialistVisits: string,
    glassesContacts: boolean,
    cleanings: boolean,
    procedures: boolean) {
    let glassesText: string;
    let cleaningsText: string;
    let proceduresText: string;

    if (await this.isSpanishSelected()) {
      glassesText = glassesContacts ? 'familia necesitará' : 'familia no necesitará';
      cleaningsText = cleanings ? 'familia planea recibir' : 'familia no planea recibir';
      proceduresText = procedures ? 'y tener' : 'y no tener';
    }
    else {
      glassesText = glassesContacts ? 'need' : 'not';
      cleaningsText = cleanings ? 'receiving' : 'doesn\'t';
      proceduresText = procedures ? 'having' : 'don\'t';
    }
    
    await expect.soft(this.page.locator('ul > li > span').nth(1)).toContainText(underlyingConditions);
    await expect.soft(this.page.locator('ul > li > span').nth(2)).toContainText(doctorSpecialistVisits);
    await expect.soft(this.page.locator('ul > li > span').nth(3)).toContainText(glassesText);
    await expect.soft(this.page.locator('ul > li > span').nth(4)).toContainText(cleaningsText);
    await expect.soft(this.page.locator('ul > li > span').nth(4)).toContainText(proceduresText);
  }

  /** Verify that the values in the summary for finances are correctly matching what was entered into the survey */
  async checkFinancialValues(
    supportFor: 'days'|'weeks'|'months'|'year',
    payFor: 'savings'|'borrow'|'HSA'|'?') {
    const fullAnswers = {
      savings: await this.isSpanishSelected() ? 'usaría sus ahorros' : 'you would use your savings',
      borrow: await this.isSpanishSelected() ? 'pediría dinero prestado' : 'you would borrow money',
      HSA: await this.isSpanishSelected() ? 'usaría su HSA o FSA' : 'you would use your HSA or FSA',
      '?': await this.isSpanishSelected() ? 'necesitaría encontrar una manera' : 'you would need to find a way',
      days: await this.isSpanishSelected() ? 'unos pocos días' : 'a few days',
      weeks: await this.isSpanishSelected() ? 'unas pocas semanas' : 'a few weeks',
      months: await this.isSpanishSelected() ? 'unos pocos meses' : 'a few months',
      year: await this.isSpanishSelected() ? 'un año o más' : 'a year or more'
    };
    const keyFactorsText = await this.isSpanishSelected() ? /^Factores clave/ : /^Key Factors/;

    await expect.soft(this.page.locator('h1').last()).toHaveText(keyFactorsText);

    await expect.soft(this.page.locator('ul > li > span').nth(5)).toContainText(fullAnswers[supportFor]);
    await expect.soft(this.page.locator('ul > li > span').nth(5)).toContainText(fullAnswers[payFor]);
  }

  /** Verify that the values in the summary for retirement are correctly matching what was entered into the survey */
  async checkRetirementValues(
    lifestyle: 'luxury'|'maintain'|'relax',
    age: 'before 50'|'50 - 59'|'60 - 69'|'70 years old or later'|'70 años o después') {
    const fullAnswers = {
      luxury: await this.isSpanishSelected() ? 'vive lujosamente en comparación con tu estilo de vida actual' : 'live luxuriously compared to your current lifestyle',
      maintain: await this.isSpanishSelected() ? 'mantener su estilo de vida actual' : 'maintain your current lifestyle',
      relax: await this.isSpanishSelected() ? 'reducir sus gastos en comparación con su estilo de vida actual' : 'lower your expenses compared to your current lifestyle'
    };

    await expect.soft(this.page.locator('ul > li > span').last()).toContainText(fullAnswers[lifestyle]);
    await expect.soft(this.page.locator('ul > li > span').last()).toContainText(age);
  }
}

export class BenefitsBundlePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  getPageURL(): string {
    return '/users/sign_in';
  }

  /** Verify key parts of page are correct such as the header text */
  async checkBenefits() {
    // The check for if Spanish is selected can fail or give false positives if this function starts too soon.
    // Wait for the correct page before checking.
    //eslint-disable-next-line
    await this.page.waitForURL('**\/choose\/smart_select\/recommendation**');

    const headerText = (await this.isSpanishSelected()) ? 'Imagine cómo usará su paquete de salud recomendado.' : 'Envision how you\'ll use your recommended health bundle.';
    const bundleText = (await this.isSpanishSelected()) ? 'Bulto de Beneficios' : 'Benefits Bundle';
    const proceedText = (await this.isSpanishSelected()) ? 'Continuar a la Inscripción' : 'Proceed to Enrollment';
    const exploreText = (await this.isSpanishSelected()) ? 'Explora escenarios' : 'Explore Scenarios';

    await expect.soft(this.page.locator('h3')).toHaveText(headerText);
    await expect.soft(this.page.locator('h4')).toHaveText(bundleText);
    await expect.soft(this.page.getByRole('button', { name: proceedText })).toBeVisible();
    await expect.soft(this.page.getByRole('button', { name: exploreText })).toBeVisible();
  }

  // logout() is repeated here because this class is extending BasePage and not BaseChoosePage
  async logOut() {
    const logoutText = await this.isSpanishSelected() ? 'Cerrar sesión' : 'Log out';

    await this.page.getByRole('button', { name: 'OpenSideBar' }).click();
    await this.page.getByRole('menuitem', { name: logoutText }).click();

    await this.checkURL();
  }

  async isSpanishSelected(): Promise<boolean> {
    return (await this.page.locator('div[mode="normal"]', {hasText: 'English'}).count()) > 0;
  }
}
