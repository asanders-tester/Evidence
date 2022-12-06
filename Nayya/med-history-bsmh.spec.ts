/** 
 * This is a test case for a user that works for Bon Secour Mercy Hospital and has moderate to complex medical history.
 * The first part of the test will complete the survey flow as a new user, and the second part will complete the survey flow as a 
 * returning user.
 * Database validations are being handled at the end of each flow.
 */


import { expect, test, request } from '@playwright/test';
import * as environment from '../../environment.json';
import { SignUpPage } from '../../pom/models/SignUp.page';
import { CreateAccountPage } from '../../pom/models/CreateAccount.page';
import { LoginPage } from '../../pom/models/Login.page';
import { TestMailEmailFetcher } from '../../pom/utilities/TestMailEmailFetcher';
import { LandingPage } from '../../pom/models/Landing.page';
import { EnrollmentPage } from '../../pom/models/Enrollment.page';
import { 
  AboutYouFamilyPage, 
  AboutYouPage, 
  AboutSpousePage, 
  AboutChildrenPage, 
  AboutPetsPage, 
  AboutYouSoleBreadwinnerPage
} from '../../pom/models/AboutYou.page';
import { AddProvidersPage, DoctorVisitsPage, MentalHealthPage } from '../../pom/models/Coverage.page';
import { LifestyleHabitsDependentsPage, TravelToWorkPage, TravelInsightsPage } from '../../pom/models/Lifestyle.page';
import {
  DentalPage, 
  PrescriptionsPage, 
  TobaccoPage, 
  TobaccoUser, 
  UnderlyingConditionsPage, 
  DiabetesPage, 
  VisionPage
} from '../../pom/models/Health.page';
import {
  FinancialSnapshotPage,
  HealthCareSpendingPage,
  HomeOwnershipPage,
  LifeEventsPage,
  NotAlonePage,
  ProtectionQuestionPage,
  RainyDayPage,
  SoftCreditPage
} from '../../pom/models/Finance.page';
import { BenefitsBundlePage, KeyFactorsPage } from '../../pom/models/Choose.page';
import { Requests } from '../../pom/utilities/apiResponses';
import { UserQuery } from '../../pom/utilities/databaseQueries';

