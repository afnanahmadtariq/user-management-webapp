<?php
require_once 'users.php';
require_once 'auth.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <?php include 'header.php'; ?>
    <title>User Management System</title>
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center mb-4">User Management System</h1>

        <!-- Login/Signup/Logout Buttons -->
        <div class="text-end mb-4">
            <button id="loginBtn" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
            <button id="signupBtn" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#signupModal">Sign Up</button>
            <button id="logoutBtn" class="btn btn-danger d-none">Logout</button>
        </div>

        <!-- User List Section -->
        <h3>User List</h3>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="userTableBody">
                <!-- Dynamic User Rows -->
            </tbody>
        </table>

        <!-- Add User Button (Visible only if logged in) -->
        <button id="addUserButton" class="btn btn-success mb-3 d-none">Add User</button>
    </div>

    <?php include 'footer.php'; ?>
</body>
</html>
