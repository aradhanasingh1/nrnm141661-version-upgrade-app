import React from 'react'
import { Typography, Paper, Grid } from '@material-ui/core'

class DashboardPage extends React.Component {
  render() {
    return (
      <div
        style={{
          padding: 24,
          background: '#f4f6f8',
          minHeight: '100vh'
        }}
      >
        {/* PAGE TITLE */}
        <Typography
          style={{
            fontSize: 28,
            fontWeight: 500,
            marginBottom: 24
          }}
        >
          Dashboard
        </Typography>

        {/* ===== TOP STATS ===== */}
        <Grid container spacing={16}>
          {[
            { label: 'NEW OFFERS', value: 35, color: '#4caf50', icon: '📄' },
            { label: 'OFFERS ON HOLD', value: 219, color: '#ff9800', icon: '⏳' },
            { label: 'WAITING ON RFI', value: 218, color: '#00acc1', icon: '📬' },
            { label: 'WAITING APPROVAL', value: 118, color: '#f44336', icon: '⚠️' }
          ].map((item, i) => (
            <Grid item xs={12} md={3} key={i}>
              <Paper
                style={{
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  background: '#fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 4,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    marginRight: 16,
                    background: item.color
                  }}
                >
                  {item.icon}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#777'
                    }}
                  >
                    {item.label}
                  </div>

                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 600
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* ===== CHART SECTION ===== */}
        <Grid container spacing={16} style={{ marginTop: 16 }}>
          {[1, 2, 3].map(i => (
            <Grid item xs={12} md={4} key={i}>
              <Paper
                style={{
                  padding: 16,
                  height: 260,
                  background: '#fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              >
                <Typography variant="caption">
                  Chart Section {i}
                </Typography>

                <Typography variant="caption">
                  Placeholder
                </Typography>

                <div
                  style={{
                    height: 160,
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #e0e0e0, #f5f5f5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#777',
                    fontSize: 13,
                    marginTop: 8
                  }}
                >
                  Chart placeholder
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </div>
    )
  }
}

export default DashboardPage

