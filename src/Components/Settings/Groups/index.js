import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

export default function Groups() {

    return (

        <Box sx={{ width: '800%', maxWidth: 1000 }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {Array.from(Array(3)).map((_, index) => (
                    <Grid key={index}>
                        <Card sx={{ minWidth: 200 }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Calendar{index}
                                </Typography>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Admin:
                                </Typography>

                            </CardContent>
                            {/* <CardActions>
                        <Button size="small">Learn More</Button>
                    </CardActions> */}
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <br />
            <Divider />
            <br />
            <Typography variant="h6" gutterBottom>
                Invitation
            </Typography>

        </Box>

    );


}