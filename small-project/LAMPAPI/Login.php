<?php
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/db.php';

$inData = getRequestInfo();

$login = trim($inData["login"] ?? "");
$password = trim($inData["password"] ?? "");

if (empty($login) || empty($password)) {
    sendResultInfoAsJson(0, "", "", "Login and password are required");
    exit();
}

$conn = getDbConnection();
if ($conn->connect_error) {
    sendResultInfoAsJson(0, "", "", $conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName FROM Users WHERE Login=? AND Password=?");
    $stmt->bind_param("ss", $login, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        sendResultInfoAsJson($row['ID'], $row['FirstName'], $row['LastName'], "");
    } else {
        sendResultInfoAsJson(0, "", "", "No Records Found");
    }

    $stmt->close();
    $conn->close();
}

function sendResultInfoAsJson($id, $firstName, $lastName, $error) {
    echo json_encode([
        "id" => (int)$id,
        "firstName" => $firstName,
        "lastName" => $lastName,
        "error" => $error
    ]);
}
?>
