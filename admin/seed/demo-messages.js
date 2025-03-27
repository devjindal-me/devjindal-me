// Demo messages for the CMS
const demoMessages = [
    {
        id: 1687456200000,
        name: "John Smith",
        email: "john@example.com",
        subject: "Website Design Inquiry",
        message: "Hi there,\n\nI really like your portfolio website and I'm interested in hiring you for a similar project. Could you please let me know your availability and rates?\n\nThanks,\nJohn",
        date: "2023-06-22T09:30:00",
        isRead: true
    },
    {
        id: 1687542600000,
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        subject: "Job Opportunity at TechCorp",
        message: "Hello,\n\nI'm a recruiter at TechCorp and we're impressed with your portfolio. We have an opening for a frontend developer that might be a great fit for your skills.\n\nWould you be interested in discussing this opportunity further?\n\nBest regards,\nSarah Johnson\nSenior Recruiter, TechCorp",
        date: "2023-06-23T14:15:00",
        isRead: false
    },
    {
        id: 1687629000000,
        name: "Michael Brown",
        email: "mike.brown@gmail.com",
        subject: "Collaboration on Open Source Project",
        message: "Hey,\n\nI'm working on an open source project focused on web accessibility and after seeing your work, I think you'd be a great addition to our team. The project is called AccessifyUI and we're building a library of accessible UI components.\n\nIf you're interested in contributing, please let me know!\n\nCheers,\nMike",
        date: "2023-06-24T11:05:00",
        isRead: false
    },
    {
        id: 1687715400000,
        name: "Emily Davis",
        email: "emily.davis@design.co",
        subject: "Feedback on Your Portfolio",
        message: "Hi,\n\nI'm a fellow designer and just wanted to say that I really love your portfolio site! The clean design and smooth animations create a great user experience. \n\nI particularly liked the project filtering system you implemented. Would you mind sharing how you approached that feature?\n\nThanks,\nEmily",
        date: "2023-06-25T14:30:00",
        isRead: false
    },
    {
        id: 1687801800000,
        name: "David Wilson",
        email: "dwilson@techstartup.io",
        subject: "Potential Consulting Work",
        message: "Hello,\n\nI'm the CTO of a tech startup, and we're looking for a frontend developer to help us redesign our dashboard interface. Based on the work displayed in your portfolio, I think you'd be a great fit.\n\nWould you be available for a 3-month contract starting next month? If so, please let me know your rates and availability for a quick call.\n\nRegards,\nDavid Wilson\nCTO, TechStartup",
        date: "2023-06-26T17:45:00",
        isRead: false
    }
];

// Function to load demo messages into localStorage
function loadDemoMessages() {
    localStorage.setItem('portfolio_messages', JSON.stringify(demoMessages));
    alert('Demo messages loaded successfully! Refresh the page to see them.');
}

// Add button to DOM
document.addEventListener('DOMContentLoaded', function() {
    // Create button to load demo data
    const button = document.createElement('button');
    button.className = 'btn btn-primary';
    button.textContent = 'Load Demo Messages';
    button.style.margin = '20px';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    
    // Add click event
    button.addEventListener('click', loadDemoMessages);
    
    // Add to document
    document.body.appendChild(button);
}); 