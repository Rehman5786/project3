import React from 'react';
import '../styles/Blog.css';

const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with Task Management',
    date: 'May 10, 2023',
    excerpt: 'Learn how to effectively use our system to boost your productivity.',
    content: 'In this comprehensive guide, we walk you through the basics of our task management system, showing you how to get the most out of its features to streamline your workflow and improve team collaboration.'
  },
  {
    id: 2,
    title: 'Best Practices for Task Delegation',
    date: 'April 25, 2023',
    excerpt: 'Discover proven strategies for effective task assignment.',
    content: 'Effective delegation is key to successful team management. This post explores techniques for assigning tasks clearly, setting appropriate deadlines, and ensuring accountability among team members.'
  },
  {
    id: 3,
    title: 'Tracking Progress Effectively',
    date: 'April 10, 2023',
    excerpt: 'Tools and methods for monitoring task completion.',
    content: 'Learn how to use our progress tracking features to stay on top of projects, identify bottlenecks early, and keep your team motivated throughout the project lifecycle.'
  }
];

const Blog = () => {
  return (
    <div className="blog-container">
      <h1>Task Management Blog</h1>
      <p className="blog-subtitle">Tips, tricks, and insights for better productivity</p>
      
      <div className="blog-posts">
        {blogPosts.map(post => (
          <article key={post.id} className="blog-post">
            <h2>{post.title}</h2>
            <p className="post-meta">Posted on {post.date}</p>
            <p className="post-excerpt">{post.excerpt}</p>
            <div className="post-content">{post.content}</div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;