<script>
  // import Header from '$lib/component/Header.svelte';

</script>

<div class="app">
  <main>
    <slot />
  </main>
</div>

<div class="header">
  <nav class="nav-links">
    <a href="#features">Features</a>
    <a href="#join-community">Join Community</a>
    <a href="#why-this-website">Why Wave</a>
    <a href="#about-us">About Us</a>
  </nav>
  <a href="/login" class="login-btn">Register/Login</a>
</div>

<section id="hero" class="hero">
  <div class="hero-content">
    <h1>Together on Every Wave</h1>
    <p>Wave is a vibrant community where individuals come together to share experiences, support one another, and grow collectively. Whether you're looking to make new friends, learn new skills, or just find a sense of belonging, Wave is here to welcome you with open arms.</p>
  </div>
  <div class="hero-image">
    <img src="src/lib/images/Hero-withtext.png" alt="Community illustration">
  </div>
</section>

<section id="features" class="features">
  <div class="features-content">
    <h2>Features</h2>
    <p>Wave offers a range of features designed to enhance your community experience. Our platform provides various tools and opportunities to connect, engage, and grow with others. Discover what makes Wave unique and how you can benefit from being a part of our vibrant community.</p>
  </div>
  
  <div class="features-items">
    <div class="feature-item">
      <img src="src/lib/images/fitur1-cropped.svg" alt="Feature 1">
      <div class="feature-text">
        <h3>Create Your Own Community</h3>
        <p>Start your own groups and connect with like-minded individuals who share your interests and passions.</p>
      </div>
    </div>
    <div class="feature-item feature-reverse">
      <div class="feature-text">
        <h3>Join Various Communities</h3>
        <p>Engage with different sub-communities that focus on a wide range of topics, from hobbies to professional development.</p>
      </div>
      <img src="src/lib/images/fitur2-cropped.svg" alt="Feature 2">
    </div>
    <div class="feature-item">
      <img src="src/lib/images/fitur3-cropped.svg" alt="Feature 3" style="margin-top: -1.5rem">
      <div class="feature-text">
        <h3>Participate in Events</h3>
        <p>Attend online and offline events to network, learn, and have fun with fellow members.</p>
      </div>
    </div>
  </div>
</section>

<section id="join-community" class="join-community">
  <div class="join-wrapper">
    <div class="join-content">
      <h2>Join Community</h2>
      <p>Become a part of our growing community and enjoy exclusive benefits. Click on any block below to get started.</p>
    </div>
    <div class="join-buttons">
      <div class="button">Sign Up Now</div>
      <div class="button">Explore Events</div>
      <div class="button">Join a Community</div>
      <div class="button contact">Contact Us</div>
    </div>
  </div>
</section>

<section id="why-this-website" class="why-this-website">
  <h2>Why this website?</h2>
  <p>Wave offers a unique platform for fostering connections and building lasting relationships. Here's why you should join us:</p>
  <div class="reasons">
    <div class="reason">
      <h3>Community Support</h3>
      <p>Get support and encouragement from a network of people who understand and share your journey.</p>
    </div>
    <div class="reason diverse-activities">
      <h3>Diverse Activities</h3>
      <p>Participate in a variety of activities and events tailored to different interests and needs.</p>
    </div>
    <div class="reason">
      <h3>Learning Opportunities</h3>
      <p>Access resources and learning opportunities to help you grow personally and professionally.</p>
    </div>
  </div>
</section>

<section id="about-us" class="about-us">
  <div class="about-wrapper">
    <div class="about-image">
      <img src="src/lib/images/about_us-cropped.svg" alt="About Us Illustration">
    </div>
    <div class="about-content">
      <h2>About Us</h2>
      <p>Wave is a community-driven platform dedicated to bringing people together. Our mission is to create a space where everyone feels welcome, supported, and empowered to pursue their passions. We believe in the power of community and strive to provide our members with the tools and opportunities they need to connect, learn, and grow. Join us as we ride the waves of life together.</p>
    </div>
  </div>
</section>

