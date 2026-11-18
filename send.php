<?php
// Simple form mailer for cPanel hosting.
// 1) Change $to to the inbox that should receive leads.
// 2) $from should be an address on YOUR domain (create it in cPanel > Email Accounts)
//    so messages aren't marked as spam.
$to   = 'sales@bestbuyautomobile.com';
$from = 'website@bestbuyautomobile.com';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

// Honeypot: bots fill hidden fields, humans don't
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

function clean($v) {
    return trim(str_replace(["\r", "\n"], ' ', strip_tags((string)$v)));
}

$form = clean($_POST['form'] ?? 'contact');
$fields = [];
foreach ($_POST as $k => $v) {
    if (in_array($k, ['form', 'website'], true)) continue;
    $fields[ucfirst(clean($k))] = clean($v);
}

if ($form === 'contact' && (empty($fields['Name']) || empty($fields['Phone']))) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Name and phone are required.']);
    exit;
}

$subject = $form === 'sell' ? 'New trade-in request — website' : 'New test drive request — website';
$body = $subject . "\n\n";
foreach ($fields as $k => $v) {
    $body .= str_pad($k . ':', 14) . ($v !== '' ? $v : '—') . "\n";
}
$body .= "\nSent " . date('Y-m-d H:i') . " from " . ($_SERVER['HTTP_HOST'] ?? 'website');

$headers = "From: Best Buy Automobile <$from>\r\n";
$email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
if ($email) $headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);
echo json_encode(['ok' => $sent]);
