
const webhookAuthentication = (req:any, res:any, next:any) => {
    const secretKey = req.body.secretKey;
    if(secretKey === process.env.WEBHOOK_SECRET_KEY) {
        next();
    }else {
        res.status(401).send('Unauthorized');
    }
}

export { webhookAuthentication };