import { useState } from 'react';
import './App.css';
import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Snackbar, Alert } from '@mui/material';
import { Send, ContentCopy } from '@mui/icons-material';
import axios from 'axios';

function App() {
    const [emailContent, setEmailContent] = useState('');
    const [tone, setTone] = useState('');
    const [generatedReply, setGeneratedReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post("http://localhost:8080/api/email/generate", { emailContent, tone });
            setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
        } catch (error) {
            setError('Failed to generate email reply. Please try again');
            console.error(error);
            setOpenErrorSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4, background: 'linear-gradient(145deg, #f5f5f5, #ffffff)', borderRadius: 3, boxShadow: 5 }}>
            <Typography variant='h3' component="h1" gutterBottom color="primary" align="center">
                Email Reply Generator
            </Typography>

            <Box sx={{ mx: 3, mb: 2 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={6}
                    variant='outlined'
                    label="Original Email Content"
                    value={emailContent || ''}
                    onChange={(e) => setEmailContent(e.target.value)}
                    sx={{ mb: 2, backgroundColor: 'white', borderRadius: 1 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Tone (Optional)</InputLabel>
                    <Select
                        value={tone || ''}
                        label="Tone (Optional)"
                        onChange={(e) => setTone(e.target.value)}
                        sx={{ backgroundColor: 'white', borderRadius: 1 }}>
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="professional">Professional</MenuItem>
                        <MenuItem value="casual">Casual</MenuItem>
                        <MenuItem value="friendly">Friendly</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant='contained'
                    onClick={handleSubmit}
                    disabled={!emailContent || loading}
                    fullWidth
                    sx={{
                        backgroundColor: '#1976d2',
                        '&:hover': { backgroundColor: '#1565c0' },
                        borderRadius: 2,
                        py: 1.5,
                        transition: '0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : <Send sx={{ mr: 1 }} />}
                    {loading ? 'Generating...' : 'Generate Reply'}
                </Button>
            </Box>

            {error && (
                <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={() => setOpenErrorSnackbar(false)}>
                    <Alert onClose={() => setOpenErrorSnackbar(false)} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            )}

            {generatedReply && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant='h6' gutterBottom>
                        Generated Reply:
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        variant='outlined'
                        value={generatedReply || ''}
                        inputProps={{ readOnly: true }}
                        sx={{ backgroundColor: 'white', borderRadius: 1 }}
                    />

                    <Button
                        variant='outlined'
                        sx={{ mt: 2, backgroundColor: '#f0f0f0', '&:hover': { backgroundColor: '#e0e0e0' }, display: 'flex', alignItems: 'center' }}
                        onClick={() => navigator.clipboard.writeText(generatedReply)}>
                        <ContentCopy sx={{ mr: 1 }} />
                        Copy to Clipboard
                    </Button>
                </Box>
            )}
        </Container>
    );
}

export default App;
