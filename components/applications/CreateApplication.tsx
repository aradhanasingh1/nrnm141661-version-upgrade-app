import React, { useState } from 'react'
import axios from 'axios'
import ApplicationType from '../../types/ApplicationType'
import PurposeType from '../../types/PurposeType'
import CurrencyType from '../../types/CurrencyType'

import {
    Paper,
    Typography,
    TextField,
    Button,
    MenuItem
} from '@material-ui/core'

const CreateApplication: React.FC = () => {
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [applicantEmail, setApplicantEmail] = useState('')
    const [applicantPhone, setApplicantPhone] = useState('')
    const [applicationType, setApplicationType] = useState<ApplicationType>(
        ApplicationType.PERSONAL
    );
    const [purpose, setPurpose] = useState<PurposeType>(PurposeType.HOME_RENOVATION);
    const [purposeDescription, setPurposeDescription] = useState('');
    const [currency, setCurrency] = useState<CurrencyType>(CurrencyType.INR);


    const submit = async () => {
       const response = await axios.post('/api/application/create', {
            applicantName: name,
            applicantEmail: applicantEmail,
            applicantPhone: applicantPhone,
            amount: Number(amount),
            currency: currency,
            applicationType: applicationType,
            purpose: purpose,
            purposeDescription: purposeDescription
        })
        const data = response.data;
        if(response.status === 201) {
            alert(`Application created successfully! Your application number is ${data.applicationNumber}`)    
        } else {
            alert('Failed to create application. Please try again.')
        }
    }

    return (
        <Paper style={{ padding: 24,  width: '100%' }}>
            <Typography variant="title" gutterBottom>
                Create Application
            </Typography>

            <TextField
                select
                label="Application Type"
                fullWidth
                margin="normal"
                value={applicationType}
                onChange={e =>
                    setApplicationType(e.target.value as ApplicationType)
                }
            >
                <MenuItem value={ApplicationType.PERSONAL}>
                    Personal
                </MenuItem>
                <MenuItem value={ApplicationType.BUSINESS}>
                    Business
                </MenuItem>
            </TextField>


            <TextField
                label="Applicant Name"
                fullWidth
                margin="normal"
                value={name}
                onChange={e => setName(e.target.value)}
            />

            <TextField
                label="Applicant Email"
                fullWidth
                margin="normal"
                value={applicantEmail}
                onChange={e => setApplicantEmail(e.target.value)}
            />


            <TextField
                label="Applicant Phone"
                fullWidth
                margin="normal"
                value={applicantPhone}
                onChange={e => setApplicantPhone(e.target.value)}
            />

            <TextField
                label="Amount"
                fullWidth
                margin="normal"
                value={amount}
                onChange={e => setAmount(e.target.value)}
            />

            <TextField
                select
                label="Currency"
                fullWidth
                margin="normal"
                value={currency}
                onChange={e =>
                    setCurrency(e.target.value as CurrencyType)
                }
            >
                <MenuItem value={CurrencyType.INR}>INR (₹)</MenuItem>
                {/* <MenuItem value={CurrencyType.USD}>USD ($)</MenuItem> */}
                {/* <MenuItem value={CurrencyType.EUR}>EUR (€)</MenuItem> */}
            </TextField>


            <TextField
                select
                label="Purpose"
                fullWidth
                margin="normal"
                value={purpose}
                onChange={e =>
                    setPurpose(e.target.value as PurposeType)
                }
            >
                <MenuItem value={PurposeType.HOME_RENOVATION}>Home Renovation</MenuItem>
                <MenuItem value={PurposeType.EDUCATION}>Education</MenuItem>
                <MenuItem value={PurposeType.MEDICAL}>Medical</MenuItem>
                <MenuItem value={PurposeType.BUSINESS_EXPANSION}>Business Expansion</MenuItem>
                <MenuItem value={PurposeType.WORKING_CAPITAL}>Working Capital</MenuItem>
                <MenuItem value={PurposeType.OTHER}>Other</MenuItem>
            </TextField>

            <TextField
                label="Purpose Description"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={purposeDescription}
                onChange={e => setPurposeDescription(e.target.value)}
                placeholder="Describe the purpose of the credit application"
            />

            <Button
                color="primary"
                variant="contained"
                onClick={submit}
            >
                Submit
            </Button>
        </Paper>
    )
}

export default CreateApplication
