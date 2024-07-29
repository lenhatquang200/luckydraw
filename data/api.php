<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'savePrizeSetting') {
        $prizeSetting = $_POST['prizeSetting'] ?? '';
        $filePath = 'prizeSetting.json';
        $lines = explode("\n", trim($prizeSetting));
        $data = [];
        foreach ($lines as $index => $line) {
            if ($line !== '') {
                $data[$index + 1] = $line;
            }
        }

        // Save the data to the file
        file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo 'File successfully saved';
    }
    if (isset($_POST['action']) && $_POST['action'] === 'saveParticipants') {
        $participants = $_POST['participants'] ?? '';
        $filePath = 'participants.json';

        // Convert each line to an object with incremented keys
        $lines = explode("\n", trim($participants));
        $data = [];
        foreach ($lines as $index => $line) {
            if ($line !== '') {
                $data[$index + 1] = $line;
            }
        }

        // Save the data to the file with UTF-8 encoding
        file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo 'File successfully saved';
    }
    if (isset($_POST['action']) && $_POST['action'] === 'saveSpinResult') {
        $result = $_POST['result'] ?? '';
        $filePath = 'spinResults.json';

        if (!empty($result)) {
            $resultData = json_decode($result, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                // Load existing data
                $existingData = [];
                if (file_exists($filePath)) {
                    $existingData = json_decode(file_get_contents($filePath), true);
                }

                // Append new result
                $existingData[] = $resultData;

                // Save updated data
                file_put_contents($filePath, json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                echo 'Result successfully saved';
            } else {
                echo 'Invalid JSON format';
            }
        } else {
            echo 'No result data';
        }
    }
    if (isset($_POST['action']) && $_POST['action'] === 'clearWinners') {
        $filePath = 'spinResults.json';

        // Clear the winners file
        file_put_contents($filePath, json_encode([])); // Write an empty array to the file


        echo 'Winners list cleared';
    }

} else {
    http_response_code(405);
    echo 'Method not allowed';
}
