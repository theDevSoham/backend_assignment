const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');

chai.should();

chai.use(chaiHttp);

describe('Authentication', () => {

    /**
     * Test the Authentication route
     */
    it('should return a 200 response', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});