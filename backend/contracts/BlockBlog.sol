// SPDX-License-Identifier: SEE LICENSE IN LICENSE

pragma solidity 0.8.24;

contract BlockBlog {
    struct Post {
        address author;
        string content;
        string imageUrl;
        bool exists;
    }

    Post[] public posts;

    function createPost(string memory _content, string memory _imageUrl) public {
        posts.push(Post({
            author: msg.sender,
            content: _content,
            imageUrl: _imageUrl,
            exists: true
        }));
    }

    function editPost(uint _index, string memory _newContent, string memory _newImageUrl) public {
        require(_index < posts.length, "Post does not exist");
        require(posts[_index].author == msg.sender, "Only the author can edit this post");
        require(posts[_index].exists, "Post has been deleted");

        posts[_index].content = _newContent;
        posts[_index].imageUrl = _newImageUrl;
    }

    function deletePost(uint _index) public {
        require(_index < posts.length, "Post does not exist");
        require(posts[_index].author == msg.sender, "Only the author can delete this post");
        require(posts[_index].exists, "Post has already been deleted");

        posts[_index].exists = false;
    }

    function getPost(uint _index) public view returns (address, string memory, string memory) {
        require(_index < posts.length, "Post does not exist");
        require(posts[_index].exists, "Post has been deleted");

        Post memory post = posts[_index];
        return (post.author, post.content, post.imageUrl);
    }

    function getPostsCount() public view returns (uint) {
        return posts.length;
    }

    function getUserPosts(address _user) public view returns (Post[] memory) {
        uint count = 0;
        for (uint i = 0; i < posts.length; i++) {
            if (posts[i].author == _user && posts[i].exists) {
                count++;
            }
        }

        Post[] memory userPosts = new Post[](count);
        uint index = 0;
        for (uint i = 0; i < posts.length; i++) {
            if (posts[i].author == _user && posts[i].exists) {
                userPosts[index] = posts[i];
                index++;
            }
        }
        return userPosts;
    }
}