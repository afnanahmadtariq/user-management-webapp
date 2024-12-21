document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const addUserButton = document.getElementById('addUserButton');
    const userTableBody = document.getElementById('userTableBody');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

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
        const response = await fetch('index.php');
        const users = await response.json();
        userTableBody.innerHTML = users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    ${isLoggedIn() ? `
                        <button class="btn btn-warning btn-sm" onclick="updateUser('${user.email}')">Update</button>
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

        fetch('index.php', {
            method: 'POST',
            body: new URLSearchParams({ action: 'login', email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                localStorage.setItem('token', data.token);
                updateUI();
                $('#loginModal').modal('hide');
                fetchUsers();
            } else {
                alert('Login failed: ' + data.message);
            }
        });
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        fetch('index.php', {
            method: 'POST',
            body: new URLSearchParams({ action: 'add', name, email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                alert('User added!');
                $('#signupModal').modal('hide');
            } else {
                alert('Signup failed: ' + data.message);
            }
        });
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        updateUI();
        fetchUsers();
    });

    const updateUser = (email) => {
        const name = prompt('Enter new name:');
        if (name) {
            fetch('index.php', {
                method: 'POST',
                body: new URLSearchParams({ action: 'update', email, name })
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                fetchUsers();
            });
        }
    };

    const deleteUser = (email) => {
        if (confirm('Are you sure you want to delete this user?')) {
            fetch('index.php', {
                method: 'POST',
                body: new URLSearchParams({ action: 'delete', email })
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                fetchUsers();
            });
        }
    };

    updateUI();
    fetchUsers();
});
