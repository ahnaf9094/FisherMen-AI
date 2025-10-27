// Global variables for DOM elements
let loginForm, signupForm, chatForm, feedbackForm;
let loginContainer, signupContainer, chatContainer, feedbackPopup, overlay;
let chatMessages, chatInput, chatHistory, newChatBtn, searchChats, userNameDisplay;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    loginForm = document.getElementById('login-form');
    signupForm = document.getElementById('signup-form');
    chatForm = document.getElementById('chat-form');
    feedbackForm = document.getElementById('feedback-form');
    
    // Container elements
    loginContainer = document.getElementById('login-container');
    signupContainer = document.getElementById('signup-container');
    chatContainer = document.getElementById('chat-container');
    feedbackPopup = document.getElementById('feedback-popup');
    overlay = document.getElementById('overlay');
    
    // Chat elements
    chatMessages = document.getElementById('chat-messages');
    chatInput = document.getElementById('chat-input');
    chatHistory = document.getElementById('chat-history');
    newChatBtn = document.getElementById('new-chat-btn');
    searchChats = document.getElementById('search-chats');
    userNameDisplay = document.getElementById('user-name-display');
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    
    // Initialize the application
    initApp();
    
    // Event Listeners
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    if (chatForm) chatForm.addEventListener('submit', handleChatSubmit);
    if (feedbackForm) feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    if (newChatBtn) newChatBtn.addEventListener('click', createNewChat);
    if (searchChats) searchChats.addEventListener('input', searchChatHistory);
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
        });
    }
    
    // Add event listener for closing feedback popup
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-secondary') && e.target.textContent === 'Cancel') {
            closeFeedbackPopup();
        }
    });
    
    // Auto-resize textarea
    if (chatInput) {
        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto';
            chatInput.style.height = (chatInput.scrollHeight) + 'px';
        });
    }
    
    // Collapse sidebar on small screens after selecting a chat or creating a new one
    if (sidebar) {
        const maybeCollapse = () => {
            if (window.innerWidth <= 768) sidebar.classList.remove('expanded');
        };
        if (newChatBtn) newChatBtn.addEventListener('click', maybeCollapse);
        if (chatHistory) chatHistory.addEventListener('click', maybeCollapse);
    }
});

// Initialize the application
function initApp() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        showChatInterface(user);
        loadChatHistory();
    } else {
        showLogin();
    }
}

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    
    const name = document.getElementById('login-name').value;
    const fishermanId = document.getElementById('login-fisherman-id').value;
    const password = document.getElementById('login-password').value;
    
    // In a real application, you would validate credentials against a server
    // For this demo, we'll simulate a successful login
    const user = {
        name,
        fishermanId,
        location: 'Unknown' // In a real app, this would come from the server
    };
    
    // Save user to local storage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Show chat interface
    showChatInterface(user);
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const fishermanId = document.getElementById('signup-fisherman-id').value;
    const location = document.getElementById('signup-location').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // In a real application, you would send this data to a server
    // For this demo, we'll simulate a successful signup
    const user = {
        name,
        fishermanId,
        location
    };
    
    // Save user to local storage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Show chat interface
    showChatInterface(user);
}

function logout() {
    // Clear user data
    localStorage.removeItem('currentUser');
    
    // Show login screen
    showLogin();
}

// UI Navigation Functions
function showLogin() {
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('signup-container').classList.add('hidden');
    document.getElementById('chat-container').classList.add('hidden');
}

function showSignup() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('signup-container').classList.remove('hidden');
    document.getElementById('chat-container').classList.add('hidden');
}

function showChatInterface(user) {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('signup-container').classList.add('hidden');
    document.getElementById('chat-container').classList.remove('hidden');
    
    // Update user name display
    document.getElementById('user-name-display').textContent = user.name;
}