test('Happy path moderate/complex med history, new + returning user for BSMH', async ({ page }, info) => {
  test.setTimeout(120000);

  const signUpPage = new SignUpPage(page, environment['qa-bsmh-employer'], environment['qa-bsmh-clazz']);
  const loginPage = new LoginPage(page);
  const createAccountPage = new CreateAccountPage(page);
  const landingPage = new LandingPage(page);
  const enrollmentPage = new EnrollmentPage(page);

  const aboutYouPage = new AboutYouPage(page);
  const aboutYouFamilyPage = new AboutYouFamilyPage(page);
  const aboutSpousePage = new AboutSpousePage(page);
  const soleBreadwinnerPage = new AboutYouSoleBreadwinnerPage(page);
  const aboutChildrenPage = new AboutChildrenPage(page);
  const aboutPetsPage = new AboutPetsPage(page);
  const visitsPage = new DoctorVisitsPage(page);
  const providersPage = new AddProvidersPage(page);
  const mentalHealthPage = new MentalHealthPage(page);

  const travelPage = new TravelToWorkPage(page);
  const travelInsightsPage = new TravelInsightsPage(page);
  const habitsDependentsPage = new LifestyleHabitsDependentsPage(page);

  const underlyingConditionsPage = new UnderlyingConditionsPage(page);
  const diabetesPage = new DiabetesPage(page);
  const prescriptionsPage = new PrescriptionsPage(page);
  const tobaccoPage = new TobaccoPage(page);
  const visionPage = new VisionPage(page);
  const dentalPage = new DentalPage(page);

  const softCreditPage = new SoftCreditPage(page);
  const protectionQuestionPage = new ProtectionQuestionPage(page);
  const homeOwnershipPage = new HomeOwnershipPage(page);
  const financialSnapshotPage = new FinancialSnapshotPage(page);
  const rainyDayPage = new RainyDayPage(page);
  const notAlonePage = new NotAlonePage(page);
  const healthCareSpendingPage = new HealthCareSpendingPage(page);
  const lifeEventsPage = new LifeEventsPage(page);
  const keyFactorsPage = new KeyFactorsPage(page);
  const bundlePage = new BenefitsBundlePage(page);

  const emailFetcher = new TestMailEmailFetcher(request, info, environment['testmail-namespace'], environment['testmail-api-key']);
  const testStart: number = Date.now();
  const jsonResponse = new Requests(page);
  const userQuery = new UserQuery();


  // Start of new user story, moderate med history
  // *****************************************************************************************************************

  await signUpPage.navigate();
  await signUpPage.signUp(emailFetcher.emailAddress());

  await createAccountPage.acceptResetPasswordToken(emailFetcher.fetchPasswordToken(testStart));
  await createAccountPage.navigate();
  await createAccountPage.fillPersonalInformation('David', 'Txzw', '1963-06-22');
  await createAccountPage.resetPassword('Nayya2020!');

  await landingPage.getStarted();

  await enrollmentPage.openEnrollment();
  await enrollmentPage.next();

  await aboutYouPage.setAddress('200 Birch Ln, Carlisle, PA 17015');
  await aboutYouPage.setSalaryTypeToHourly();
  await aboutYouPage.setHourlyRate('18');
  await aboutYouPage.setNumberOfHours('40');
  await aboutYouPage.next();

  let id = await jsonResponse.getProfileId();
  // Verify user data
  await userQuery.profileInfo(id).then((query) => {
    expect.soft(query[0].first_name).toEqual('David');
    expect.soft(query[0].last_name).toEqual('Txzw');
    expect.soft(query[0].street_address).toEqual('200 Birch Ln');
    expect.soft(query[0].city).toEqual('Carlisle');
    expect.soft(query[0].state).toEqual('PA');
    expect.soft(query[0].zip).toEqual('17015');
  });

  await aboutYouFamilyPage.selectSpouse(true);
  await aboutYouFamilyPage.selectChildren(true);
  await aboutYouFamilyPage.next();

  id = await jsonResponse.getUserId();

  await aboutSpousePage.setDateOfBirth('1960-01-01');
  await aboutSpousePage.setGender('Female');
  await aboutSpousePage.setDependentForCoverage(false);
  await aboutSpousePage.setEmployed(40000, true);
  await aboutSpousePage.next();

  await aboutChildrenPage.setChildInformation(0, 'Child1', '2003-01-01');
  await aboutChildrenPage.setDependentForCoverage(true);
  await aboutChildrenPage.next();

  await visitsPage.primaryCare(8);
  await visitsPage.specialist(5);
  await visitsPage.dental(6);
  await visitsPage.next();

  await providersPage.next();

  await mentalHealthPage.next();

  await travelPage.setModes({ car: true });
  await travelPage.next();

  await travelInsightsPage.next();

  await habitsDependentsPage.youAndSpouseExercise('mix');
  await habitsDependentsPage.childrenExercise('mix');
  await habitsDependentsPage.next();

  await underlyingConditionsPage.setConditions({ highBloodPressure : true });
  await underlyingConditionsPage.next();

  await prescriptionsPage.yesPrescriptions();
  await prescriptionsPage.addPrescription('Zestril');
  await prescriptionsPage.next();

  await tobaccoPage.noTobacco();
  await tobaccoPage.spouseDoesNotUse();
  await tobaccoPage.setProducts({ vapesEcigarettes : true }, TobaccoUser.Child);
  await tobaccoPage.next();

  await visionPage.yesGlasses();
  await visionPage.next();

  await dentalPage.setDental({ cleanings : true, cavityFillings : true });
  await dentalPage.next();

  await softCreditPage.consentToSoftCredit(false);

  await protectionQuestionPage.neutral();

  // The following page is currently not in the flow, but it should be
  // Bug ticket: https://app.shortcut.com/nayya/story/23196/residence-page-is-missing-from-flow
  await homeOwnershipPage.checkURLOrSoftFail(async () => {
    await homeOwnershipPage.neitherOwnNorRent();
  });

  await financialSnapshotPage.fillSnapshot({
    studentDebt: 0,
    // autoDebt: 0,
    creditCardDebt: 0,
    otherDebt: 0
  });

  await rainyDayPage.answerQuestions('HSA', 'months');

  await healthCareSpendingPage.decrease();

  await lifeEventsPage.possibleEvents({ moving: true });
  await lifeEventsPage.next();

  await keyFactorsPage.checkDemographicValues('59 years old', 'married', true, '$77,440');
  await keyFactorsPage.checkHealthValues('high blood pressure', '19 visits', true, true, true);
  await keyFactorsPage.checkFinancialValues('months', 'HSA');
  await keyFactorsPage.next();

  await bundlePage.checkBenefits();
  await bundlePage.logOut();

  await userQuery.surveyResults(id).then((query) => {
    // Verify additional user data
    expect.soft(query[0].survey_results.date_of_birth).toEqual('1963-06-22');
    expect.soft(query[0].survey_results.salary_type).toEqual('hourly');
    expect.soft(query[0].survey_results.hourly_wage).toEqual('18');
    expect.soft(query[0].survey_results.hours).toEqual('40');
    expect.soft(query[0].survey_results.bonus).toEqual('');

    // Verify spouse data
    expect.soft(query[0].survey_results.spouse_dob).toEqual('01/01/1960'); // The format here is different
    expect.soft(query[0].survey_results.spouse_gender).toEqual('F'); // The stored value is different from input value
    expect.soft(query[0].survey_results.spouse_dependent_status).toEqual('independent');
    expect.soft(query[0].survey_results.spouse_employed).toEqual('yes');
    expect.soft(query[0].survey_results.spouse_salary).toEqual(40000);
    expect.soft(query[0].survey_results.spouse_employer_insurance).toEqual('yes');

    // Verify children data
    expect.soft(query[0].survey_results.children[0].name).toEqual('Child1');
    expect.soft(query[0].survey_results.children[0].dob).toEqual('01/01/2003'); // The format here is different
    expect.soft(query[0].survey_results.children_dependent_status).toEqual('dependent');

    // Verify visits data
    expect.soft(query[0].survey_results.doctor_visits).toEqual(8);
    expect.soft(query[0].survey_results.specialist_visits).toEqual(5);
    expect.soft(query[0].survey_results.dentist_visits).toEqual(6);

    // Verify travel data
    expect.soft(query[0].survey_results.commute[0]).toEqual('car');

    // Verify habits data
    expect.soft(query[0].survey_results.exercise).toEqual('mix');
    expect.soft(query[0].survey_results.kids_exercise).toEqual('mix');

    // Verify underlying conditions data
    expect.soft(query[0].survey_results.underlying_conditions[0]).toEqual('HBP'); // The stored value is different from input value

    // Verify prescriptions data
    expect.soft(query[0].survey_results.prescriptions).toEqual('yes');
    expect.soft(query[0].survey_results.prescriptions_list[0]).toEqual('Zestril');

    // Verify tobacco data
    expect.soft(query[0].survey_results.smoker[0]).toEqual('no_smoke'); // The stored value is different from input value
    expect.soft(query[0].survey_results.spouse_smoker[0]).toEqual('no_smoke');
    expect.soft(query[0].survey_results.children[0].smoker[0]).toEqual('e_cigarettes');

    // Verify vision data
    expect.soft(query[0].survey_results.vision_procedures).toEqual('yes');

    // Verify dental data
    expect.soft(query[0].survey_results.dental_procedures[0]).toEqual('cleanings');
    expect.soft(query[0].survey_results.dental_procedures[1]).toEqual('fillings');

    // Verify credit inquiry data
    expect.soft(query[0].survey_results.credit_inquiry_consent).toEqual(false);

    // Verify financial protection data
    // This is being stored as the order it is listed on the survey
    // For example, Neither agree nor disagree is the 3rd option
    expect.soft(query[0].survey_results.financial_protection).toEqual(3);

    // Verify home ownership data
    // This will be the query for home ownership when the bug is fixed

    // Verify financial snapshot data
    expect.soft(query[0].survey_results.financial_results.education).toEqual(0);
    expect.soft(query[0].survey_results.financial_results.credit).toEqual(0);
    expect.soft(query[0].survey_results.financial_results.other).toEqual(0);

    // Verify rainy day data
    expect.soft(query[0].survey_results.savings).toEqual('HSA');
    expect.soft(query[0].survey_results.unable_to_work).toEqual('months');

    // Verify healthcare spending data
    expect.soft(query[0].survey_results.healthcare_spending).toEqual('decrease');

    // Verify life events data
    expect.soft(query[0].survey_results.qle[0]).toEqual('moving');
  });


  // Start of returning user story, complex med history
  // *****************************************************************************************************************


  await loginPage.navigate();
  await loginPage.signIn(emailFetcher.emailAddress(), 'Nayya2020!');

  await aboutYouPage.returnToAboutYou();

  expect.soft(await aboutYouPage.getAddress()).toEqual('200 Birch Ln, Carlisle, PA 17015');
  let isSettingCorrect = await aboutYouPage.getSalaryType() == 'Hourly';
  expect.soft(isSettingCorrect).toBeTruthy();
  // These fields will only display if the setting is correct,
  // so do not try to check them if they are not present
  // Bug ticket: https://app.shortcut.com/nayya/story/20847/survey-forgets-spouse-employment-status
  if (isSettingCorrect) {
    expect.soft(await aboutYouPage.getHourlyRate()).toEqual('18');
    expect.soft(await aboutYouPage.getNumberOfHours()).toEqual('40');
  }
  await aboutYouPage.setSalaryTypeToAnnual();
  await aboutYouPage.setAnnualSalary('50,000');
  await aboutYouPage.setAdditionalIncome('5');
  await aboutYouPage.next();

  expect.soft(await aboutYouFamilyPage.isSpouseSelected()).toBeTruthy();
  expect.soft(await aboutYouFamilyPage.isChildrenSelected()).toBeTruthy();
  await aboutYouFamilyPage.selectPets(true);
  await aboutYouFamilyPage.next();

  expect.soft(await aboutSpousePage.getDateOfBirth()).toEqual('01/01/1960');
  expect.soft(await aboutSpousePage.getGender()).toEqual('Female');
  expect.soft(await aboutSpousePage.getDependentStatus()).toBeFalsy();
  isSettingCorrect = await aboutSpousePage.getEmployementStatus();
  expect.soft(isSettingCorrect).toBeTruthy();
  // These fields will not display if this is correct,
  // so skip them if they are not present.
  if (isSettingCorrect) {
    expect.soft(await aboutSpousePage.getAnnualSalary()).toEqual('40,000');
    expect.soft(await aboutSpousePage.getSpouseEmployerInsuranceStatus()).toBeTruthy();
    await aboutSpousePage.setUnemployed();
  }

  await aboutSpousePage.next();

  await soleBreadwinnerPage.next();

  expect.soft(await aboutChildrenPage.getChildName(0)).toEqual('Child1');
  expect.soft(await aboutChildrenPage.getDateOfBirth(0)).toEqual('01/01/2003');
  expect.soft(await aboutChildrenPage.getDependentStatus()).toBeTruthy();
  await aboutChildrenPage.setChildInformation(0, 'Child1', '2020-01-01');
  await aboutChildrenPage.addChild();
  await aboutChildrenPage.setChildInformation(1, 'Child2', '2015-01-01');
  await aboutChildrenPage.setDependentForCoverage(true);
  await aboutChildrenPage.next();

  await aboutPetsPage.checkURL();
  await aboutPetsPage.setPetName('Bluey');
  await aboutPetsPage.setAnimalType('Dog');
  await aboutPetsPage.setBreed('Australian Cattle Dog');
  await aboutPetsPage.setGender('Female');
  await aboutPetsPage.setAge('6 Years');
  await aboutPetsPage.setHealthStatus('Has medical issues');
  await aboutPetsPage.clickSubmitPet();

  await aboutPetsPage.addPet();
  await aboutPetsPage.setPetName('Sonic');
  await aboutPetsPage.setAnimalType('Other');
  await aboutPetsPage.setPetType('Hedgehog');
  await aboutPetsPage.setGender('Male');
  await aboutPetsPage.setAge('1 Year');
  await aboutPetsPage.setHealthStatus('Has always been healthy');
  await aboutPetsPage.clickSubmitPet();
  await aboutPetsPage.next();

  expect.soft(await visitsPage.getPrimaryCare()).toEqual('8');
  expect.soft(await visitsPage.getSpecialist()).toEqual('5');
  expect.soft(await visitsPage.getDental()).toEqual('6');
  await visitsPage.primaryCare(12);
  await visitsPage.specialist(10);
  await visitsPage.dental(8);
  await visitsPage.next();

  await providersPage.next();

  await mentalHealthPage.next();

  expect.soft(await travelPage.isOptionSelectedCheckbox('Car')).toBeTruthy();
  await travelPage.setModes({ publicTransit : true });
  await travelPage.next();

  expect.soft(await habitsDependentsPage.getYouAndSpouseExercise()).toEqual('It\'s a mix');
  expect.soft(await habitsDependentsPage.getChildrenExercise()).toEqual('It\'s a mix');
  await habitsDependentsPage.youAndSpouseExercise('none');
  await habitsDependentsPage.childrenExercise('none');
  await habitsDependentsPage.next();

  await underlyingConditionsPage.checkURL();
  expect.soft(await underlyingConditionsPage.isConditionSelected('High Blood Pressure')).toBeTruthy();
  await underlyingConditionsPage.setConditions({
    highBloodPressure: true,
    diabetes : true,
    obesity : true,
    otherUnderlyingConditions : true
  });
  await underlyingConditionsPage.next();

  await diabetesPage.next();

  await prescriptionsPage.checkURL();
  let list = await prescriptionsPage.getPrescriptionList();
  expect.soft(list.length).toBe(1);
  if (list.length > 0) {
    expect.soft(list[0]).toEqual('Zestril');
  }
  await prescriptionsPage.yesPrescriptions();
  await prescriptionsPage.addPrescription('Lunesta');
  await prescriptionsPage.addPrescription('Celebrex');
  await prescriptionsPage.addPrescription('Abilify');
  await prescriptionsPage.addPrescription('Levitra');
  await prescriptionsPage.next();

  await tobaccoPage.checkURL();
  expect.soft(await tobaccoPage.isNoTobaccoSelected()).toBeTruthy();
  list = await tobaccoPage.getProducts(TobaccoUser.Spouse);
  expect.soft(list.length).toBe(0);
  await tobaccoPage.yesTobacco();
  await tobaccoPage.setProducts({ cigarettes : true, cigars : true }, TobaccoUser.Myself);
  await tobaccoPage.setProducts({ vapesEcigarettes : true }, TobaccoUser.Spouse);
  // There is a bug that makes the following line needed currently
  // Bug ticket: https://app.shortcut.com/nayya/story/21003/value-for-tobacco-nicotine-usage-for-child-is-not-saving
  await tobaccoPage.childDoesNotUse();
  await tobaccoPage.next();

  await visionPage.checkURL();
  expect.soft(await visionPage.isYesGlassesSelected()).toBeTruthy();
  await visionPage.next();

  await dentalPage.checkURL();
  list = await dentalPage.getDental();
  expect.soft(list.length).toBe(2);
  if (list.length == 2) {
    expect.soft(list[0]).toEqual('Cleanings');
    expect.soft(list[1]).toEqual('Cavity Fillings');
  }
  await dentalPage.setDental({
    cleanings : true, 
    cavityFillings : true,
    crowns : true, 
    bracesInvisalignOrthodontia : true
  });
  await dentalPage.setOrthodotia({
    adultChildren19 : true,
    children18Younger : true
  });
  await dentalPage.next();

  await softCreditPage.checkURL();
  expect.soft(await softCreditPage.isSoftCreditSelected()).toBeFalsy();
  await softCreditPage.consentToSoftCredit(true);

  expect.soft(await protectionQuestionPage.isOptionSelected('Neither agree nor disagree')).toBeTruthy();
  await protectionQuestionPage.definitelyAgree();

  // The following page is currently not in the flow, but it should be
  // Bug ticket: https://app.shortcut.com/nayya/story/23196/residence-page-is-missing-from-flow
  await homeOwnershipPage.checkURLOrSoftFail(async () => {
    expect.soft(await homeOwnershipPage.isOptionSelected('Neither')).toBeTruthy();
    await homeOwnershipPage.rent();
  });

  expect.soft(await financialSnapshotPage.getValueForLabel('Student Debt')).toEqual('$0');
  // The following line is affected by the previously noted bug
  // expect.soft(await financialSnapshotPage.getValueForLabel('Auto Debt')).toEqual('$0');
  expect.soft(await financialSnapshotPage.getValueForLabel('Credit Card Debt')).toEqual('$0');
  expect.soft(await financialSnapshotPage.getValueForLabel('Other Debt')).toEqual('$0');
  await financialSnapshotPage.next();

  expect.soft(await rainyDayPage.getRainyDayFund()).toEqual('I would use my HSA or FSA');
  expect.soft(await rainyDayPage.getRainyDayFundDuration()).toEqual('A few months');
  await rainyDayPage.answerQuestions('borrow', 'weeks');

  await notAlonePage.next();

  expect.soft(await healthCareSpendingPage.isOptionSelected('Decrease')).toBeTruthy();
  await healthCareSpendingPage.increase();

  expect.soft(await lifeEventsPage.conditionsMatch({ moving: true })).toBeTruthy();
  await lifeEventsPage.possibleEvents({ medical: true, baby: true });
  await lifeEventsPage.next();

  await keyFactorsPage.checkDemographicValues('59 years old', 'married', true, '$50,005');
  await keyFactorsPage.checkHealthValues('3', '30', true, true, true);
  await keyFactorsPage.checkFinancialValues('weeks', 'borrow');
  await keyFactorsPage.next();

  await bundlePage.checkBenefits();

  await userQuery.surveyResults(id).then((query) => {
    console.log(query);
    // Verify additional user data
    expect.soft(query[0].survey_results.salary_type).toEqual('annual');
    expect.soft(query[0].survey_results.annual_salary).toEqual('50000'); // This is stored as a string
    expect.soft(query[0].survey_results.bonus).toEqual('5'); // This is stored as a string

    // Verify spouse data
    expect.soft(query[0].survey_results.spouse_employed).toEqual('no');

    // Verify children data
    expect.soft(query[0].survey_results.children[0].name).toEqual('Child1');
    expect.soft(query[0].survey_results.children[0].dob).toEqual('01/01/2020'); // The format here is different
    expect.soft(query[0].survey_results.children[1].name).toEqual('Child2');
    expect.soft(query[0].survey_results.children[1].dob).toEqual('01/01/2015'); // The format here is different
    expect.soft(query[0].survey_results.children_dependent_status).toEqual('dependent');

    // Verify pets data
    expect.soft(query[0].survey_results.have_pets).toEqual(true);
    expect.soft(query[0].survey_results.pet_information[0].age.value).toEqual('6_year');
    expect.soft(query[0].survey_results.pet_information[0].name).toEqual('Bluey');
    expect.soft(query[0].survey_results.pet_information[0].type).toEqual('dog');
    expect.soft(query[0].survey_results.pet_information[0].breed.value).toEqual('australian_cattle_dog');
    expect.soft(query[0].survey_results.pet_information[0].gender).toEqual('female');
    expect.soft(query[0].survey_results.pet_information[0].healthStatus).toEqual('has medical issues');

    expect.soft(query[0].survey_results.pet_information[1].age.value).toEqual('1_year');
    expect.soft(query[0].survey_results.pet_information[1].name).toEqual('Sonic');
    expect.soft(query[0].survey_results.pet_information[1].type).toEqual('other');
    expect.soft(query[0].survey_results.pet_information[1].typeName).toEqual('hedgehog');
    expect.soft(query[0].survey_results.pet_information[1].gender).toEqual('male');
    expect.soft(query[0].survey_results.pet_information[1].healthStatus).toEqual('has always been healthy');


    // Verify visits data
    expect.soft(query[0].survey_results.doctor_visits).toEqual(12);
    expect.soft(query[0].survey_results.specialist_visits).toEqual(10);
    expect.soft(query[0].survey_results.dentist_visits).toEqual(8);

    // Verify travel data
    expect.soft(query[0].survey_results.commute[0]).toEqual('public-transport');

    // Verify habits data
    expect.soft(query[0].survey_results.exercise).toEqual('none');
    expect.soft(query[0].survey_results.kids_exercise).toEqual('none');

    // Verify underlying conditions data
    expect.soft(query[0].survey_results.underlying_conditions[0]).toEqual('HBP'); // The stored value is different from input value
    expect.soft(query[0].survey_results.underlying_conditions[1]).toEqual('diabetes');
    expect.soft(query[0].survey_results.underlying_conditions[2]).toEqual('obesity');
    expect.soft(query[0].survey_results.underlying_conditions[3]).toEqual('other');

    // Verify prescriptions data
    expect.soft(query[0].survey_results.prescriptions).toEqual('yes');
    expect.soft(query[0].survey_results.prescriptions_list[0]).toEqual('Zestril');
    expect.soft(query[0].survey_results.prescriptions_list[1]).toEqual('Lunesta');
    expect.soft(query[0].survey_results.prescriptions_list[2]).toEqual('Celebrex');
    expect.soft(query[0].survey_results.prescriptions_list[3]).toEqual('Abilify');
    expect.soft(query[0].survey_results.prescriptions_list[4]).toEqual('Levitra');

    // Verify tobacco data
    expect.soft(query[0].survey_results.smoker[0]).toEqual('cigarettes');
    expect.soft(query[0].survey_results.smoker[1]).toEqual('cigars');
    expect.soft(query[0].survey_results.spouse_smoker[0]).toEqual('e_cigarettes');

    // Verify dental data
    expect.soft(query[0].survey_results.dental_procedures[0]).toEqual('cleanings');
    expect.soft(query[0].survey_results.dental_procedures[1]).toEqual('fillings');
    expect.soft(query[0].survey_results.dental_procedures[2]).toEqual('crowns');
    expect.soft(query[0].survey_results.dental_procedures[3]).toEqual('orthodontia');

    // Verify orthodontia data
    expect.soft(query[0].survey_results.orthodontia_members[0]).toEqual('');
    expect.soft(query[0].survey_results.orthodontia_members[1]).toEqual('');

    // Verify credit inquiry data
    expect.soft(query[0].survey_results.credit_inquiry_consent).toEqual(true);

    // Verify financial protection data
    // This is being stored as the order it is listed on the survey
    // For example, Neither agree nor disagree is the 3rd option
    expect.soft(query[0].survey_results.financial_protection).toEqual(5);

    // Verify home ownership data
    // This will be the query for home ownership when the bug is fixed

    // Verify rainy day data
    expect.soft(query[0].survey_results.savings).toEqual('borrow money');
    expect.soft(query[0].survey_results.unable_to_work).toEqual('weeks');

    // Verify healthcare spending data
    expect.soft(query[0].survey_results.healthcare_spending).toEqual('increase');

    // Verify life events data
    expect.soft(query[0].survey_results.qle[0]).toEqual('moving');
    expect.soft(query[0].survey_results.qle[1]).toEqual('medical');
    expect.soft(query[0].survey_results.qle[2]).toEqual('baby');
  });
});