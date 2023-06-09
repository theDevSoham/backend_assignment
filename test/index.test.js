const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const server = require("../index");
const userModel = require("../models/UsersModel");
const followModel = require("../models/FollowModel");
const { PostModel, LikesModel, CommentModel, DislikesModel } = require("../models/PostsModel");
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

describe("Add a new Post for authenticated user", () => {
    /**
     * Test the new post for authenticated user
     */

    describe("Add a new post", () => {

        /**
         * Try add a new post
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
                .then(async(res) => {
                    const postCount = await PostModel.countDocuments();
                    chai
                        .request(server)
                        .post("/api/posts")
                        .set("content-type", "application/json")
                        .set("Authorization", "Bearer " + res.body.accessToken)
                        .send({
                            title: "New Post",
                            description: "This is a new post for test purpose",
                        })
                        .end(async(err, res) => {
                            const count = await PostModel.countDocuments();
                            if (err) {
                                done(err);
                            }
                            res.should.have.status(200);
                            res.body.should.be.a("object");
                            expect(res.body)
                                .to.have.property("post_id")
                            expect(res.body)
                                .to.have.property("title")
                                .with.equal("New Post");
                            expect(res.body)
                                .to.have.property("description")
                                .with.equal("This is a new post for test purpose");
                            expect(res.body)
                                .to.have.property("created_at");
                            expect(postCount)
                                .to.be.lessThan(count);
                            done();
                        });
                });
        });
    });

    describe("Add a new post without title", () => {

        /**
         * Try add a new post without title
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
                .then(async(res) => {
                    const postCount = await PostModel.countDocuments();
                    chai
                        .request(server)
                        .post("/api/posts")
                        .set("content-type", "application/json")
                        .set("Authorization", "Bearer " + res.body.accessToken)
                        .send({
                            description: "This is a new post for test purpose",
                        })
                        .end(async(err, res) => {
                            const count = await PostModel.countDocuments();
                            if (err) {
                                done(err);
                            }
                            res.should.have.status(400);
                            res.body.should.be.a("object");
                            expect(res.body)
                                .to.have.property("error")
                                .with.equal("Please fill all fields");
                            expect(count).to.equal(postCount);
                            done();
                        });
                });
        });
    });
});

describe("Delete new post", () => {
    /**
     * Delete a post
     */

    describe("Delete a post", () => {

        /**
         * Delete a post
         **/

        let accessToken = "";

        before((done) => {
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
                    accessToken = res.body.accessToken;
                    done();
                });
        });

        it("should return a 200 response", (done) => {

            //console.log(accessToken);
            chai
                .request(server)
                .post("/api/posts")
                .set("content-type", "application/json")
                .set("Authorization", "Bearer " + accessToken)
                .send({
                    title: "New Post",
                    description: "This is a new post for test purpose",
                })
                .then(res => {
                    chai
                        .request(server)
                        .delete("/api/posts/" + res.body.post_id)
                        .set("content-type", "application/json")
                        .set("Authorization", "Bearer " + accessToken)
                        .end((err, res) => {
                            if (err) {
                                done(err);
                            }
                            res.should.have.status(200);
                            res.body.should.be.a("object");
                            expect(res.body)
                                .to.have.property("message")
                                .with.equal("Post deleted");
                            done();
                        });
                })
        });
    });

    describe("Delete a post that's not there originally", () => {

        /**
         * Delete a post that's not there originally
         **/

        let accessToken = "";

        before((done) => {
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
                    accessToken = res.body.accessToken;
                    done();
                });
        });

        it("should return a 500 response", (done) => {

            //console.log(accessToken);
            chai
                .request(server)
                .post("/api/posts")
                .set("content-type", "application/json")
                .set("Authorization", "Bearer " + accessToken)
                .send({
                    title: "New Post",
                    description: "This is a new post for test purpose",
                })
                .then(res => {
                    chai
                        .request(server)
                        .delete("/api/posts/" + "1")
                        .set("content-type", "application/json")
                        .set("Authorization", "Bearer " + accessToken)
                        .end((err, res) => {
                            if (err) {
                                done(err);
                            }
                            res.should.have.status(500);
                            done();
                        });
                })
        });
    });

    describe("Delete a post with unauthorized user", () => {

        /**
         * Delete a post with unauthorized user
         **/

        let accessToken = "";
        let differentAccessToken = "";

        before((done) => {
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
                    accessToken = res.body.accessToken;
                    done();
                });
        });

        before((done) => {
            chai
                .request(server)
                .post("/api/authenticate")
                .set("content-type", "application/json")
                .send({
                    email: email_of_getUser,
                    password: password_of_getUser,
                })
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    differentAccessToken = res.body.accessToken;
                    done();
                });
        });

        it("should return a 400 response", (done) => {
            chai
                .request(server)
                .post("/api/posts")
                .set("content-type", "application/json")
                .set("Authorization", "Bearer " + accessToken)
                .send({
                    title: "New Post",
                    description: "This is a new post for test purpose",
                })
                .then(res => {
                    chai
                        .request(server)
                        .delete("/api/posts/" + res.body.post_id)
                        .set("content-type", "application/json")
                        .set("Authorization", "Bearer " + differentAccessToken)
                        .end((err, res) => {
                            if (err) {
                                done(err);
                            }
                            res.should.have.status(400);
                            res.body.should.be.a("object");
                            expect(res.body)
                                .to.have.property("error")
                                .with.equal("You are not the owner of this post");
                            done();
                        });
                })
        });
    });
});


