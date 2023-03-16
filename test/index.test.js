const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const userModel = require("../models/UsersModel");
const followModel = require("../models/FollowModel");

chai.should();

chai.use(chaiHttp);

const removeIfFollow = async() => {
    const id = 5;
    const index = id - 1;
    const id_of_user = (
        await userModel.find({ email: "hickey.public@xyz.com" })
    )[0]._id;
    const id_of_Follow_User = (await userModel.find({}))[index]._id;

    const follow = await followModel.find({ user: id_of_user });
    if (follow[0].following.includes(id_of_Follow_User)) {
        await followModel.updateOne({ user: id_of_user }, { $pull: { following: id_of_Follow_User } });
    }
};

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

describe("Follow and unfollow", () => {
    /**
     * Test the Follow and unfollow route
     */

    describe("Follow", () => {
        /**
         * Test the Follow
         */
        it("should return a 200 response", (done) => {
            removeIfFollow();

            chai
                .request(server)
                .post("/api/authenticate")
                .set("content-type", "application/json")
                .send({
                    email: "hickey.public@xyz.com",
                    password: "public",
                })
                .then((res) => {
                    chai
                        .request(server)
                        .post("/api/follow/5")
                        .set("content-type", "application/json")
                        .set("Authorization", "Bearer " + res.body.accessToken)
                        .end((err, res) => {
                            if (err) {
                                done(err);
                            }
                            res.should.have.status(200);
                            res.body.should.be.a("object");
                            expect(res.body)
                                .to.have.property("message")
                                .with.equal("Follow successful");
                            done();
                        });
                });
        });
    });

    describe("Follow fail", () => {
        /**
         * Test the Follow fail
         */
        it("should return a 400 response", (done) => {
            chai
                .request(server)
                .post("/api/authenticate")
                .set("content-type", "application/json")
                .send({
                    email: "hickey.public@xyz.com",
                    password: "public",
                })
                .then((res) => {
                    chai
                        .request(server)
                        .post("/api/follow/5")
                        .set("content-type", "application/json")
                        .set("Authorization", "Bearer " + res.body.accessToken)
                        .end((err, res) => {
                            if (err) {
                                done(err);
                            }
                            res.should.have.status(400);
                            res.body.should.be.a("object");
                            expect(res.body)
                                .to.have.property("message")
                                .with.equal("Already following");
                            done();
                        });
                });
        });
    });

    describe("Unfollow", () => {
        /**
         * Test the Unfollow
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
                .then((res) => {
                    chai
                        .request(server)
                        .post("/api/unfollow/5")
                        .set("content-type", "application/json")
                        .set("Authorization", "Bearer " + res.body.accessToken)
                        .end((err, res) => {
                            if (err) {
                                done(err);
                            }
                            res.should.have.status(200);
                            res.body.should.be.a("object");
                            expect(res.body)
                                .to.have.property("message")
                                .with.equal("Unfollow successful");
                            done();
                        });
                });
        });
    });

    describe("Unfollow fail", () => {
        /**
         * Test the Unfollow fail
         */
        it("should return a 400 response", (done) => {
            chai
                .request(server)
                .post("/api/authenticate")
                .set("content-type", "application/json")
                .send({
                    email: "hickey.public@xyz.com",
                    password: "public",
                })
                .then((res) => {
                    chai
                        .request(server)
                        .post("/api/unfollow/5")
                        .set("content-type", "application/json")
                        .set("Authorization", "Bearer " + res.body.accessToken)
                        .end((err, res) => {
                            if (err) {
                                done(err);
                            }
                            res.should.have.status(400);
                            res.body.should.be.a("object");
                            expect(res.body)
                                .to.have.property("message")
                                .with.equal("Not following");
                            done();
                        });
                });
        });
    });
});