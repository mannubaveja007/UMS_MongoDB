// Token management
const setToken = (token) => localStorage.setItem('token', token);
const getToken = () => localStorage.getItem('token');
const removeToken = () => localStorage.removeItem('token');

// Show/Hide forms
function showForm(formType) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.add('hidden'));
    
    if (formType === 'login') {
        document.querySelector('#loginForm').classList.remove('hidden');
        document.querySelector('.tab-btn:first-child').classList.add('active');
    } else {
        document.querySelector('#registerForm').classList.remove('hidden');
        document.querySelector('.tab-btn:last-child').classList.add('active');
    }
}

// API calls
async function login(email, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        setToken(data.token);
        if (data.user.role === 'admin') {
            showAdminDashboard();
        } else {
            showUserProfile(data.user);
        }
    } catch (error) {
        alert(error.message);
    }
}

async function register(name, email, password, phoneNumber) {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phoneNumber })
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        setToken(data.token);
        showUserProfile(data.user);
    } catch (error) {
        alert(error.message);
    }
}

async function getProfile() {
    try {
        const response = await fetch('/api/users/me', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        showUserProfile(data.user);
    } catch (error) {
        alert(error.message);
        logout();
    }
}

async function updateProfile(updates) {
    try {
        const response = await fetch('/api/users/update', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(updates)
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        showUserProfile(data.user);
        alert('Profile updated successfully');
    } catch (error) {
        alert(error.message);
    }
}

async function deactivateAccount() {
    if (!confirm('Are you sure you want to deactivate your account?')) return;
    
    try {
        const response = await fetch('/api/users/deactivate', {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        if (!response.ok) throw new Error('Failed to deactivate account');
        
        logout();
        alert('Account deactivated successfully');
    } catch (error) {
        alert(error.message);
    }
}

async function getAllUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        displayUsers(data.users);
    } catch (error) {
        alert(error.message);
        if (error.message.includes('permission')) {
            logout();
        }
    }
}

// UI Functions
function showUserProfile(user) {
    document.querySelector('.auth-container').classList.add('hidden');
    document.querySelector('#userProfile').classList.remove('hidden');
    document.querySelector('#adminDashboard').classList.add('hidden');
    
    const profileInfo = document.querySelector('#profileInfo');
    profileInfo.innerHTML = `
        <div class="profile-view">
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phoneNumber}</p>
        </div>
        <div class="profile-edit hidden">
            <div class="form-group">
                <label>Name:</label>
                <input type="text" id="editName" value="${user.name}">
            </div>
            <div class="form-group">
                <label>Phone:</label>
                <input type="tel" id="editPhone" value="${user.phoneNumber}">
            </div>
            <div class="profile-edit-actions">
                <button onclick="saveProfile()" class="btn">Save</button>
                <button onclick="cancelEdit()" class="btn">Cancel</button>
            </div>
        </div>
    `;
}

function showEditForm() {
    document.querySelector('.profile-view').classList.add('hidden');
    document.querySelector('.profile-edit').classList.remove('hidden');
}

function cancelEdit() {
    document.querySelector('.profile-view').classList.remove('hidden');
    document.querySelector('.profile-edit').classList.add('hidden');
}

async function saveProfile() {
    const name = document.querySelector('#editName').value;
    const phoneNumber = document.querySelector('#editPhone').value;
    
    if (!name || !phoneNumber) {
        alert('Please fill in all fields');
        return;
    }
    
    await updateProfile({ name, phoneNumber });
    cancelEdit();
}

function showAdminDashboard() {
    document.querySelector('.auth-container').classList.add('hidden');
    document.querySelector('#userProfile').classList.add('hidden');
    document.querySelector('#adminDashboard').classList.remove('hidden');
    getAllUsers();
}

function displayUsers(users) {
    const usersList = document.querySelector('#usersList');
    usersList.innerHTML = users.map(user => `
        <div class="user-card">
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phoneNumber}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Status:</strong> ${user.isActive ? 'Active' : 'Deactivated'}</p>
            <p><strong>Created:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
    `).join('');
}

function logout() {
    removeToken();
    document.querySelector('.auth-container').classList.remove('hidden');
    document.querySelector('#userProfile').classList.add('hidden');
    document.querySelector('#adminDashboard').classList.add('hidden');
    showForm('login');
}

// Check if user is logged in on page load
if (getToken()) {
    getProfile();
}

// Event Listeners
document.querySelector('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#loginEmail').value;
    const password = document.querySelector('#loginPassword').value;
    login(email, password);
});

document.querySelector('#registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#registerName').value;
    const email = document.querySelector('#registerEmail').value;
    const password = document.querySelector('#registerPassword').value;
    const phoneNumber = document.querySelector('#registerPhone').value;
    register(name, email, password, phoneNumber);
});