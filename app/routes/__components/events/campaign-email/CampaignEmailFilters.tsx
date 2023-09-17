import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Form, useLocation, useSearchParams, useSubmit } from '@remix-run/react';
import { cx } from 'class-variance-authority';

import { Button } from '~/design-system/Buttons.tsx';
import { Input } from '~/design-system/forms/Input.tsx';

import { CampaignType } from './CampaignEmailList.tsx';

type Props = { type: CampaignType };

export function CampaignEmailFilters({ type }: Props) {
  const submit = useSubmit();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const emailStatus = type === CampaignType.ACCEPTATION ? 'emailAcceptedStatus' : 'emailRejectedStatus';
  const isSendEmailPage = searchParams.get(emailStatus) !== 'sent';

  function handleChange(value: string) {
    const params = Object.fromEntries(searchParams);
    submit({ ...params, [emailStatus]: value }, { method: 'GET', action: pathname });
  }

  return (
    <Form action={pathname} method="GET" className="mt-4 flex justify-between gap-2">
      <Input
        name="query"
        type="search"
        aria-label="Find a proposal"
        placeholder="Find a proposal"
        className="w-full sm:w-80"
        autoComplete="off"
        defaultValue={searchParams.get('query') || ''}
        icon={MagnifyingGlassIcon}
      />
      <span className="isolate inline-flex rounded-md">
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleChange('not-sent')}
          className={cx('rounded-none rounded-l-md focus:z-10 focus:ring-offset-0', {
            'bg-gray-100': isSendEmailPage,
          })}
        >
          Emails to send
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleChange('sent')}
          className={cx('rounded-none rounded-r-md border-l-0 focus:z-10 focus:ring-offset-0', {
            'bg-gray-100': !isSendEmailPage,
          })}
        >
          Sent emails
        </Button>
      </span>
    </Form>
  );
}
