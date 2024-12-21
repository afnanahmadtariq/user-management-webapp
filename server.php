<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Path to the JSON file
$jsonFile = 'users.json';

// Ensure the file exists and has valid content
if (!file_exists($jsonFile)) {
    file_put_contents($jsonFile, json_encode([]));
}
$users = json_decode(file_get_contents($jsonFile), true) ?: [];

// Dummy token for simplicity
$authToken = 'secure-token-123';

function isAuthenticated() {
    global $authToken;
    return isset($_POST['token']) && $_POST['token'] === $authToken;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];

    if ($action === 'signup') {
        // Signup Logic
        $name = $_POST['name'];
        $email = $_POST['email'];
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

        // Check if user already exists
        foreach ($users as $user) {
            if ($user['email'] === $email) {
                echo json_encode(['status' => 'error', 'message' => 'User already exists']);
                exit;
            }
        }

        // Add new user
        $users[] = ['name' => $name, 'email' => $email, 'password' => $password];
        file_put_contents($jsonFile, json_encode(array_values($users))); // Ensure zero-based array
        echo json_encode(['status' => 'success', 'message' => 'User registered successfully']);
    } elseif ($action === 'login') {
        // Login Logic
        $email = $_POST['email'];
        $password = $_POST['password'];

        foreach ($users as $user) {
            if ($user['email'] === $email && password_verify($password, $user['password'])) {
                echo json_encode(['status' => 'success', 'token' => $authToken, 'message' => 'Login successful']);
                exit;
            }
        }
        echo json_encode(['status' => 'error', 'message' => 'Invalid email or password']);
    } elseif (isAuthenticated()) {
        if ($action === 'add') {
            // Add User Logic
            $name = $_POST['name'];
            $email = $_POST['email'];
            $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
            $users[] = ['name' => $name, 'email' => $email, 'password' => $password];
            file_put_contents($jsonFile, json_encode(array_values($users))); // Ensure zero-based array
            echo json_encode(['status' => 'success', 'message' => 'User added successfully']);
        } elseif ($action === 'update') {
            // Update User Logic
            $email = $_POST['email'];
            foreach ($users as &$user) {
                if ($user['email'] === $email) {
                    $user['name'] = $_POST['name'];
                    file_put_contents($jsonFile, json_encode(array_values($users))); // Ensure zero-based array
                    echo json_encode(['status' => 'success', 'message' => 'User updated successfully']);
                    exit;
                }
            }
            echo json_encode(['status' => 'error', 'message' => 'User not found']);
        } elseif ($action === 'delete') {
            // Delete User Logic
            $email = $_POST['email'];
            $users = array_filter($users, fn($user) => $user['email'] !== $email);
            file_put_contents($jsonFile, json_encode(array_values($users))); // Ensure zero-based array
            echo json_encode(['status' => 'success', 'message' => 'User deleted successfully']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized action']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Return list of users
    echo json_encode(array_values($users)); // Ensure zero-based array
}
?>