describe("Comment on a post", () => {
    /**
     * Comment on a post
     */

    describe("Comment on a new post", () => {

        /**
         * Comment on a new post
         **/

        let accessToken = "";
        let anotherAccessToken = "";

        before((done) => {
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
                    accessToken = res.body.accessToken;
                    done();
                });
        });

        before((done) => {
            chai
                .request(server)
                .post("/api/authenticate")
                .set("content-type", "application/json")
                .send({
                    email: email_of_getUser,
                    password: password_of_getUser,
                })
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    anotherAccessToken = res.body.accessToken;
                    done();
                });
        });

        it("should return a 200 response", (done) => {

            //console.log(accessToken);
            chai
                .request(server)
                .post("/api/posts")
                .set("content-type", "application/json")
                .set("Authorization", "Bearer " + accessToken)
                .send({
                    title: "New Post",
                    description: "This is a new post for test purpose",
                })
                .then(res => {
                    chai
                        .request(server)
                        .post("/api/comment/" + res.body.post_id)
                        .set("content-type", "application/json")
                        .set("Authorization", "Bearer " + anotherAccessToken)
                        .send({
                            comment: "This is a comment for test purpose",
                        })
                        .end((err, res) => {
                            if (err) {
                                done(err);
                            }
                            res.should.have.status(200);
                            res.body.should.be.a("object");
                            expect(res.body)
                                .to.have.property("message")
                                .with.equal("Comment added");
                            expect(res.body)
                                .to.have.property("commentId")
                            done();
                        });
                })
        });
    });

    describe("Comment on a new post without sending comment body", () => {

        /**
         * Comment on a new post without sending comment body
         **/

        let accessToken = "";
        let anotherAccessToken = "";

        before((done) => {
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
                    accessToken = res.body.accessToken;
                    done();
                });
        });

        before((done) => {
            chai
                .request(server)
                .post("/api/authenticate")
                .set("content-type", "application/json")
                .send({
                    email: email_of_getUser,
                    password: password_of_getUser,
                })
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    anotherAccessToken = res.body.accessToken;
                    done();
                });
        });

        it("should return a 400 response", (done) => {

            //console.log(accessToken);
            chai
                .request(server)
                .post("/api/posts")
                .set("content-type", "application/json")
                .set("Authorization", "Bearer " + accessToken)
                .send({
                    title: "New Post",
                    description: "This is a new post for test purpose",
                })
                .then(res => {
                    chai
                        .request(server)
                        .post("/api/comment/" + res.body.post_id)
                        .set("content-type", "application/json")
                        .set("Authorization", "Bearer " + anotherAccessToken)
                        .end((err, res) => {
                            if (err) {
                                done(err);
                            }
                            res.should.have.status(400);
                            res.body.should.be.a("object");
                            expect(res.body)
                                .to.have.property("error")
                                .with.equal("Please fill all fields");
                            done();
                        });
                })
        });
    });
});

