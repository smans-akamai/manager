import { Button, Typography } from '@linode/ui';
import { Grid } from '@mui/material';
import React from 'react';

import {
  StyledGridContainer,
  StyledLabelTypography,
  StyledValueGrid,
} from '../DatabaseSummary/DatabaseSummaryClusterConfiguration.style';

import type { Database } from '@linode/api-v4';
import type { Theme } from '@mui/material';

interface Props {
  database: Database;
  disabled?: boolean;
}

export const DatabaseManageNetworking = ({ database }: Props) => {
  const hasVPCConfigured = database?.private_network?.vpc_id;
  const gridValueSize = { md: 8, xs: 9 };
  const gridLabelSize = { md: 4, xs: 3 };

  return (
    <>
      <Grid container justifyContent={'space-between'}>
        <Grid size={9}>
          <Typography variant="h2">Manage Networking</Typography>
          <Typography sx={{ mb: 1, mt: 1, maxWidth: '500px' }}>
            Update access settings or the VPC assignment.
            <br />
            Note that a change of VPC assignment settings can disrupt service
            availability. Avoid writing data to the database while a change is
            in progress.
          </Typography>
        </Grid>
        <Button
          buttonType="outlined"
          disabled={true} // Disabled until manage networking is fully implemented
          sx={(theme: Theme) => ({
            height: '1px',
            minWidth: 225,
            [theme.breakpoints.down('md')]: {
              alignSelf: 'flex-start',
              marginBottom: '1rem',
            },
          })}
          title="Manage Networking"
        >
          Manage Networking
        </Button>
      </Grid>

      <StyledGridContainer container size={{ lg: 7, md: 10 }} spacing={0}>
        <Grid size={gridLabelSize}>
          <StyledLabelTypography>Connection Type</StyledLabelTypography>
        </Grid>
        <StyledValueGrid size={gridValueSize}>
          <Typography>VPC</Typography>
        </StyledValueGrid>
        {hasVPCConfigured ? (
          <>
            <Grid size={gridLabelSize}>
              <StyledLabelTypography>VPC</StyledLabelTypography>
            </Grid>
            <StyledValueGrid size={gridValueSize}>
              <Typography>VPC-TEST-1</Typography>
            </StyledValueGrid>
            <Grid size={gridLabelSize}>
              <StyledLabelTypography>Subnet</StyledLabelTypography>
            </Grid>
            <StyledValueGrid size={gridValueSize}>
              <Typography>Subnet-02 (0.0.0.0/24)</Typography>
            </StyledValueGrid>
          </>
        ) : null}

        <Grid size={gridLabelSize}>
          <StyledLabelTypography>Host</StyledLabelTypography>
        </Grid>
        <StyledValueGrid size={gridValueSize}>
          <Typography>some-random-host</Typography>
        </StyledValueGrid>
        <Grid size={gridLabelSize}>
          <StyledLabelTypography>Read-only Host</StyledLabelTypography>
        </Grid>
        <StyledValueGrid size={gridValueSize}>
          <Typography>some-random-readonlyhost</Typography>
        </StyledValueGrid>
        {hasVPCConfigured ? (
          <>
            <Grid size={gridLabelSize}>
              <StyledLabelTypography>Public Access</StyledLabelTypography>
            </Grid>
            <StyledValueGrid size={gridValueSize}>
              <Typography>No</Typography>
            </StyledValueGrid>
          </>
        ) : null}
      </StyledGridContainer>
    </>
  );
};
