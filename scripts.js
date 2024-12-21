document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const addUserButton = document.getElementById('addUserButton');
    const userTableBody = document.getElementById('userTableBody');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const addUserForm = document.getElementById('addUserForm');
    const updateUserForm = document.getElementById('updateUserForm');

    let currentUpdateEmail = null; // To store email during the update process

    const isLoggedIn = () => localStorage.getItem('token') !== null;

    const updateUI = () => {
        if (isLoggedIn()) {
            loginBtn.classList.add('d-none');
            signupBtn.classList.add('d-none');
            logoutBtn.classList.remove('d-none');
            addUserButton.classList.remove('d-none');
        } else {
            loginBtn.classList.remove('d-none');
            signupBtn.classList.remove('d-none');
            logoutBtn.classList.add('d-none');
            addUserButton.classList.add('d-none');
        }
    };

    const fetchUsers = async () => {
        const response = await fetch('server.php');
        const users = await response.json();
        userTableBody.innerHTML = users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    ${isLoggedIn() ? `
                        <button class="btn btn-warning btn-sm" onclick="openUpdateUser('${user.email}', '${user.name}')">Update</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.email}')">Delete</button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        fetch('server.php', {
            method: 'POST',
            body: new URLSearchParams({ action: 'login', email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                localStorage.setItem('token', data.token);
                alert('Login successful!');
                updateUI();
                fetchUsers();
                document.getElementById('loginModal').querySelector('.btn-close').click();
            } else {
                alert(data.message);
            }
        });
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        fetch('server.php', {
            method: 'POST',
            body: new URLSearchParams({ action: 'signup', name, email, password })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                document.getElementById('signupModal').querySelector('.btn-close').click();
            }
        });
    });

    addUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('addUserName').value;
        const email = document.getElementById('addUserEmail').value;
        const password = document.getElementById('addUserPassword').value;

        fetch('server.php', {
            method: 'POST',
            body: new URLSearchParams({ action: 'add', name, email, password, token: localStorage.getItem('token') })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                fetchUsers();
                document.getElementById('addUserModal').querySelector('.btn-close').click();
            }
        });
    });

    window.openUpdateUser = (email, name) => {
        currentUpdateEmail = email;
        document.getElementById('updateUserName').value = name;
        const updateModal = new bootstrap.Modal(document.getElementById('updateUserModal'));
        updateModal.show();
    };

    updateUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('updateUserName').value;

        fetch('server.php', {
            method: 'POST',
            body: new URLSearchParams({ action: 'update', email: currentUpdateEmail, name, token: localStorage.getItem('token') })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                fetchUsers();
                document.getElementById('updateUserModal').querySelector('.btn-close').click();
            }
        });
    });

    window.deleteUser = (email) => {
        if (confirm('Are you sure you want to delete this user?')) {
            fetch('server.php', {
                method: 'POST',
                body: new URLSearchParams({ action: 'delete', email, token: localStorage.getItem('token') })
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if (data.status === 'success') {
                    fetchUsers();
                }
            });
        }
    };

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        alert('Logged out successfully!');
        updateUI();
        fetchUsers();
    });

    updateUI();
    fetchUsers();
});
