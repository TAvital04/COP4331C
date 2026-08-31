<?php
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/db.php';

$inData = getRequestInfo();

$contactId = (int)($inData["contactId"] ?? 0);
$userId = (int)($inData["userId"] ?? 0);

if ($contactId <= 0 || $userId <= 0) {
    sendResultInfoAsJson("Invalid parameters for deleting contact");
    exit();
}

$conn = getDbConnection();
if ($conn->connect_error) {
    sendResultInfoAsJson($conn->connect_error);
} else {
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
    $stmt->bind_param("ii", $contactId, $userId);
    
    if ($stmt->execute()) {
        sendResultInfoAsJson("");
    } else {
        sendResultInfoAsJson("Failed to delete contact");
    }

    $stmt->close();
    $conn->close();
}

function sendResultInfoAsJson($error) {
    echo json_encode(["error" => $error]);
}
?>
