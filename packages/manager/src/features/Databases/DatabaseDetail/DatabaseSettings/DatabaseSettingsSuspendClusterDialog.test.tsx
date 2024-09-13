import { fireEvent } from '@testing-library/react';
import * as React from 'react';
import { renderWithTheme } from 'src/utilities/testHelpers';

import {
  DatabaseSettingsSuspendClusterDialog,
  SuspendDialogProps,
} from './DatabaseSettingsSuspendClusterDialog';
import { Engine } from '@linode/api-v4';

const mockEngine: Engine = 'mysql';
const props: SuspendDialogProps = {
  databaseEngine: mockEngine,
  databaseID: 1234,
  databaseLabel: 'database-1',
  onClose: vi.fn(),
  open: true,
  action: 'suspend',
  toggleSuspend: () => null,
};

describe('Confirmation Dialog', () => {
  it('renders the confirmation dialog', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <DatabaseSettingsSuspendClusterDialog {...props} />
    );

    expect(getByText('Suspend Cluster')).toBeVisible();
    expect(getByTestId('CloseIcon')).toBeVisible();
  });

  // Test the different modes
  // Which text displays and what API calls get made when you click that version of submit

  // Test disabling behavior

  // Test error handling

  it('closes the confirmaton dialog if the X button is clicked', () => {
    const { getByTestId } = renderWithTheme(
      <DatabaseSettingsSuspendClusterDialog {...props} />
    );

    const closeButton = getByTestId('CloseIcon');
    expect(closeButton).toBeVisible();

    fireEvent.click(closeButton);
    expect(props.onClose).toHaveBeenCalled();
  });
});
