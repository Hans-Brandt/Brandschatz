<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $status, bool $success): void
{
    http_response_code($status);
    echo json_encode(['success' => $success], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, false);
}

$rawBody = file_get_contents('php://input');

if ($rawBody === false || strlen($rawBody) > 20000) {
    respond(400, false);
}

$data = json_decode($rawBody ?: '', true);

if (!is_array($data)) {
    respond(400, false);
}

// Unsichtbares Feld: Bots füllen es häufig aus, Menschen nicht.
if (!empty($data['website'])) {
    respond(200, true);
}

function textValue(array $data, string $key, int $maxLength): string
{
    $rawValue = $data[$key] ?? '';

    if (!is_string($rawValue) && !is_numeric($rawValue)) {
        return '';
    }

    $value = trim((string) $rawValue);
    return substr($value, 0, $maxLength);
}

function easterSunday(int $year): DateTimeImmutable
{
    $a = $year % 19;
    $b = intdiv($year, 100);
    $c = $year % 100;
    $d = intdiv($b, 4);
    $e = $b % 4;
    $f = intdiv($b + 8, 25);
    $g = intdiv($b - $f + 1, 3);
    $h = (19 * $a + $b - $d - $g + 15) % 30;
    $i = intdiv($c, 4);
    $k = $c % 4;
    $l = (32 + 2 * $e + 2 * $i - $h - $k) % 7;
    $m = intdiv($a + 11 * $h + 22 * $l, 451);
    $month = intdiv($h + $l - 7 * $m + 114, 31);
    $day = (($h + $l - 7 * $m + 114) % 31) + 1;

    return new DateTimeImmutable(sprintf('%04d-%02d-%02d', $year, $month, $day));
}

function isSchleswigHolsteinHoliday(DateTimeImmutable $date): bool
{
    $fixedHolidays = ['01-01', '05-01', '10-03', '10-31', '12-25', '12-26'];

    if (in_array($date->format('m-d'), $fixedHolidays, true)) {
        return true;
    }

    $easterSunday = easterSunday((int) $date->format('Y'));
    $movableHolidays = [
        $easterSunday->modify('-2 days')->format('Y-m-d'),
        $easterSunday->modify('+1 day')->format('Y-m-d'),
        $easterSunday->modify('+39 days')->format('Y-m-d'),
        $easterSunday->modify('+50 days')->format('Y-m-d'),
    ];

    return in_array($date->format('Y-m-d'), $movableHolidays, true);
}

$reservationLocations = [
    'inside' => 'Drinnen',
    'outside' => 'Draußen',
];
$allowedTimes = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

$reservationLocation = textValue($data, 'reservationLocation', 20);
$name = textValue($data, 'name', 120);
$email = textValue($data, 'email', 254);
$phone = textValue($data, 'phone', 40);
$guests = filter_var($data['guests'] ?? null, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1, 'max_range' => 60],
]);
$date = textValue($data, 'date', 10);
$time = textValue($data, 'time', 5);
$message = textValue($data, 'message', 2000);
$consent = ($data['consent'] ?? '') === 'accepted';

$dateObject = DateTimeImmutable::createFromFormat('!Y-m-d', $date);
$validDate = $dateObject !== false
    && $dateObject->format('Y-m-d') === $date
    && $dateObject >= new DateTimeImmutable('today')
    && ((int) $dateObject->format('N') >= 6 || isSchleswigHolsteinHoliday($dateObject));
$validTime = in_array($time, $allowedTimes, true);

if (
    !array_key_exists($reservationLocation, $reservationLocations)
    || strlen($name) < 2
    || filter_var($email, FILTER_VALIDATE_EMAIL) === false
    || strlen($phone) < 5
    || $guests === false
    || !$validDate
    || !$validTime
    || !$consent
) {
    respond(422, false);
}

$locationLabel = $reservationLocations[$reservationLocation];
$formattedDate = $dateObject->format('d.m.Y');
$subject = 'Neue Reservierungsanfrage: ' . $formattedDate . ', ' . $locationLabel;
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$body = implode("\r\n", [
    'Neue Reservierungsanfrage über brandtschatz.de',
    '',
    'Platz: ' . $locationLabel,
    'Name: ' . $name,
    'E-Mail: ' . $email,
    'Telefon: ' . $phone,
    'Personenzahl: ' . (string) $guests,
    'Wunschtermin: ' . $formattedDate,
    'Uhrzeit: ' . $time . ' Uhr',
    '',
    'Nachricht:',
    $message !== '' ? $message : 'Keine zusätzliche Nachricht',
    '',
    'Die Anfrage muss noch bestätigt werden.',
]);
$headers = implode("\r\n", [
    'From: Website Brandtschatz <noreply@brandtschatz.de>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
]);

$recipient = 'hansbrandt6@web.de';

if (!mail($recipient, $encodedSubject, $body, $headers)) {
    respond(503, false);
}

respond(200, true);
