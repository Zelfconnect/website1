document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // Here you would typically send this to your backend
    // For now, we'll just log it
    console.log('Form submitted:', data);
    alert('Thanks for your message! (This is a demo - no message was actually sent)');
    e.target.reset();
}); 