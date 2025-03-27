// Mock data for testing - in a real application, this would come from a database
const mockMessages = [
    {
        id: 1,
        name: "John Smith",
        email: "john@example.com",
        subject: "Website Design Inquiry",
        message: "Hi there,\n\nI really like your portfolio website and I'm interested in hiring you for a similar project. Could you please let me know your availability and rates?\n\nThanks,\nJohn",
        date: "2023-06-15T09:30:00",
        isRead: true
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        subject: "Job Opportunity at TechCorp",
        message: "Hello,\n\nI'm a recruiter at TechCorp and we're impressed with your portfolio. We have an opening for a frontend developer that might be a great fit for your skills.\n\nWould you be interested in discussing this opportunity further?\n\nBest regards,\nSarah Johnson\nSenior Recruiter, TechCorp",
        date: "2023-06-18T14:15:00",
        isRead: false
    },
    {
        id: 3,
        name: "Michael Brown",
        email: "mike.brown@gmail.com",
        subject: "Collaboration on Open Source Project",
        message: "Hey,\n\nI'm working on an open source project focused on web accessibility and after seeing your work, I think you'd be a great addition to our team. The project is called AccessifyUI and we're building a library of accessible UI components.\n\nIf you're interested in contributing, please let me know!\n\nCheers,\nMike",
        date: "2023-06-20T11:05:00",
        isRead: false
    }
];

// DOM Elements
const loginForm = document.getElementById('loginForm');
const messagesListEl = document.querySelector('.messages-list');
const messageDetailEl = document.querySelector('.message-detail');
const messagePlaceholderEl = document.querySelector('.message-placeholder');
const messageDetailContentEl = document.querySelector('.message-detail-content');
const searchInput = document.querySelector('.search-box input');
const statusFilter = document.querySelector('.filter-options select');
const deleteModal = document.getElementById('deleteModal');
const replyModal = document.getElementById('replyModal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const replyForm = document.getElementById('replyForm');
const refreshButton = document.getElementById('refreshBtn');
const deleteAllButton = document.getElementById('deleteAllBtn');
const logoutButton = document.getElementById('logoutBtn');

// Check if user is logged in on admin pages
if (window.location.href.includes('/admin/dashboard.html')) {
    if (!localStorage.getItem('admin_logged_in')) {
        window.location.href = 'index.html';
    }
}

// Add event listeners if we're on the admin dashboard page
if (messagesListEl) {
    document.addEventListener('DOMContentLoaded', () => {
        loadMessagesFromStorage();
        
        // Event listeners
        searchInput?.addEventListener('input', filterMessages);
        statusFilter?.addEventListener('change', filterMessages);
        
        // Close modals
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                deleteModal.classList.remove('show');
                replyModal.classList.remove('show');
            });
        });
        
        // Cancel buttons for modals
        document.querySelector('.cancel-delete')?.addEventListener('click', () => {
            deleteModal.classList.remove('show');
        });
        
        document.querySelector('.cancel-reply')?.addEventListener('click', () => {
            replyModal.classList.remove('show');
        });
        
        // Send reply button
        document.querySelector('.send-reply')?.addEventListener('click', handleReplySubmit);
        
        // Refresh button
        refreshButton?.addEventListener('click', loadMessagesFromStorage);
        
        // Delete all button
        deleteAllButton?.addEventListener('click', () => {
            showDeleteAllModal();
        });
        
        // Logout button
        logoutButton?.addEventListener('click', () => {
            localStorage.removeItem('admin_logged_in');
            window.location.href = 'index.html';
        });
    });
}

// Handle login form submission
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // In a real application, you would send this to a server for authentication
        // For demo purposes, we'll use a simple check
        if (username === 'admin' && password === 'password') {
            // Save login state
            localStorage.setItem('admin_logged_in', 'true');
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid username or password');
        }
    });
}