// Chat Functions
function handleChatSubmit(e) {
    e.preventDefault();
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    
    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Simulate bot response (with typing indicator)
    showTypingIndicator();
    
    // In a real application, you would send the message to a server
    // and get a response. Here we'll simulate a response after a delay.
    setTimeout(() => {
        removeTypingIndicator();
        
        // Sample responses for demonstration
        const responses = [
            "Hello! How can I help you with fishing today?",
            "The weather forecast shows good conditions for fishing in your area tomorrow.",
            "For your location, the best fishing spots are near the coastal areas.",
            "Remember to check your fishing equipment before heading out.",
            "Based on recent reports, there have been good catches of Hilsa fish in your region."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'bot');
        
        // Save chat to history
        saveChatToHistory(message, randomResponse);
    }, 1500);
}

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    
    // Add feedback buttons for bot messages
    if (sender === 'bot') {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.classList.add('message-feedback');
        
        const thumbsUpBtn = document.createElement('button');
        thumbsUpBtn.classList.add('feedback-btn', 'thumbs-up');
        thumbsUpBtn.innerHTML = '<i class="fas fa-thumbs-up"></i>';
        thumbsUpBtn.addEventListener('click', () => handleFeedback(messageDiv, true));
        
        const thumbsDownBtn = document.createElement('button');
        thumbsDownBtn.classList.add('feedback-btn', 'thumbs-down');
        thumbsDownBtn.innerHTML = '<i class="fas fa-thumbs-down"></i>';
        thumbsDownBtn.addEventListener('click', () => handleFeedback(messageDiv, false));
        
        feedbackDiv.appendChild(thumbsUpBtn);
        feedbackDiv.appendChild(thumbsDownBtn);
        messageDiv.appendChild(feedbackDiv);
    }
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot-message', 'typing-indicator');
    
    const typingContent = document.createElement('div');
    typingContent.classList.add('message-content');
    typingContent.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    
    typingDiv.appendChild(typingContent);
    chatMessages.appendChild(typingDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Feedback Functions
function handleFeedback(messageDiv, isPositive) {
    const thumbsUp = messageDiv.querySelector('.thumbs-up');
    const thumbsDown = messageDiv.querySelector('.thumbs-down');
    
    // Reset both buttons
    thumbsUp.classList.remove('active', 'thumbs-up-animation');
    thumbsDown.classList.remove('active', 'thumbs-down-animation');
    // Clear any inline colors to avoid both appearing active
    thumbsUp.style.color = '';
    thumbsDown.style.color = '';
    
    if (isPositive) {
        // Thumbs up was clicked
        thumbsUp.classList.add('active', 'thumbs-up-animation');
    } else {
        // Thumbs down was clicked
        thumbsDown.classList.add('active', 'thumbs-down-animation');
        
        // Show feedback popup
        showFeedbackPopup(messageDiv.querySelector('.message-content').textContent);
    }
}

function showFeedbackPopup(message) {
    // Store the message being reported
    feedbackPopup.dataset.reportedMessage = message;
    
    // Show popup and overlay
    feedbackPopup.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function closeFeedbackPopup() {
    // Hide popup and overlay
    feedbackPopup.classList.add('hidden');
    overlay.classList.add('hidden');
    
    // Reset form
    document.getElementById('feedback-form').reset();
}

function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    // Get selected feedback option
    const feedbackOption = document.querySelector('input[name="feedback"]:checked');
    const feedbackText = document.getElementById('feedback-text').value;
    const reportedMessage = feedbackPopup.dataset.reportedMessage;
    
    // In a real application, you would send this feedback to a server
    console.log('Feedback submitted:', {
        message: reportedMessage,
        reason: feedbackOption ? feedbackOption.value : 'not specified',
        additionalComments: feedbackText
    });
    
    // Close popup
    closeFeedbackPopup();
    
    // Show thank you message
    alert('Thank you for your feedback!');
}

// Chat History Functions
function createNewChat() {
    // Clear current chat
    chatMessages.innerHTML = '';
    
    // Add welcome message
    const welcomeDiv = document.createElement('div');
    welcomeDiv.classList.add('welcome-message');
    welcomeDiv.innerHTML = '<h1>Welcome to FisherMen Chatbot</h1><p>How can I assist you today?</p>';
    chatMessages.appendChild(welcomeDiv);
    
    // Add new chat to history
    const chatId = 'chat_' + Date.now();
    const newChat = {
        id: chatId,
        title: 'New Chat',
        timestamp: Date.now(),
        messages: []
    };
    
    // Save to local storage
    const chatHistory = getChatHistory();
    chatHistory.unshift(newChat);
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    
    // Update chat history UI
    updateChatHistoryUI();
}

function saveChatToHistory(userMessage, botResponse) {
    let chatHistory = getChatHistory();
    
    // If no chats exist, create a new one
    if (chatHistory.length === 0) {
        createNewChat();
        chatHistory = getChatHistory();
    }
    
    // Add messages to the most recent chat
    const currentChat = chatHistory[0];
    currentChat.messages.push(
        { sender: 'user', content: userMessage },
        { sender: 'bot', content: botResponse }
    );
    
    // Update chat title based on first user message if it's still "New Chat"
    if (currentChat.title === 'New Chat' && currentChat.messages.length === 2) {
        currentChat.title = userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : '');
    }
    
    // Save to local storage
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    
    // Update chat history UI
    updateChatHistoryUI();
}

