const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

chai.should();

chai.use(chaiHttp);

describe("Authentication", () => {
    /**
     * Test the Authentication route
     */
    describe("Login flow should return access token", () => {
        /**
         * Test the Login access token
         */
        it("should return a 200 response", (done) => {
            chai
                .request(server)
                .post("/api/authenticate")
                .set("content-type", "application/json")
                .send({
                    email: "hickey.public@xyz.com",
                    password: "public",
                })
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(res.body).to.have.property("accessToken");
                    done();
                });
        });
    });

    describe("Password error", () => {
        /**
         * Test the Login access token
         */
        it("should return a 401 response", (done) => {
            chai
                .request(server)
                .post("/api/authenticate")
                .set("content-type", "application/json")
                .send({
                    email: "hickey.public@xyz.com",
                    password: "12345",
                })
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    res.should.have.status(401);
                    res.body.should.be.a("object");
                    expect(res.body)
                        .to.have.property("message")
                        .with.equal("Authentication failed");
                    done();
                });
        });
    });
});