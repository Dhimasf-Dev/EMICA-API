
var Odoo = require('odoo-xmlrpc');

var odoo = new Odoo({
    url: 'http://localhost',//'http://host.docker.internal',
    port: 8069,
    db: 'emicadev',//'emicadev_2',
    username: 'emica.apps@gmail.com',
    password: 'admin'
});

module.exports = odoo;
