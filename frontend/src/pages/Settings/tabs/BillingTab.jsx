import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Grid,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const PlanCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const PlanFeatureList = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  '& > *': {
    marginBottom: theme.spacing(1),
  },
}));

const billingHistory = [
  {
    date: '2025-10-01',
    amount: '$29.99',
    status: 'Paid',
    invoice: '#INV-2025-001',
  },
  {
    date: '2025-09-01',
    amount: '$29.99',
    status: 'Paid',
    invoice: '#INV-2025-002',
  },
  // Add more billing history items as needed
];

const BillingTab = () => {
  const currentPlan = 'Pro Plan';
  const renewalDate = 'November 28, 2025';

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic quiz creation',
        'Up to 50 students',
        'Standard analytics',
        'Email support',
      ],
      current: false,
      action: {
        text: 'Current Plan',
        disabled: true,
      },
    },
    {
      name: 'Pro',
      price: '$29.99',
      period: 'per month',
      features: [
        'Unlimited quiz creation',
        'Unlimited students',
        'Advanced analytics',
        'Priority support',
        'Custom branding',
      ],
      current: true,
      action: {
        text: 'Current Plan',
        disabled: true,
      },
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'per organization',
      features: [
        'All Pro features',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'Team management',
      ],
      current: false,
      action: {
        text: 'Contact Sales',
        disabled: false,
      },
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Settings - Subscription
      </Typography>

      <StyledSection>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current Plan: {currentPlan}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Your subscription will renew on {renewalDate}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary">
                Change Plan
              </Button>
              <Button variant="outlined">
                Update Payment
              </Button>
            </Box>
          </CardContent>
        </Card>
      </StyledSection>

      <StyledSection>
        <Typography variant="h6" gutterBottom>
          Billing History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Invoice</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billingHistory.map((row) => (
                <TableRow key={row.invoice}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === 'Paid' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Link href="#" underline="hover">
                      {row.invoice}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Link href="#" underline="hover">
            View All Invoices
          </Link>
        </Box>
      </StyledSection>

      <StyledSection>
        <Typography variant="h6" gutterBottom>
          Plan Comparison
        </Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}>
          {plans.map((plan) => (
            <PlanCard key={plan.name}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h4" gutterBottom>
                  {plan.price}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {plan.period}
                </Typography>
                <PlanFeatureList>
                  {plan.features.map((feature, index) => (
                    <Typography key={index} component="div">
                      • {feature}
                    </Typography>
                  ))}
                </PlanFeatureList>
                <Button
                  variant={plan.current ? 'outlined' : 'contained'}
                  color="primary"
                  fullWidth
                  disabled={plan.action.disabled}
                >
                  {plan.action.text}
                </Button>
              </CardContent>
            </PlanCard>
          ))}
        </Box>
      </StyledSection>
    </Box>
  );
};

export default BillingTab;