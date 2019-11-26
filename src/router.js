module.exports = (app, dir) => {
    
    app.get('/:code', (req, res) => {
        res.sendFile(`${dir}/public/index.html`);
    });

};