// Function to load messages from localStorage
function loadMessagesFromStorage() {
    if (!messagesListEl) return;
    
    messagesListEl.innerHTML = '';
    
    // Get messages from localStorage
    const messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
    
    if (messages.length === 0) {
        messagesListEl.innerHTML = '<div class="no-messages">No messages found</div>';
        // Reset message detail
        if (messageDetailContentEl) {
            messagePlaceholderEl.style.display = 'flex';
            if (messageDetailContentEl) {
                messageDetailContentEl.style.display = 'none';
            }
        }
        return;
    }
    
    messages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.className = `message-item ${message.isRead ? 'read' : 'unread'}`;
        messageItem.dataset.id = message.id;
        
        const messageDate = new Date(message.date);
        const formattedDate = messageDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        
        messageItem.innerHTML = `
            <div class="message-status ${message.isRead ? 'read' : 'unread'}"></div>
            <div class="message-info">
                <div class="message-sender">${message.name}</div>
                <div class="message-subject">${message.subject}</div>
                <div class="message-preview">${message.message.substring(0, 60)}${message.message.length > 60 ? '...' : ''}</div>
            </div>
            <div class="message-meta">
                <div class="message-date">${formattedDate}</div>
                <div class="message-actions">
                    <button class="btn-icon delete-btn-small" data-id="${message.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        messageItem.addEventListener('click', (e) => {
            // Don't handle click on delete button
            if (e.target.closest('.delete-btn-small')) {
                return;
            }
            
            document.querySelectorAll('.message-item').forEach(item => {
                item.classList.remove('active');
            });
            messageItem.classList.add('active');
            
            // Mark message as read
            if (!message.isRead) {
                message.isRead = true;
                messageItem.classList.remove('unread');
                messageItem.classList.add('read');
                messageItem.querySelector('.message-status').classList.remove('unread');
                messageItem.querySelector('.message-status').classList.add('read');
                
                // Update localStorage
                updateMessageInStorage(message);
            }
            
            displayMessageDetail(message);
        });
        
        messagesListEl.appendChild(messageItem);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn-small').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const messageId = btn.getAttribute('data-id');
            showDeleteModal(messageId);
        });
    });
}

// Function to update a message in localStorage
function updateMessageInStorage(updatedMessage) {
    // Get existing messages
    let messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
    
    // Find and update the message
    const index = messages.findIndex(message => parseInt(message.id) === parseInt(updatedMessage.id));
    if (index !== -1) {
        messages[index] = updatedMessage;
        
        // Save updated messages back to localStorage
        localStorage.setItem('portfolio_messages', JSON.stringify(messages));
    }
}

// Function to display message detail
function displayMessageDetail(message) {
    if (!messageDetailEl || !messagePlaceholderEl) return;
    
    messagePlaceholderEl.style.display = 'none';
    
    const messageDate = new Date(message.date);
    const formattedDate = messageDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Create the message detail content
    const detailContent = document.createElement('div');
    detailContent.className = 'message-detail-content';
    detailContent.innerHTML = `
        <div class="message-header">
            <h2 class="message-subject-detail">${message.subject}</h2>
            <div class="message-date-detail">${formattedDate}</div>
        </div>
        <div class="message-sender-detail">
            <strong>From:</strong> ${message.name} (${message.email})
        </div>
        <div class="message-body">
            ${message.message.replace(/\n/g, '<br>')}
        </div>
        <div class="message-actions-detail">
            <button class="btn btn-primary" id="replyBtn">
                <i class="fas fa-reply"></i> Reply
            </button>
            <button class="btn btn-danger" id="deleteBtn">
                <i class="fas fa-trash"></i> Delete
            </button>
            <button class="btn btn-secondary" id="toggleReadBtn">
                <i class="fas fa-check"></i> Mark as ${message.isRead ? 'unread' : 'read'}
            </button>
        </div>
    `;
    
    // Replace any existing content
    if (messageDetailEl.querySelector('.message-detail-content')) {
        messageDetailEl.querySelector('.message-detail-content').remove();
    }
    
    messageDetailEl.appendChild(detailContent);
    
    // Add event listeners to action buttons
    document.getElementById('replyBtn').addEventListener('click', () => {
        showReplyModal(message.id);
    });
    
    document.getElementById('deleteBtn').addEventListener('click', () => {
        showDeleteModal(message.id);
    });
    
    document.getElementById('toggleReadBtn').addEventListener('click', () => {
        toggleMessageReadStatus(message);
    });
}

// Function to toggle message read status
function toggleMessageReadStatus(message) {
    // Toggle read status
    message.isRead = !message.isRead;
    
    // Update in localStorage
    updateMessageInStorage(message);
    
    // Reload messages to update UI
    loadMessagesFromStorage();
    
    // Update the message detail view button text
    const toggleReadBtn = document.getElementById('toggleReadBtn');
    if (toggleReadBtn) {
        toggleReadBtn.innerHTML = `
            <i class="fas fa-check"></i> Mark as ${message.isRead ? 'unread' : 'read'}
        `;
    }
    
    // Find and update the list item
    const messageItem = document.querySelector(`.message-item[data-id="${message.id}"]`);
    if (messageItem) {
        if (message.isRead) {
            messageItem.classList.remove('unread');
            messageItem.classList.add('read');
            messageItem.querySelector('.message-status').classList.remove('unread');
            messageItem.querySelector('.message-status').classList.add('read');
        } else {
            messageItem.classList.remove('read');
            messageItem.classList.add('unread');
            messageItem.querySelector('.message-status').classList.remove('read');
            messageItem.querySelector('.message-status').classList.add('unread');
        }
    }
}

// Function to filter messages
function filterMessages() {
    if (!searchInput || !statusFilter) return;
    
    const searchQuery = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    
    // Get messages from localStorage
    const messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
    
    let filteredMessages = messages.filter(message => {
        // Filter by search query
        const matchesSearch = message.name.toLowerCase().includes(searchQuery) || 
                             message.email.toLowerCase().includes(searchQuery) || 
                             message.subject.toLowerCase().includes(searchQuery) || 
                             message.message.toLowerCase().includes(searchQuery);
        
        // Filter by status
        let matchesStatus = true;
        if (statusValue === 'read') {
            matchesStatus = message.isRead;
        } else if (statusValue === 'unread') {
            matchesStatus = !message.isRead;
        }
        
        return matchesSearch && matchesStatus;
    });
    
    // Clear the messages list
    messagesListEl.innerHTML = '';
    
    if (filteredMessages.length === 0) {
        messagesListEl.innerHTML = '<div class="no-messages">No messages found</div>';
        return;
    }
    
    // Display filtered messages
    filteredMessages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.className = `message-item ${message.isRead ? 'read' : 'unread'}`;
        messageItem.dataset.id = message.id;
        
        const messageDate = new Date(message.date);
        const formattedDate = messageDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        
        messageItem.innerHTML = `
            <div class="message-status ${message.isRead ? 'read' : 'unread'}"></div>
            <div class="message-info">
                <div class="message-sender">${message.name}</div>
                <div class="message-subject">${message.subject}</div>
                <div class="message-preview">${message.message.substring(0, 60)}${message.message.length > 60 ? '...' : ''}</div>
            </div>
            <div class="message-meta">
                <div class="message-date">${formattedDate}</div>
                <div class="message-actions">
                    <button class="btn-icon delete-btn-small" data-id="${message.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        messageItem.addEventListener('click', (e) => {
            // Don't handle click on delete button
            if (e.target.closest('.delete-btn-small')) {
                return;
            }
            
            document.querySelectorAll('.message-item').forEach(item => {
                item.classList.remove('active');
            });
            messageItem.classList.add('active');
            
            // Mark message as read
            if (!message.isRead) {
                message.isRead = true;
                messageItem.classList.remove('unread');
                messageItem.classList.add('read');
                messageItem.querySelector('.message-status').classList.remove('unread');
                messageItem.querySelector('.message-status').classList.add('read');
                
                // Update localStorage
                updateMessageInStorage(message);
            }
            
            displayMessageDetail(message);
        });
        
        messagesListEl.appendChild(messageItem);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn-small').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const messageId = btn.getAttribute('data-id');
            showDeleteModal(messageId);
        });
    });
}

