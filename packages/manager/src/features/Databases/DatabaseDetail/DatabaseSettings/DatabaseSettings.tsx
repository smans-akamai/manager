import { Database } from '@linode/api-v4/lib/databases/types';
import * as React from 'react';

import { Divider } from 'src/components/Divider';
import { Typography } from 'src/components/Typography';
import { Paper } from 'src/components/Paper';
import { useProfile } from 'src/queries/profile/profile';

import AccessControls from '../AccessControls';
import DatabaseSettingsDeleteClusterDialog from './DatabaseSettingsDeleteClusterDialog';
import DatabaseSettingsMenuItem from './DatabaseSettingsMenuItem';
import DatabaseSettingsResetPasswordDialog from './DatabaseSettingsResetPasswordDialog';
import MaintenanceWindow from './MaintenanceWindow';
import DatabaseSettingsSuspendClusterDialog from './DatabaseSettingsSuspendClusterDialog';

interface Props {
  database: Database;
  disabled?: boolean;
}

export const DatabaseSettings: React.FC<Props> = (props) => {
  const { database, disabled } = props;
  const { data: profile } = useProfile();

  const accessControlCopy = (
    <Typography>
      Add or remove IPv4 addresses or ranges that should be authorized to access
      your cluster.
    </Typography>
  );

  const resetRootPasswordCopy =
    'Resetting your root password will automatically generate a new password. You can view the updated password on your database cluster summary page. ';

  const suspendClusterCopy =
    'Suspend cluster lorem ipsum dolor sit amet, consectetur adipiscing elit.';

  const powerOnClusterCopy =
    'Power on cluster lorem ipsum dolor sit amet, consectetur adipiscing elit.';

  const deleteClusterCopy =
    'Deleting a database cluster is permanent and cannot be undone.';

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [
    isSuspendClusterDialogOpen,
    setIsSuspendClusterDialogOpen,
  ] = React.useState(false);
  const [
    isResetRootPasswordDialogOpen,
    setIsResetRootPasswordDialogOpen,
  ] = React.useState(false);
  const [isSuspended, setIsSuspended] = React.useState(false);

  const onResetRootPassword = () => {
    setIsResetRootPasswordDialogOpen(true);
  };

  const onDeleteCluster = () => {
    setIsDeleteDialogOpen(true);
  };

  const onSuspendCluster = () => {
    setIsSuspendClusterDialogOpen(true);
  };

  const onDeleteClusterClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const onResetRootPasswordClose = () => {
    setIsResetRootPasswordDialogOpen(false);
  };

  const onSuspendClusterClose = () => {
    setIsSuspendClusterDialogOpen(false);
  };

  // To Be Removed: Mocks toggling the suspended state for now
  // Figure out what drives the suspended state from the backend
  const toggleSuspend = () => {
    setIsSuspended((isSuspended) => !isSuspended);
  };

  return (
    <>
      <Paper>
        <DatabaseSettingsMenuItem
          buttonText={isSuspended ? 'Power On Cluster' : 'Suspend Cluster'}
          descriptiveText={
            isSuspended ? powerOnClusterCopy : suspendClusterCopy
          }
          disabled={disabled}
          onClick={onSuspendCluster}
          sectionTitle={isSuspended ? 'Power On Cluster' : 'Suspend Cluster'}
        />
        <Divider spacingBottom={22} spacingTop={28} />
        <AccessControls
          database={database}
          description={accessControlCopy}
          disabled={disabled}
        />
        <Divider spacingBottom={22} spacingTop={28} />
        <DatabaseSettingsMenuItem
          buttonText="Reset Root Password"
          descriptiveText={resetRootPasswordCopy}
          disabled={disabled}
          onClick={onResetRootPassword}
          sectionTitle="Reset Root Password"
        />
        <Divider spacingBottom={22} spacingTop={28} />
        <DatabaseSettingsMenuItem
          buttonText="Delete Cluster"
          descriptiveText={deleteClusterCopy}
          disabled={Boolean(profile?.restricted)}
          onClick={onDeleteCluster}
          sectionTitle="Delete Cluster"
        />
        <Divider spacingBottom={22} spacingTop={28} />
        <MaintenanceWindow
          database={database}
          disabled={disabled}
          timezone={profile?.timezone}
        />
      </Paper>
      <DatabaseSettingsDeleteClusterDialog
        databaseEngine={database.engine}
        databaseID={database.id}
        databaseLabel={database.label}
        onClose={onDeleteClusterClose}
        open={isDeleteDialogOpen}
      />
      <DatabaseSettingsResetPasswordDialog
        databaseEngine={database.engine}
        databaseID={database.id}
        onClose={onResetRootPasswordClose}
        open={isResetRootPasswordDialogOpen}
      />
      <DatabaseSettingsSuspendClusterDialog
        databaseEngine={database.engine}
        databaseID={database.id}
        databaseLabel={database.label}
        onClose={onSuspendClusterClose}
        open={isSuspendClusterDialogOpen}
        toggleSuspend={toggleSuspend}
        action={isSuspended ? 'resume' : 'suspend'}
      />
    </>
  );
};

export default DatabaseSettings;