<style>
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #FFFFFF;
      padding: 1rem 2rem;
      box-sizing: border-box;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
    }
    
    .nav-links {
      display: flex;
      gap: 2rem;
    }
    
    .nav-links a {
      color: #0F1426;
      text-decoration: none;
      font-size: 1rem;
      font-family: 'Inter', sans-serif;
    }
    
    .login-btn {
      background-color: #ff8c00;
      color: #0F1426;
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: 0.3125rem;
      cursor: pointer;
      text-decoration: none;
      font-weight: bold;
      font-family: 'Inter', sans-serif;
      white-space: nowrap; /* Prevents text from wrapping */
    }
    
    .nav-links a:hover {
      color: #ffa500;
    }
  
    .login-btn:hover {
      background-color: #ffa500;
    }
    
    @media (max-width: 768px) {
      .header {
      flex-direction: column;
      align-items: flex-start;
      }
    
      .nav-links {
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      margin-bottom: 1rem;
      }
    
      .login-btn {
      align-self: flex-start; /* Align button to the start */
      }
    }

  .hero {
    display: flex;
    gap: 10%;
    align-items: center;
    background: linear-gradient(to right, #ffcc80, #ff8c00);
    padding: 3rem 2rem;
    color: white;
    width: 100%;
    box-sizing: border-box;
    margin-top: 5rem; /* Offset for fixed header */
  }

  .hero-content {
    max-width: 50%;
    text-align: left; /* Align text to the left */
  }

  .hero-content h1 {
    font-size: 4rem;
    margin: 0 0 1rem 0;
    text-align: left; /* Align text to the left */
  }

  .hero-content p {
    font-size: 1.2rem;
    line-height: 1.5;
    text-align: left; /* Align text to the left */
  }

  .hero-image img {
    width: 100%;
  }

  .features {
    display: flex;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 1rem;
    background-color: #F2F2F2;
    color: #1E1E1E;
    gap: 2rem;
    font-size: 1.5rem;
  }

  .features-content {
    max-width: 50%;
  }

  .features-content h2 {
    margin: 0 0 1rem 0;
  }

  .features-content p {
    font-size: 1.2rem;
    line-height: 1.5;
  }

  .features-items {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    flex: 1;
    max-width: 50%; 
  }

  .feature-item {
    display: flex;
    background: #F2F2F2;
    padding: 0.5rem;
    text-align: left;
    align-items: center;
    box-sizing: border-box;
  }

  .feature-item img {
    max-width: 30%; /* Increase the size of the images */
    margin-right: 1.5rem;
  }

  .feature-reverse {
    background-color: #ff8c00; /* Set background color to #ff8c00 */
    color: white;
    border-radius: 8px;
    align-items: center;
    padding-left: 1rem;
  }

  .feature-reverse img {
    max-width: 35%;  /* Ensure the image in feature-reverse is also larger */
    margin-left: 1.5rem;
    margin-right: 0;
  }

  .feature-text {
    display: flex;
    flex-direction: column;
  }

  .feature-text h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .feature-text p {
    font-size: 1rem;
    line-height: 1.5;
  }

  .join-community {
    background-color: #FF9C41; /* Change background color */
    color: white;
    padding: 3rem 2rem;
    box-sizing: border-box;
  }

  .join-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .join-content {
    max-width: 50%;
  }

  .join-content h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #1E1E1E;
  }

  .join-content p {
    font-size: 1.2rem;
    line-height: 1.5;
  }

  .join-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    width: 40%; /* Ensure the container takes full width */
  }

  .button {
    background-color: #0F1426;
    color: white;
    padding: 4vw 0; /* Adjust padding to make button responsive */
    text-align: center;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    min-height: 100px; /* Ensure a minimum height */
  }

  .button.contact {
    background-color: #8c4d00; /* Different color for Contact Us button */
  }

  .why-this-website {
    background-color: #f2f2f2; /* Set background color */
    color: #1e1e1e; /* Set text color */
    padding: 3rem 2rem;
    text-align: center;
  }

  .why-this-website h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .why-this-website p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  .reasons {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 2rem;
  }

  .reason {
    background-color: #ffa64d; /* Set background color for reasons */
    color: white;
    padding: 2rem;
    flex: 1;
    text-align: center;
    border-radius: 8px;
  }

  .reason.diverse-activities {
    background-color: #D9D9D9; /* Set background color for Diverse Activities */
    color: #1e1e1e; /* Adjust text color for contrast */
  }

  .reason h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .reason p {
    font-size: 1rem;
    line-height: 1.5;
  }

  .about-us {
    background-color: #ff8c00; /* Background color for About Us section */
    color: white;
    padding: 3rem 2rem;
    text-align: center;
  }

  .about-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .about-image {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .about-image img {
    width: 80%; /* Adjusted image width to move it to the right */
  }

  .about-content {
    flex: 1;
    max-width: 50%;
    text-align: left;
  }

  .about-content h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .about-content p {
    font-size: 1.2rem;
    line-height: 1.5;
  }

  @media (max-width: 1024px) {
    .join-buttons {
      grid-template-columns: repeat(2, 1fr); /* Maintain 2x2 grid */
    }
    
    .reasons {
      flex-direction: column;
    }

    .about-wrapper {
      flex-direction: column;
      text-align: center;
    }

    .about-content {
      max-width: 100%;
      text-align: center;
    }

    .about-image {
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .hero {
      flex-direction: column;
      text-align: center;
    }

    .hero-content, .hero-image {
      max-width: 100%;
    }

    .hero-content h1 {
      font-size: 3rem;
    }

    .hero-content p {
      font-size: 1rem;
    }

    .features {
      flex-direction: column;
      text-align: center;
      max-width: 100%;
    }

    .features-content, .features-items {
      max-width: 100%;
    }

    .feature-reverse img {
      max-width: 80%;
    }

    .features-items .feature-item img {
      width: 50%;
    }

    .join-community {
      text-align: center;
    }

    .join-wrapper {
      flex-direction: column;
      align-items: center;
    }

    .join-content {
      max-width: 100%;
      margin-bottom: 2rem;
    }

    .join-buttons {
      width: 100%;
      grid-template-columns: repeat(2, 1fr); /* Maintain 2x2 grid */
    }

    .button {
      padding: 8vw 0; /* Increase padding for smaller screens */
    }

    .reasons {
      flex-direction: column;
    }

    .about-wrapper {
      flex-direction: column;
      text-align: center;
    }

    .about-content {
      max-width: 100%;
    }

    .about-image img {
      width: 100%;
    }

    .features-items {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .feature-item {
      flex-direction: column;
      align-items: center;
    }

    .feature-reverse {
      flex-direction: column-reverse;
      align-items: center;
    }
  }
</style>
