<?php
$jsonFile = 'users.json';

// Initialize users data if the JSON file does not exist
if (!file_exists($jsonFile)) {
    file_put_contents($jsonFile, json_encode([]));
}
$users = json_decode(file_get_contents($jsonFile), true);

// Dummy token for simplicity
$authToken = 'secure-token-123';

// Function to check authentication token
function isAuthenticated() {
    global $authToken;
    return isset($_POST['token']) && $_POST['token'] === $authToken;
}

// Handling POST requests for login, signup, and user management
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];

    if ($action === 'login') {
        $email = $_POST['email'];
        $password = $_POST['password'];

        // Check if the user exists
        foreach ($users as $user) {
            if ($user['email'] === $email && password_verify($password, $user['password'])) {
                echo json_encode(['status' => 'success', 'token' => $authToken]);
                exit;
            }
        }
        echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    } elseif (!isAuthenticated()) {
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
        exit;
    } elseif ($action === 'add') {
        $name = $_POST['name'];
        $email = $_POST['email'];
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

        // Add new user to the array
        $users[] = ['name' => $name, 'email' => $email, 'password' => $password];
        file_put_contents($jsonFile, json_encode($users));
        echo json_encode(['status' => 'success', 'message' => 'User added successfully']);
    } elseif ($action === 'update') {
        $email = $_POST['email'];
        foreach ($users as &$user) {
            if ($user['email'] === $email) {
                $user['name'] = $_POST['name'];
                file_put_contents($jsonFile, json_encode($users));
                echo json_encode(['status' => 'success', 'message' => 'User updated successfully']);
                exit;
            }
        }
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
    } elseif ($action === 'delete') {
        $email = $_POST['email'];
        $users = array_filter($users, fn($user) => $user['email'] !== $email);
        file_put_contents($jsonFile, json_encode($users));
        echo json_encode(['status' => 'success', 'message' => 'User deleted successfully']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch and return all users as JSON
    echo json_encode($users);
}
?>
