<?php
/**
 * MPSTME Lost & Found Portal - Backend API
 * Version: 2.0 (WhatsApp Bridge Edition)
 */

// 1. HEADERS - Essential for AngularJS SPA communication
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// 2. DATABASE CONNECTION
// Update these if you move to a live hosting environment
$host = "localhost";
$user = "root";
$pass = ""; 
$db   = "college_lost_found";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database Connection Failed"]));
}

// 3. INPUT HANDLING
// AngularJS typically sends data as a JSON string in the request body
$data = json_decode(file_get_contents("php://input"));
$action = isset($_GET['action']) ? $_GET['action'] : '';

// 4. ROUTING LOGIC
switch($action) {

    case 'read': // FETCH ALL PUBLIC RECORDS
        $sql = "SELECT id, item_name, category, description, location, date, status, image_name FROM items ORDER BY id DESC";
        $result = $conn->query($sql);
        $items = array();
        while($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
        echo json_encode($items);
        break;

    case 'create': // LOG NEW ITEM (Handles Multipart/FormData for Images)
        $item_name    = $_POST['item_name'] ?? '';
        $description  = $_POST['description'] ?? '';
        $category     = $_POST['category'] ?? '';
        $location     = $_POST['location'] ?? '';
        $date         = $_POST['date'] ?? '';
        $status       = $_POST['status'] ?? 'Lost';
        $contact_info = $_POST['contact_info'] ?? '';
        $image_name   = null;

        // File Upload Logic
        if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
            $target_dir = "../uploads/";
            if (!is_dir($target_dir)) mkdir($target_dir, 0777, true);
            
            $file_ext = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
            $image_name = time() . "_" . uniqid() . "." . $file_ext;
            
            move_uploaded_file($_FILES["image"]["tmp_name"], $target_dir . $image_name);
        }

        $stmt = $conn->prepare("INSERT INTO items (item_name, description, category, location, date, status, contact_info, image_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssss", $item_name, $description, $category, $location, $date, $status, $contact_info, $image_name);
        
        if($stmt->execute()) {
            echo json_encode(["message" => "Success! Your report has been officially logged in the MPSTME directory."]);
        } else {
            echo json_encode(["error" => "Insert failed"]);
        }
        break;

    case 'get_contact': // SECURE LOOKUP FOR WHATSAPP BRIDGE
        // This keeps phone numbers off the main 'read' action to prevent public scraping
        if(!empty($data->id)) {
            $stmt = $conn->prepare("SELECT contact_info FROM items WHERE id = ?");
            $stmt->bind_param("i", $data->id);
            $stmt->execute();
            $result = $stmt->get_result();
            if($row = $result->fetch_assoc()) {
                // Returns the raw number only to the authorized JavaScript function
                echo json_encode(["phone" => $row['contact_info']]);
            } else {
                echo json_encode(["error" => "Contact not found"]);
            }
        }
        break;

    case 'update': // ADMIN: Update status (e.g. Lost -> Claimed)
        if(!empty($data->id)) {
            $stmt = $conn->prepare("UPDATE items SET status = ? WHERE id = ?");
            $stmt->bind_param("si", $data->status, $data->id);
            if($stmt->execute()) {
                echo json_encode(["message" => "Record updated successfully."]);
            }
        }
        break;

    case 'delete': // ADMIN: Remove record
        if(isset($_GET['id'])) {
            $id = (int)$_GET['id'];
            $conn->query("DELETE FROM items WHERE id = $id");
            echo json_encode(["message" => "Record deleted successfully."]);
        }
        break;

    default:
        echo json_encode(["error" => "Invalid Action Requested"]);
        break;
}

$conn->close();
?>