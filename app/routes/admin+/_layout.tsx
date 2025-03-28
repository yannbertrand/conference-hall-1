import type { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { needsAdminRole } from '~/.server/admin/authorization.ts';

import { requireSession } from '~/libs/auth/session.ts';
import { Navbar } from '~/routes/__components/navbar/navbar.tsx';
import { AdminTabs } from './__components/admin-tabs.tsx';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireSession(request);

  await needsAdminRole(userId);

  return null;
};

export default function AdminLayoutRoute() {
  return (
    <>
      <Navbar />
      <AdminTabs />
      <Outlet />
    </>
  );
}
