<?php
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/db.php';

$inData = getRequestInfo();

$firstName = trim($inData["firstName"] ?? "");
$lastName = trim($inData["lastName"] ?? "");
$phone = trim($inData["phone"] ?? "");
$email = trim($inData["email"] ?? "");
$userId = (int)($inData["userId"] ?? 0);

if ($userId <= 0) {
    sendResultInfoAsJson("User ID is required to add contact");
    exit();
}

if (empty($firstName) && empty($lastName)) {
    sendResultInfoAsJson("Contact must have at least a first or last name");
    exit();
}

$conn = getDbConnection();
if ($conn->connect_error) {
    sendResultInfoAsJson($conn->connect_error);
} else {
    $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
    
    if ($stmt->execute()) {
        sendResultInfoAsJson("");
    } else {
        sendResultInfoAsJson("Failed to add contact");
    }

    $stmt->close();
    $conn->close();
}

function sendResultInfoAsJson($error) {
    echo json_encode(["error" => $error]);
}
?>
