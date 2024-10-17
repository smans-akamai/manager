import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';

import type { DatabaseStatus, Engine } from '@linode/api-v4';
import type { Action } from 'src/components/ActionMenu/ActionMenu';

interface Props {
  databaseEngine: Engine;
  databaseId: number;
  databaseLabel: string;
  handlers: ActionHandlers;
  databaseStatus: DatabaseStatus;
}

export interface ActionHandlers {
  handleDelete: () => void;
  handleManageAccessControls: () => void;
  handleResetPassword: () => void;
  handleSuspend: () => void;
  handleResume: () => void;
}

export const DatabaseActionMenu = (props: Props) => {
  const {
    databaseEngine,
    databaseId,
    databaseLabel,
    handlers,
    databaseStatus,
  } = props;

  // const databaseStatus = 'running';
  const isDatabaseNotActive = databaseStatus !== 'active';
  const isDatabaseSuspended =
    databaseStatus === 'suspended' || databaseStatus === 'suspending';

  const history = useHistory();

  const actions: Action[] = [
    {
      disabled: isDatabaseNotActive,
      onClick: () => {
        // console.log('suspending');
      },
      title: 'Suspend',
    },
    {
      disabled: isDatabaseNotActive,
      onClick: handlers.handleManageAccessControls,
      title: 'Manage Access Controls',
    },
    {
      disabled: isDatabaseNotActive,
      onClick: handlers.handleResetPassword,
      title: 'Reset Root Password',
    },
    {
      disabled: isDatabaseNotActive,
      onClick: () => {
        history.push({
          pathname: `/databases/${databaseEngine}/${databaseId}/resize`,
        });
      },
      title: 'Resize',
    },
    {
      disabled: !isDatabaseSuspended,
      onClick: () => {
        // console.log('resuming');
      },
      title: 'Resume',
    },
    {
      disabled: isDatabaseNotActive,
      onClick: handlers.handleDelete,
      title: 'Delete',
    },
  ];

  return (
    <ActionMenu
      actionsList={actions}
      ariaLabel={`Action menu for Database ${databaseLabel}`}
    />
  );
};
