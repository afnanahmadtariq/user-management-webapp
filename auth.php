<?php
// Simple authentication check
function isAuthenticated() {
    global $authToken;
    return isset($_POST['token']) && $_POST['token'] === $authToken;
}
?>
