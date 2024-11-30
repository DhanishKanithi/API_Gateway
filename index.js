const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const app = express();

const PORT = 3005;

app.use(morgan('combined'));

app.use('/bookingservice', async (req, res, next) => {
    
    try {
        console.log(req.headers['x-access-token']);
        const response = await axios.get('http://localhost:3001/api/v1/isAuthenticated', {
        headers: {
            'x-access-token': req.headers['x-access-token']
        }
    });
        console.log(response.data);
        if(response.data.success) {
                 next();
             }
        else {
            return res.status(401).json({
                message: 'Unauthorised access'
            })
        }
    } 

    catch (error) {
        return res.status(401).json({
            message: 'Unauthorised access happening'
        });
    }
    console.log("Hello World. Please appear this time... ");
});

const exampleProxy = createProxyMiddleware({
    target: 'http://localhost:3002/bookingservice', 
    changeOrigin: true, 
  });
app.use('/bookingservice', exampleProxy);


const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, 
	limit: 5,
});
app.use(limiter);


app.get('/home', (req,res) => {
    return res.json({message: 'OK'});
});

app.listen(PORT, ()=> {
    console.log(`Server started at port ${PORT}`);
    console.log('Inside listen...');
});

