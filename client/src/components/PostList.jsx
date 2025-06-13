import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import CommentContract from "../contracts/Comment.json";

const Comment = ({ board, account, posts, setPosts }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createPost = async () => {
    if (!title || !content) return alert("제목과 내용을 입력하세요.");

    try {
      await board.methods.createPost(title, content).send({ from: account });
      const count = await board.methods.postCount().call();
      const newPost = await board.methods.getPost(count - 1).call();
      setPosts([newPost, ...posts]);
      setTitle("");
      setContent("");
    } catch (err) {
      alert("게시글 작성 실패: " + err.message);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h5">📋 게시판</Typography>
      <TextField
        fullWidth
        label="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ my: 1 }}
      />
      <TextField
        fullWidth
        label="내용"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ my: 1 }}
      />
      <Button variant="contained" onClick={createPost}>
        게시글 작성
      </Button>

      <Box mt={4}>
        {posts.length === 0 && <Typography>게시글이 없습니다.</Typography>}
        {posts.map((post) => (
          <Box key={post.id} sx={{ border: "1px solid #ccc", p: 2, mb: 2 }}>
            <Typography variant="h6">{post.title}</Typography>
            <Typography>{post.content}</Typography>
            <Typography variant="caption">
              작성자: {post.author} |{" "}
              {new Date(post.timestamp * 1000).toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Comment;