describe("Get post", () => {
    /**
     * Get post 
     */

    describe("Get a post with id", () => {
        /**
         * Get a post with id
         */

        let accessToken = "";
        let anotherUser = "";

        before((done) => {
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
                    accessToken = res.body.accessToken;
                    done();
                });
        });

        before((done) => {
            chai
                .request(server)
                .post("/api/authenticate")
                .set("content-type", "application/json")
                .send({
                    email: email_of_getUser,
                    password: password_of_getUser,
                })
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    anotherUser = res.body.accessToken;
                    done();
                });
        });

        it("should return a 200 response", (done) => {
            chai
                .request(server)
                .post("/api/posts")
                .set("content-type", "application/json")
                .set("Authorization", "Bearer " + accessToken)
                .send({
                    title: "New Post",
                    description: "This is a new post for test purpose",
                })
                .then(res => {
                    chai
                        .request(server)
                        .get("/api/posts/" + res.body.post_id)
                        .set("content-type", "application/json")
                        .set("Authorization", "Bearer " + anotherUser)
                        .end((err, res) => {
                            if (err) {
                                done(err);
                            }
                            res.should.have.status(200);
                            res.body.should.be.a("object");
                            expect(res.body)
                                .to.have.property("post")
                                .with.property("title")
                                .with.equal("New Post");
                            expect(res.body)
                                .to.have.property("post")
                                .with.property("post_id");
                            expect(res.body)
                                .to.have.property("post")
                                .with.property("description")
                                .with.equal("This is a new post for test purpose");
                            expect(res.body)
                                .to.have.property("post")
                                .with.property("created_at");
                            expect(res.body)
                                .to.have.property("post")
                                .with.property("number_of_likes")
                            expect(res.body)
                                .to.have.property("post")
                                .with.property("number_0f_comments")
                            done();
                        });
                })
        });
    });

    describe("Get all post with authenticated user", () => {
        /**
         * Get all post with authenticated user and without sending post id
         */

        let accessToken = "";

        before((done) => {

            Promise.all([
                PostModel.collection.drop(),
                LikesModel.collection.drop(),
                CommentModel.collection.drop(),
                DislikesModel.collection.drop(),
            ]).then(async() => {
                const _id = (await userModel.findOne({ email: email }))._id;
                const post1_id = new mongoose.Types.ObjectId();
                const post2_id = new mongoose.Types.ObjectId();

                const post1 = new PostModel({
                    _id: post1_id,
                    user_id: _id,
                    post: {
                        title: "New Post 1",
                        description: "This is a new post for test purpose 1",
                    },
                    date_created: new Date().toISOString(),
                });

                const likes1 = new LikesModel({
                    _id: new mongoose.Types.ObjectId(),
                    user_id: _id,
                    post_id: post1_id,
                    liked_by: [],
                });

                const dislikes1 = new DislikesModel({
                    _id: new mongoose.Types.ObjectId(),
                    user_id: _id,
                    post_id: post1_id,
                    disliked_by: [],
                });

                const comments1 = new CommentModel({
                    _id: new mongoose.Types.ObjectId(),
                    post_id: post1_id,
                    comments: [],
                });

                const post2 = new PostModel({
                    _id: post2_id,
                    user_id: _id,
                    post: {
                        title: "New Post 2",
                        description: "This is a new post for test purpose 2",
                    },
                    date_created: new Date().toISOString(),
                });

                const likes2 = new LikesModel({
                    _id: new mongoose.Types.ObjectId(),
                    user_id: _id,
                    post_id: post2_id,
                    liked_by: [],
                });

                const dislikes2 = new DislikesModel({
                    _id: new mongoose.Types.ObjectId(),
                    user_id: _id,
                    post_id: post2_id,
                    disliked_by: [],
                });

                const comments2 = new CommentModel({
                    _id: new mongoose.Types.ObjectId(),
                    post_id: post2_id,
                    comments: [],
                });

                Promise.all([
                    post1.save(),
                    likes1.save(),
                    dislikes1.save(),
                    comments1.save(),
                    post2.save(),
                    likes2.save(),
                    dislikes2.save(),
                    comments2.save(),
                ]).then(() => {
                    done();
                }).catch(err => {
                    done(err);
                });
            }).catch(err => {
                done(err);
            });
        })

        before((done) => {
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
                    accessToken = res.body.accessToken;
                    done();
                });
        });

        it("should return a 200 response", (done) => {
            chai
                .request(server)
                .get("/api/all_posts")
                .set("content-type", "application/json")
                .set("Authorization", "Bearer " + accessToken)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }

                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(res.body)
                        .to.have.property("posts")
                        .with.lengthOf(2);
                    done();
                });
        });
    });
});