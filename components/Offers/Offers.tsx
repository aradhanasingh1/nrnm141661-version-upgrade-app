import React from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@material-ui/core';

const dummyOffers = [
  { id: 1, title: 'Personal Loan', description: 'Get up to ₹5,00,000 with low interest rates.' },
  { id: 2, title: 'Credit Card', description: 'Enjoy cashback and rewards on every purchase.' },
  { id: 3, title: 'Home Loan', description: 'Affordable EMI options for your dream home.' },
];

export default function Offers() {
  return (
    <div style={{ padding: 20 }}>
      <Typography variant="title" gutterBottom>
        Available Offers
      </Typography>
      <Grid container spacing={8}>
        {dummyOffers.map((offer) => (
          <Grid item xs={12} sm={6} md={4} key={offer.id}>
            <Card>
              <CardContent>
                <Typography variant="title">{offer.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {offer.description}
                </Typography>
                <Button variant="contained" color="primary" style={{ marginTop: 10 }}>
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
