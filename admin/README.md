# Portfolio CMS - Admin Panel

This is a simple Content Management System (CMS) for the portfolio website, focused on managing messages sent through the contact form.

## Features

- **Admin Login**: Secure login system to access the admin panel
- **Message Management**: View, read, delete, and respond to messages
- **Message Filtering**: Filter messages by status (read/unread) and search by content
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## How to Use

### Accessing the Admin Panel

1. Navigate to the admin panel by clicking the "Admin" link in the website footer
2. Login with the following credentials:
   - Username: `admin`
   - Password: `password`

### Managing Messages

Once logged in, you'll see the dashboard with all messages listed on the left side:

- **Viewing Messages**: Click on any message to view its details
- **Marking as Read**: Messages are automatically marked as read when you view them
- **Replying**: Click the "Reply" button to compose a response
- **Deleting**: Delete individual messages or all messages at once

### Filtering and Searching

- Use the search box to find messages containing specific text
- Use the status dropdown to filter messages by read/unread status

## Technical Details

This admin panel uses the following technologies:

- **HTML5/CSS3**: For structure and styling
- **JavaScript**: For dynamic content and interactivity
- **LocalStorage**: For storing messages and authentication state

Note: This is a client-side only implementation for demonstration purposes. In a production environment, you would implement server-side storage and authentication.

## Security Considerations

- In a real-world implementation, proper authentication with secure password storage would be necessary
- Messages would be stored in a database rather than localStorage
- HTTPS would be used to encrypt data in transit

## Customization

You can customize the admin panel by:

1. Modifying `admin.css` to change the visual appearance
2. Updating `admin.js` to add more functionality
3. Editing the HTML files to add additional features or sections 