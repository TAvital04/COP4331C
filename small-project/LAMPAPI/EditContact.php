<?php
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/db.php';

$inData = getRequestInfo();

$contactId = (int)($inData["contactId"] ?? 0);
$firstName = trim($inData["firstName"] ?? "");
$lastName = trim($inData["lastName"] ?? "");
$phone = trim($inData["phone"] ?? "");
$email = trim($inData["email"] ?? "");
$userId = (int)($inData["userId"] ?? 0);

if ($contactId <= 0 || $userId <= 0) {
    sendResultInfoAsJson("Invalid parameters for updating contact");
    exit();
}

$conn = getDbConnection();
if ($conn->connect_error) {
    sendResultInfoAsJson($conn->connect_error);
} else {
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? AND UserID=?");
    $stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $contactId, $userId);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows >= 0) {
            sendResultInfoAsJson("");
        } else {
            sendResultInfoAsJson("No contact updated");
        }
    } else {
        sendResultInfoAsJson("Failed to update contact");
    }

    $stmt->close();
    $conn->close();
}

function sendResultInfoAsJson($error) {
    echo json_encode(["error" => $error]);
}
?>
