import app from './app';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    console.log('Express server listening on port ' + PORT);
});

export default server;
