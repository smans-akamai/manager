import { Engine } from '@linode/api-v4/lib/databases';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Checkbox } from 'src/components/Checkbox';
import { ConfirmationDialog } from 'src/components/ConfirmationDialog/ConfirmationDialog';
import { Notice } from 'src/components/Notice/Notice';
import { Typography } from 'src/components/Typography';
import { useSuspendDatabaseMutation } from 'src/queries/databases/databases';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

export interface SuspendDialogProps {
  databaseEngine: Engine;
  databaseId: number;
  databaseLabel: string;
  onClose: () => void;
  open: boolean;
}

export const DatabaseSettingsSuspendClusterDialog = (
  props: SuspendDialogProps
) => {
  const { databaseEngine, databaseId, databaseLabel, onClose, open } = props;
  const { enqueueSnackbar } = useSnackbar();
  const {
    mutateAsync: suspendDatabase,
    isPending,
    isError,
    error,
    reset,
  } = useSuspendDatabaseMutation(databaseEngine, databaseId);

  const defaultError = 'There was an error suspending this Database Cluster.';
  const [hasConfirmed, setHasConfirmed] = React.useState(false);
  const { push } = useHistory();

  const onSuspendCluster = () => {
    suspendDatabase()
      .then(() => {
        enqueueSnackbar('Database Cluster suspended successfully.', {
          variant: 'success',
        });
        onClose();
        setHasConfirmed(false);
        push('/databases');
      })
      .catch(() => {
        setHasConfirmed(false);
      });
  };

  const onCancel = () => {
    onClose();
    reset();
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
        loading: isPending,
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
    <ConfirmationDialog
      maxWidth="sm"
      actions={actions}
      onClose={onClose}
      open={open}
      title={`Suspend ${databaseLabel} cluster?`}
    >
      {isError && (
        <Notice
          text={getAPIErrorOrDefault(error, defaultError)[0].reason}
          variant="error"
        />
      )}
      <Notice variant="warning">
        <Typography style={{ fontSize: '0.875rem' }}>
          <b>{suspendClusterCopy}</b>
        </Typography>
      </Notice>
      <div>
        <Checkbox
          checked={hasConfirmed}
          onChange={() => setHasConfirmed((confirmed) => !confirmed)}
          text="I understand the effects of this action."
        />
      </div>
    </ConfirmationDialog>
  );
};
