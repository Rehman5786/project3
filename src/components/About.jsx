import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About Task Management System</h1>
      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to streamline task management processes for teams of all sizes,
            providing an intuitive platform for managers to assign tasks and employees to
            track their work efficiently.
          </p>
        </section>

        <section className="about-section">
          <h2>Features</h2>
          <ul className="features-list">
            <li>Easy task assignment and tracking</li>
            <li>Role-based access control</li>
            <li>Deadline management</li>
            <li>Real-time task status updates</li>
            <li>User-friendly interface</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Team</h2>
          <div className="team-members">
            <div className="team-member">
              <h3>Abdul Rehman</h3><br />
              <p>2300030436</p>
            </div>
            <div className="team-member">
              <h3>Baswa Mohith</h3><br />
              <p>2300030073</p>
            </div>
            <div className="team-member">
              <h3>Sai Raghava</h3><br />
              <p>2300080104</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;