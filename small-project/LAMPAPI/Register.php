<?php
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/db.php';

$inData = getRequestInfo();

$firstName = trim($inData["firstName"] ?? "");
$lastName = trim($inData["lastName"] ?? "");
$login = trim($inData["login"] ?? "");
$password = trim($inData["password"] ?? "");

if (empty($login) || empty($password)) {
    sendResultInfoAsJson(-1, "Username and password are required");
    exit();
}

$conn = getDbConnection();
if ($conn->connect_error) {
    sendResultInfoAsJson(-1, $conn->connect_error);
} else {
    // Check if user with same login already exists
    $checkStmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
    $checkStmt->bind_param("s", $login);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        sendResultInfoAsJson(-1, "Username already taken");
        $checkStmt->close();
        $conn->close();
        exit();
    }
    $checkStmt->close();

    $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
    
    if ($stmt->execute()) {
        $id = $stmt->insert_id;
        sendResultInfoAsJson($id, "");
    } else {
        sendResultInfoAsJson(-1, "User registration failed");
    }
    
    $stmt->close();
    $conn->close();
}

function sendResultInfoAsJson($id, $error) {
    echo json_encode([
        "id" => (int)$id,
        "error" => $error
    ]);
}
?>
