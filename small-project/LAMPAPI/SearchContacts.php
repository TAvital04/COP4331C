<?php
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/db.php';

$inData = getRequestInfo();

$searchResults = [];
$searchQuery = trim($inData["search"] ?? "");
$search = "%" . $searchQuery . "%";
$userId = (int)($inData["userId"] ?? 0);

if ($userId <= 0) {
    sendResultInfoAsJson([], "Invalid User ID");
    exit();
}

$conn = getDbConnection();
if ($conn->connect_error) {
    sendResultInfoAsJson([], $conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserID=? ORDER BY FirstName ASC, LastName ASC");
    $stmt->bind_param("ssssi", $search, $search, $search, $search, $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $searchResults[] = [
            "ID" => (int)$row["ID"],
            "FirstName" => $row["FirstName"],
            "LastName" => $row["LastName"],
            "Phone" => $row["Phone"],
            "Email" => $row["Email"]
        ];
    }

    sendResultInfoAsJson($searchResults, "");

    $stmt->close();
    $conn->close();
}

function sendResultInfoAsJson($results, $error) {
    echo json_encode(["results" => $results, "error" => $error]);
}
?>
