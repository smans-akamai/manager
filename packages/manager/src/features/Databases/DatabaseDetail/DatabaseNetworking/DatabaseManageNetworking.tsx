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
          disabled={true} // Disabled until networking management is implemented
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

      <StyledGridContainer container size={{ lg: 6, md: 8 }} spacing={0}>
        <Grid
          size={{
            md: 3,
            xs: 3,
          }}
        >
          <StyledLabelTypography>Connection Type</StyledLabelTypography>
        </Grid>
        <StyledValueGrid size={{ md: 8, xs: 8 }}>
          <Typography>VPC</Typography>
        </StyledValueGrid>
        {hasVPCConfigured ? (
          <>
            <Grid
              size={{
                md: 3,
                xs: 3,
              }}
            >
              <StyledLabelTypography>VPC</StyledLabelTypography>
            </Grid>
            <StyledValueGrid size={{ md: 8, xs: 8 }}>
              <Typography>VPC-TEST-1</Typography>
            </StyledValueGrid>
            <Grid
              size={{
                md: 3,
                xs: 3,
              }}
            >
              <StyledLabelTypography>Subnet</StyledLabelTypography>
            </Grid>
            <StyledValueGrid size={{ md: 8, xs: 8 }}>
              <Typography>Subnet-02 (0.0.0.0/24)</Typography>
            </StyledValueGrid>
          </>
        ) : null}

        <Grid
          size={{
            md: 3,
            xs: 3,
          }}
        >
          <StyledLabelTypography>Host</StyledLabelTypography>
        </Grid>
        <StyledValueGrid size={{ md: 8, xs: 8 }}>
          <Typography>some-random-host</Typography>
        </StyledValueGrid>
        <Grid
          size={{
            md: 3,
            xs: 3,
          }}
        >
          <StyledLabelTypography>Read-only Host</StyledLabelTypography>
        </Grid>
        <StyledValueGrid size={{ md: 8, xs: 8 }}>
          <Typography>some-random-readonlyhost</Typography>
        </StyledValueGrid>
        {hasVPCConfigured ? (
          <>
            <Grid
              size={{
                md: 3,
                xs: 3,
              }}
            >
              <StyledLabelTypography>Public Access</StyledLabelTypography>
            </Grid>
            <StyledValueGrid size={{ md: 8, xs: 8 }}>
              <Typography>No</Typography>
            </StyledValueGrid>
          </>
        ) : null}
      </StyledGridContainer>
    </>
  );
};
