const { expect } = require('chai');
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
            .post('/api/authenticate')
            .set('content-type', 'application/json')
            .send({
                email: "hickey.public@xyz.com",
                password: "public"
            })
            .end((err, res) => {
                if (err) { done(err); }
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(res.body).to.have.property('accessToken');
                done();
            });
    });
});