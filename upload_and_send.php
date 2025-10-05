<?php
// ===== Configuration =====
$ACCESS_TOKEN = "YOUR_WHATSAPP_CLOUD_ACCESS_TOKEN"; // TODO: replace
$PHONE_NUMBER_ID = "YOUR_PHONE_NUMBER_ID"; // TODO: replace
$uploadDir = __DIR__ . '/uploads/';
$baseUrl = "https://yourdomain.com/uploads/"; // TODO: replace with your domain

// Basic validation
$orderId = $_POST['order_id'] ?? 'N/A';
$toPhone = $_POST['phone'] ?? null;

if (!$toPhone || !isset($_FILES['screenshot'])) {
    http_response_code(400);
    echo "رقم الهاتف أو الصورة ناقصة.";
    exit;
}

// Ensure uploads directory exists
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
        http_response_code(500);
        echo "تعذر إنشاء مجلد الرفع.";
        exit;
    }
}

$file = $_FILES['screenshot'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo "خطأ في رفع الملف.";
    exit;
}

$allowed = ['jpg','jpeg','png','webp','gif'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowed, true)) {
    http_response_code(400);
    echo "صيغة غير مدعومة.";
    exit;
}

$filename = uniqid('pay_', true) . '.' . $ext;
$target = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $target)) {
    http_response_code(500);
    echo "فشل في حفظ الصورة.";
    exit;
}

$imageLink = $baseUrl . rawurlencode($filename);

// Send via WhatsApp Cloud API
$payload = [
    "messaging_product" => "whatsapp",
    "to" => $toPhone,
    "type" => "image",
    "image" => [
        "link" => $imageLink,
        "caption" => "Order #$orderId - تم الدفع"
    ]
];

$url = "https://graph.facebook.com/v17.0/{$PHONE_NUMBER_ID}/messages";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {$ACCESS_TOKEN}",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_UNICODE));

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    echo "تم إرسال الأوردر بنجاح إلى WhatsApp!";
} else {
    http_response_code(500);
    echo "فشل إرسال الرسالة. HTTP Code: {$httpCode}. Response: {$result}. Error: {$curlErr}";
}

?>


