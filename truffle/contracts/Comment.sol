// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Comment {
    struct Post {
        uint id;
        string title;
        string content;
        address author;
        uint timestamp;
    }

    Post[] public posts;
    uint public postCount = 0;

    event PostCreated(uint id, string title, address author);

    function createPost(string memory _title, string memory _content) public {
        posts.push(Post(postCount, _title, _content, msg.sender, block.timestamp));
        emit PostCreated(postCount, _title, msg.sender);
        postCount++;
    }

    function getPost(uint _id) public view returns (Post memory) {
        require(_id < postCount, "Post does not exist");
        return posts[_id];
    }

    function getAllPosts() public view returns (Post[] memory) {
        return posts;
    }
}
