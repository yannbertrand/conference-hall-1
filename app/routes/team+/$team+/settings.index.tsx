import { parseWithZod } from '@conform-to/zod';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { TeamUpdateSchema, UserTeam } from '~/.server/team/user-team.ts';
import { Button } from '~/design-system/buttons.tsx';
import { Card } from '~/design-system/layouts/card.tsx';
import { H2, Subtitle } from '~/design-system/typography.tsx';
import { requireSession } from '~/libs/auth/session.ts';
import { redirectWithToast } from '~/libs/toasts/toast.server.ts';
import { TeamForm } from '~/routes/__components/teams/team-form.tsx';

import { TeamMembers } from '~/.server/team/team-members.ts';
import { useCurrentTeam } from '~/routes/__components/contexts/team-context.tsx';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireSession(request);
  return null;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await requireSession(request);
  invariant(params.team, 'Invalid team slug');

  const form = await request.formData();
  const intent = form.get('intent') as string;

  switch (intent) {
    case 'save-team': {
      const result = parseWithZod(form, { schema: TeamUpdateSchema });
      if (result.status !== 'success') return result.error;

      try {
        const team = await UserTeam.for(userId, params.team).updateSettings(result.value);
        return redirectWithToast(`/team/${team.slug}/settings`, 'success', 'Team settings saved.');
      } catch (_error) {
        return { slug: ['This URL already exists, please try another one.'] };
      }
    }
    case 'leave-team': {
      await TeamMembers.for(userId, params.team).leave();
      return redirectWithToast('/speaker', 'success', "You've successfully left the team.");
    }
  }
  return null;
};

export default function TeamSettingsRoute() {
  const errors = useActionData<typeof action>();
  const currentTeam = useCurrentTeam();
  const { canEditTeam, canLeaveTeam } = currentTeam.userPermissions;

  return (
    <div className="space-y-8">
      {canEditTeam ? (
        <Card as="section">
          <Form method="POST" preventScrollReset>
            <Card.Title>
              <H2>General</H2>
              <Subtitle>Change team name and URL.</Subtitle>
            </Card.Title>

            <Card.Content>
              <TeamForm initialValues={currentTeam} errors={errors} />
            </Card.Content>

            <Card.Actions>
              <Button type="submit" name="intent" value="save-team">
                Save
              </Button>
            </Card.Actions>
          </Form>
        </Card>
      ) : null}

      {canLeaveTeam ? (
        <Card as="section">
          <Form
            method="POST"
            preventScrollReset
            onSubmit={(event) => {
              if (!confirm(`Are you sure you want to leave the "${currentTeam.name}" team?`)) {
                event.preventDefault();
              }
            }}
          >
            <Card.Title>
              <H2>Leave the "{currentTeam.name}" team</H2>
              <Subtitle>
                If you leave the team, you’ll lose access to it and won’t be able to manage its events.
              </Subtitle>
            </Card.Title>

            <Card.Content>
              <div>
                <Button type="submit" name="intent" value="leave-team" variant="important">
                  Leave "{currentTeam.name}" team
                </Button>
              </div>
            </Card.Content>
          </Form>
        </Card>
      ) : null}
    </div>
  );
}