// Function to show the delete modal
function showDeleteModal(messageId) {
    if (!deleteModal) return;
    
    // Update modal title and content
    const modalHeader = deleteModal.querySelector('.modal-header h2');
    modalHeader.textContent = 'Confirm Deletion';
    
    const modalBody = deleteModal.querySelector('.modal-body');
    modalBody.innerHTML = '<p>Are you sure you want to delete this message? This action cannot be undone.</p>';
    
    const confirmDeleteBtn = deleteModal.querySelector('.confirm-delete');
    
    // Remove previous event listener to avoid duplicates
    const newConfirmDeleteBtn = confirmDeleteBtn.cloneNode(true);
    confirmDeleteBtn.parentNode.replaceChild(newConfirmDeleteBtn, confirmDeleteBtn);
    
    // Add new event listener
    newConfirmDeleteBtn.addEventListener('click', () => {
        deleteMessage(messageId);
        deleteModal.classList.remove('show');
    });
    
    deleteModal.classList.add('show');
}

// Function to show the delete all modal
function showDeleteAllModal() {
    if (!deleteModal) return;
    
    const modalHeader = deleteModal.querySelector('.modal-header h2');
    const modalBody = deleteModal.querySelector('.modal-body');
    
    // Change modal content for delete all
    modalHeader.textContent = 'Delete All Messages';
    modalBody.innerHTML = '<p>Are you sure you want to delete all messages? This action cannot be undone.</p>';
    
    const confirmDeleteBtn = deleteModal.querySelector('.confirm-delete');
    
    // Remove previous event listener to avoid duplicates
    const newConfirmDeleteBtn = confirmDeleteBtn.cloneNode(true);
    confirmDeleteBtn.parentNode.replaceChild(newConfirmDeleteBtn, confirmDeleteBtn);
    
    // Add new event listener for delete all
    newConfirmDeleteBtn.addEventListener('click', () => {
        deleteAllMessages();
        deleteModal.classList.remove('show');
    });
    
    deleteModal.classList.add('show');
}

