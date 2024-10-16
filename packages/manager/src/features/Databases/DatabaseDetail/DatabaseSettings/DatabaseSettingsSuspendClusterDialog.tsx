import { Engine } from '@linode/api-v4/lib/databases';
import { DialogActions } from '@mui/material';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Checkbox } from 'src/components/Checkbox';
import { Dialog } from 'src/components/Dialog/Dialog';

import { Notice } from 'src/components/Notice/Notice';
import { Typography } from 'src/components/Typography';
import { useSuspendDatabaseMutation } from 'src/queries/databases/databases';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

export interface SuspendDialogProps {
  databaseEngine: Engine;
  databaseID: number;
  databaseLabel: string;
  onClose: () => void;
  open: boolean;
}

export const DatabaseSettingsSuspendClusterDialog: React.FC<SuspendDialogProps> = (
  props
) => {
  const { databaseEngine, databaseID, databaseLabel, onClose, open } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: suspendDatabase } = useSuspendDatabaseMutation(
    databaseEngine,
    databaseID
  );
  //   const { mutateAsync: resumeDatabase } = useResumeDatabaseMutation(
  //     databaseEngine,
  //     databaseID
  //   );
  const defaultError = 'There was an error suspending this Database Cluster.';
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasConfirmed, setHasConfirmed] = React.useState(false);
  const { push } = useHistory();

  const onSuspendCluster = () => {
    setIsLoading(true);
    // setTimeout(() => {
    //   // console.log('Suspend cluster finished loading!');
    //   setIsLoading((isLoading) => !isLoading);
    //   onClose();
    //   setHasConfirmed(false);
    // }, 5000);
    suspendDatabase()
      .then(() => {
        enqueueSnackbar('Database Cluster suspended successfully.', {
          variant: 'success',
        });
        onClose();
        push('/databases');
      })
      .catch((e: any) => {
        setIsLoading(false);
        setError(getAPIErrorOrDefault(e, defaultError)[0].reason);
      })
      .finally(() => {
        setIsLoading(false);
        setHasConfirmed(false);
      });
  };

  const onCancel = () => {
    onClose();
    setHasConfirmed(false);
  };

  const suspendClusterCopy = `A suspended cluster stops working immediately and you won't be billed for it.
    You can resume the clusters work within 180 days from its suspension.
    After that time, the cluster will be deleted permanently.`;

  const actions = (
    <ActionsPanel
      primaryButtonProps={{
        disabled: !hasConfirmed,
        label: 'Suspend Cluster',
        loading: isLoading,
        onClick: onSuspendCluster,
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
      title={`Suspend ${databaseLabel} cluster?`}
    >
      {error ? <Notice text={error} variant="error" /> : null}
      <Notice variant="warning">
        <Typography style={{ fontSize: '0.875rem' }}>
          {suspendClusterCopy}
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
