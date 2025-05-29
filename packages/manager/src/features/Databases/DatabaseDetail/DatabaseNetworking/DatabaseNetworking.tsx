import { Paper } from '@linode/ui';
import React from 'react';

import type { Database } from '@linode/api-v4';

interface Props {
  database: Database;
  disabled?: boolean;
}

export const DatabaseNetworking = ({ database }: Props) => {
  return (
    <Paper sx={{ marginTop: 2 }}>
      <h2>Networking Tab Content</h2>
      <p>{database?.label}</p>
    </Paper>
  );
};
