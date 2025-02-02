---
title: Contact Us
template: base.html
---

<div class="contact-section">
    <h1>Get in Touch</h1>
    <p class="contact-intro">Have questions about cognitive enhancement or our programs? We're here to help.</p>
    
    <form class="contact-form" action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST">
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
        </div>
        
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>
        
        <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject" required>
        </div>
        
        <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
        </div>
        
        <button type="submit" class="button primary">Send Message</button>
    </form>
</div>

<div class="newsletter-section">
    <h2>Stay Updated</h2>
    <p>Subscribe to our newsletter for the latest insights on cognitive enhancement.</p>
    
    <form class="newsletter-form" action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST">
        <div class="form-group">
            <input type="email" name="email" placeholder="Enter your email" required>
            <button type="submit" class="button secondary">Subscribe</button>
        </div>
    </form>
</div> 