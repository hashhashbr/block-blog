const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlockBlog", function () {
  let BlockBlog;
  let blockBlog;
  let owner;
  let addr1;

  before(async function () {
    BlockBlog = await ethers.getContractFactory("BlockBlog");
    blockBlog = await BlockBlog.deploy();
    await blockBlog.waitForDeployment();
    [owner, addr1] = await ethers.getSigners();
  });

  it("Should create a post", async function () {
    const tx = await blockBlog.createPost("My first post", "imageHash1");
    await tx.wait();

    const post = await blockBlog.getPost(0);
    expect(post[0]).to.equal(owner.address);
    expect(post[1]).to.equal("My first post");
    expect(post[2]).to.equal("imageHash1");
  });

  it("Should get user posts", async function () {
    const userPosts = await blockBlog.getUserPosts(owner.address);
    expect(userPosts.length).to.equal(1);
    expect(userPosts[0].content).to.equal("My first post");
  });
});
