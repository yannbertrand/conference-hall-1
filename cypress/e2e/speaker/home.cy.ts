import EventProposalPage from '../../page-objects/event/proposal.page.ts';
import SpeakerHomePage from '../../page-objects/speaker/home.page.ts';
import SpeakerProfilePage from '../../page-objects/speaker/profile.page.ts';
import SpeakerNewTalkPage from '../../page-objects/speaker/talk-new.page.ts';

describe('Speaker home page', () => {
  beforeEach(() => {
    cy.task('seedDB', 'speaker/home');
    cy.login();
  });

  const home = new SpeakerHomePage();
  const profile = new SpeakerProfilePage();
  const newTalk = new SpeakerNewTalkPage();
  const eventProposal = new EventProposalPage();

  it('displays the speaker home page', () => {
    home.visit();

    cy.assertText('Clark Kent');
    cy.assertText('Clark kent biography');
    cy.assertText('Metropolis');
    cy.assertText('Daily planet');
    cy.assertText('ckent-github');
    cy.assertText('ckent-twitter');

    home.activities().should('have.length', 2);

    home
      .activities()
      .last()
      .within(() => {
        cy.assertText('Devfest Nantes');
      });

    home.eventActivities('Devfest Nantes').should('have.length', 4);

    home.activity('My talk 2').click();
    eventProposal.isPageVisible();
  });

  it('can edit the profile', () => {
    home.visit();
    home.editProfile().click();
    profile.isPageVisible();
  });

  it('can create a new talk', () => {
    home.visit();
    home.newTalk().click();
    newTalk.isPageVisible();
  });
});