// Function to delete a message
function deleteMessage(messageId) {
    // Get existing messages
    let messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
    
    // Find and remove the message
    const index = messages.findIndex(message => parseInt(message.id) === parseInt(messageId));
    if (index !== -1) {
        messages.splice(index, 1);
        
        // Save updated messages back to localStorage
        localStorage.setItem('portfolio_messages', JSON.stringify(messages));
        
        // Reload messages
        loadMessagesFromStorage();
        
        // Reset message detail if the current message is deleted
        if (messageDetailEl) {
            messagePlaceholderEl.style.display = 'flex';
            const detailContent = messageDetailEl.querySelector('.message-detail-content');
            if (detailContent) {
                detailContent.remove();
            }
        }
    }
}

// Function to delete all messages
function deleteAllMessages() {
    // Clear all messages from localStorage
    localStorage.removeItem('portfolio_messages');
    
    // Reload (empty) messages
    loadMessagesFromStorage();
    
    // Reset message detail
    if (messageDetailEl) {
        messagePlaceholderEl.style.display = 'flex';
        const detailContent = messageDetailEl.querySelector('.message-detail-content');
        if (detailContent) {
            detailContent.remove();
        }
    }
}

// Function to show the reply modal
function showReplyModal(messageId) {
    if (!replyModal || !replyForm) return;
    
    // Get messages from localStorage
    const messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
    
    // Find the message
    const message = messages.find(message => parseInt(message.id) === parseInt(messageId));
    if (!message) return;
    
    const replyToInput = document.getElementById('replyTo');
    const replySubjectInput = document.getElementById('replySubject');
    const replyMessageInput = document.getElementById('replyMessage');
    
    replyToInput.value = message.email;
    replySubjectInput.value = `Re: ${message.subject}`;
    replyMessageInput.value = '';
    
    // Store message ID in the form
    replyForm.dataset.messageId = messageId;
    
    replyModal.classList.add('show');
}

// Function to handle reply form submission
function handleReplySubmit(e) {
    if (e) e.preventDefault();
    
    const messageId = parseInt(replyForm.dataset.messageId);
    
    // Get messages from localStorage
    const messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
    
    // Find the message
    const message = messages.find(message => parseInt(message.id) === messageId);
    if (!message) return;
    
    const replyMessage = document.getElementById('replyMessage').value;
    
    if (!replyMessage.trim()) {
        alert('Please enter a message');
        return;
    }
    
    // In a real application, you would send this to a server
    alert(`Reply sent to ${message.email}:\n\n${replyMessage}`);
    
    // Close the modal and reset form
    replyModal.classList.remove('show');
    replyForm.reset();
} 