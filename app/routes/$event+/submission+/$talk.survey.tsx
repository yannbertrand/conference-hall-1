import { parseWithZod } from '@conform-to/zod';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import type { ActionFunction, LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { SubmissionSteps } from '~/.server/cfp-submission-funnel/submission-steps.ts';
import { CfpSurvey } from '~/.server/cfp-survey/cfp-survey.ts';
import { SpeakerAnswers } from '~/.server/cfp-survey/speaker-answers.ts';
import { SurveySchema } from '~/.server/cfp-survey/speaker-answers.types.ts';
import { Button } from '~/design-system/buttons.tsx';
import { Card } from '~/design-system/layouts/card.tsx';
import { Page } from '~/design-system/layouts/page.tsx';
import { H2 } from '~/design-system/typography.tsx';
import { requireSession } from '~/libs/auth/session.ts';
import { SurveyForm } from '~/routes/__components/talks/talk-forms/survey-form.tsx';

export const handle = { step: 'survey' };

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireSession(request);
  invariant(params.event, 'Invalid event slug');

  const questions = await CfpSurvey.of(params.event).questions();
  const answers = await SpeakerAnswers.for(userId, params.event).getAnswers();
  return { questions, answers };
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireSession(request);
  const form = await request.formData();
  invariant(params.event, 'Invalid event slug');
  invariant(params.talk, 'Invalid talk id');

  const result = parseWithZod(form, { schema: SurveySchema });
  if (result.status !== 'success') return null;

  await SpeakerAnswers.for(userId, params.event).save(result.value);

  const nextStep = await SubmissionSteps.nextStepFor('survey', params.event, params.talk);
  return redirect(nextStep.path);
};

export default function SubmissionSurveyRoute() {
  const navigate = useNavigate();
  const { questions, answers } = useLoaderData<typeof loader>();

  return (
    <Page>
      <Card>
        <Card.Title>
          <H2>We have some questions for you</H2>
        </Card.Title>
        <Card.Content>
          <SurveyForm id="survey-form" questions={questions} initialValues={answers} />
        </Card.Content>
        <Card.Actions>
          <Button onClick={() => navigate(-1)} variant="secondary">
            Go back
          </Button>
          <Button type="submit" form="survey-form" iconRight={ArrowRightIcon}>
            Continue
          </Button>
        </Card.Actions>
      </Card>
    </Page>
  );
}