function loadChatHistory() {
    const chatHistory = getChatHistory();
    
    if (chatHistory.length === 0) {
        // If no chat history, create a new chat
        createNewChat();
    } else {
        // Load the most recent chat
        loadChat(chatHistory[0]);
        
        // Update chat history UI
        updateChatHistoryUI();
    }
}

function loadChat(chat) {
    // Clear current chat
    chatMessages.innerHTML = '';
    
    // Load messages
    if (chat.messages && chat.messages.length > 0) {
        chat.messages.forEach(message => {
            addMessage(message.content, message.sender);
        });
    } else {
        // Add welcome message if no messages
        const welcomeDiv = document.createElement('div');
        welcomeDiv.classList.add('welcome-message');
        welcomeDiv.innerHTML = '<h1>Welcome to FisherMen Chatbot</h1><p>How can I assist you today?</p>';
        chatMessages.appendChild(welcomeDiv);
    }
}

function updateChatHistoryUI() {
    const chatHistory = getChatHistory();
    chatHistory.sort((a, b) => b.timestamp - a.timestamp);
    
    // Clear current history
    document.getElementById('chat-history').innerHTML = '';
    
    // Add each chat to the sidebar
    chatHistory.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        chatItem.dataset.chatId = chat.id;
        
        chatItem.innerHTML = `
            <i class="fas fa-comment"></i>
            <div class="chat-item-title">${chat.title}</div>
        `;
        
        chatItem.addEventListener('click', () => {
            // Load this chat
            loadChat(chat);
            
            // Update active state
            document.querySelectorAll('.chat-item').forEach(item => {
                item.classList.remove('active');
            });
            chatItem.classList.add('active');
        });
        
        document.getElementById('chat-history').appendChild(chatItem);
    });
    
    // Set first chat as active
    if (chatHistory.length > 0) {
        document.querySelector('.chat-item').classList.add('active');
    }
}

function searchChatHistory() {
    const searchTerm = document.getElementById('search-chats').value.toLowerCase();
    const chatHistory = getChatHistory();
    
    // Filter chats based on search term
    const filteredChats = chatHistory.filter(chat => 
        chat.title.toLowerCase().includes(searchTerm) || 
        chat.messages.some(msg => msg.content.toLowerCase().includes(searchTerm))
    );
    
    // Clear current history
    document.getElementById('chat-history').innerHTML = '';
    
    // Add filtered chats to the sidebar
    filteredChats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        chatItem.dataset.chatId = chat.id;
        
        chatItem.innerHTML = `
            <i class="fas fa-comment"></i>
            <div class="chat-item-title">${chat.title}</div>
        `;
        
        chatItem.addEventListener('click', () => {
            // Load this chat
            loadChat(chat);
            
            // Update active state
            document.querySelectorAll('.chat-item').forEach(item => {
                item.classList.remove('active');
            });
            chatItem.classList.add('active');
        });
        
        document.getElementById('chat-history').appendChild(chatItem);
    });
}

function getChatHistory() {
    const chatHistory = localStorage.getItem('chatHistory');
    return chatHistory ? JSON.parse(chatHistory) : [];
}

// Utility Functions
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}
