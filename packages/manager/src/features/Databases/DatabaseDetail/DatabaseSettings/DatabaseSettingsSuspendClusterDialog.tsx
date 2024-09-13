import { Engine } from '@linode/api-v4/lib/databases';
import { DialogActions } from '@mui/material';
import { useSnackbar } from 'notistack';
import * as React from 'react';
// import { useHistory } from 'react-router-dom';
import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Checkbox } from 'src/components/Checkbox';
import { Dialog } from 'src/components/Dialog/Dialog';

import { Notice } from 'src/components/Notice/Notice';
import { Typography } from 'src/components/Typography';
import {
  useResumeDatabaseMutation,
  useSuspendDatabaseMutation,
} from 'src/queries/databases/databases';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

export interface SuspendDialogProps {
  databaseEngine: Engine;
  databaseID: number;
  databaseLabel: string;
  onClose: () => void;
  open: boolean;
  action: 'suspend' | 'resume';
  toggleSuspend: () => void;
}

export const DatabaseSettingsSuspendClusterDialog: React.FC<SuspendDialogProps> = (
  props
) => {
  const {
    databaseEngine,
    databaseID,
    databaseLabel,
    onClose,
    open,
    toggleSuspend,
    action,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: suspendDatabase } = useSuspendDatabaseMutation(
    databaseEngine,
    databaseID
  );
  const { mutateAsync: resumeDatabase } = useResumeDatabaseMutation(
    databaseEngine,
    databaseID
  );
  const defaultError = 'There was an error suspending this Database Cluster.';
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasConfirmed, setHasConfirmed] = React.useState(false);
  // const { push } = useHistory();

  const onSuspendCluster = () => {
    setIsLoading(true);
    // console.log('Loading suspend cluster...')
    // setTimeout(() => {
    //   // console.log('Suspend cluster finished loading!');
    //   setIsLoading((isLoading) => !isLoading);
    //   toggleSuspend(); // mocking behavior, to be removed
    //   onClose();
    //   setHasConfirmed(false);
    // }, 5000);
    suspendDatabase()
      .then(() => {
        enqueueSnackbar('Database Cluster suspended successfully.', {
          variant: 'success',
        });
        onClose();
      })
      .catch((e) => {
        setIsLoading(false);
        setError(getAPIErrorOrDefault(e, defaultError)[0].reason);
      })
      .finally(() => {
        setIsLoading(false);
        setHasConfirmed(false);
        toggleSuspend(); // mocking behavior, to be removed
      });
  };

  const onResumeCluster = () => {
    setIsLoading(true);
    // console.log('Loading resume cluster...');
    // setTimeout(() => {
    //   // console.log('Resume cluster has finished loading!');
    //   setIsLoading((isLoading) => !isLoading);
    //   toggleSuspend(); // mocking behavior, to be removed
    //   onClose();
    //   setHasConfirmed(false);
    // }, 5000);
    resumeDatabase()
      .then(() => {
        enqueueSnackbar('Database Cluster powered on successfully.', {
          variant: 'success',
        });
        onClose();
      })
      .catch((e) => {
        setIsLoading(false);
        setError(getAPIErrorOrDefault(e, defaultError)[0].reason);
      })
      .finally(() => {
        setIsLoading(false);
        setHasConfirmed(false);
        toggleSuspend(); // mocking behavior, to be removed
      });
  };

  const onCancel = () => {
    onClose();
    setHasConfirmed(false);
  };

  const suspendClusterCopy =
    'This cluster will stop serving clients immediately. You can power on the cluster again later, and it will resume in the same state. Learn more.';

  const resumeClusterCopy =
    'This cluster will power on and resume serving clients immediately. Learn more.';

  const actions = (
    <ActionsPanel
      primaryButtonProps={{
        disabled: !hasConfirmed,
        label: action === 'suspend' ? 'Suspend Cluster' : 'Power On Cluster',
        loading: isLoading,
        onClick: action === 'suspend' ? onSuspendCluster : onResumeCluster,
      }}
      secondaryButtonProps={{
        label: 'Cancel',
        onClick: onCancel,
      }}
      style={{ padding: 0 }}
    />
  );

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title={`${
        action === 'suspend' ? 'Suspend' : 'Power On'
      } ${databaseLabel}`}
    >
      {error ? <Notice text={error} variant="error" /> : null}
      <Notice variant="warning">
        <Typography style={{ fontSize: '0.875rem' }}>
          {action === 'suspend' ? suspendClusterCopy : resumeClusterCopy}
        </Typography>
      </Notice>
      <div>
        <Checkbox
          checked={hasConfirmed}
          onChange={() => setHasConfirmed((confirmed) => !confirmed)}
          text="I understand the effects of this action."
        />
      </div>

      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default DatabaseSettingsSuspendClusterDialog;
