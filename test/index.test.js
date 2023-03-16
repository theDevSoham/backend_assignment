const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const userModel = require("../models/UsersModel");
const followModel = require("../models/FollowModel");
const creds = require("../userCreds/creds.json");

const idIndex = creds.length;
const email = creds[idIndex - 2].email;
const password = creds[idIndex - 2].password;
const wrongPassword = "12345";

const email_of_getUser = creds[0].email;
const password_of_getUser = creds[0].password;

chai.should();

chai.use(chaiHttp);

const removeIfFollow = async() => {
    const id = idIndex;
    const index = id - 1;
    const id_of_user = (
        await userModel.find({ email: email })
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
                    email: email,
                    password: password,
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
                    email: email,
                    password: wrongPassword,
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
                    email: email,
                    password: password,
                })
                .then((res) => {
                    chai
                        .request(server)
                        .post("/api/follow/" + idIndex)
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
                    email: email,
                    password: password,
                })
                .then((res) => {
                    chai
                        .request(server)
                        .post("/api/follow/" + idIndex)
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
                    email: email,
                    password: password,
                })
                .then((res) => {
                    chai
                        .request(server)
                        .post("/api/unfollow/" + idIndex)
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
                    email: email,
                    password: password,
                })
                .then((res) => {
                    chai
                        .request(server)
                        .post("/api/unfollow/" + idIndex)
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

describe("Get Authenticated User details", () => {

    /**
     * Test the Get user details route
     */

    describe("Get user", () => {
        /**
         * Test the get authenticated user
         */
        it("should return a 200 response", (done) => {
            chai
                .request(server)
                .post("/api/authenticate")
                .set("content-type", "application/json")
                .send({
                    email: email_of_getUser,
                    password: password_of_getUser,
                })
                .then((res) => {
                    chai
                        .request(server)
                        .get("/api/user")
                        .set("content-type", "application/json")
                        .set("Authorization", "Bearer " + res.body.accessToken)
                        .end((err, res) => {
                            if (err) {
                                done(err);
                            }
                            res.should.have.status(200);
                            res.body.should.be.a("object");
                            expect(res.body)
                                .to.have.property("username")
                                .with.equal("John Doe");
                            expect(res.body)
                                .to.have.property("followers")
                                .with.equal(1);
                            expect(res.body)
                                .to.have.property("following")
                                .with.equal(2);
                            done();
                        });
                });
        });
    });

    describe("Get unauthenticated user without any bearer", () => {
        /**
         * Test the get unauthenticated user without any bearer
         */
        it("should return a 401 response", (done) => {
            chai
                .request(server)
                .get("/api/user")
                .set("content-type", "application/json")
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    res.should.have.status(401);
                    res.body.should.be.a("object");
                    expect(res.body)
                        .to.have.property("message")
                        .with.equal("Unauthenticated");
                    done();
                });
        });
    });
});