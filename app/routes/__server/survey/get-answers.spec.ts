import { eventFactory } from 'tests/factories/events.ts';
import { surveyFactory } from 'tests/factories/surveys.ts';
import { userFactory } from 'tests/factories/users.ts';

import { getAnswers } from './get-answers.server.ts';

describe('#getAnswers', () => {
  it('returns the user answers for an event', async () => {
    const event = await eventFactory({ traits: ['withSurvey'] });
    const user1 = await userFactory();
    await surveyFactory({
      user: user1,
      event,
      attributes: { answers: { gender: 'male' } },
    });
    const user2 = await userFactory();
    await surveyFactory({
      user: user2,
      event,
      attributes: { answers: { gender: 'female' } },
    });

    const answers = await getAnswers(event.slug, user2.id);

    expect(answers).toEqual({ gender: 'female' });
  });

  it('returns nothing when user hasnt respond any questions', async () => {
    const event = await eventFactory({ traits: ['withSurvey'] });
    const user = await userFactory();
    const answers = await getAnswers(event.slug, user.id);
    expect(answers).toEqual({});
  });

  it('returns nothing when event doesnt exist', async () => {
    const user = await userFactory();
    const answers = await getAnswers('XXX', user.id);
    expect(answers).toEqual({});
  });
});
