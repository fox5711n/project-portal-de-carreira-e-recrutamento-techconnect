<?php
// process.php — validação e exibição simples dos dados do formulário
header('Content-Type: text/html; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo '<p>Erro: método de requisição inválido.</p>';
    exit;
}

$nome = isset($_POST['nome']) ? trim((string) $_POST['nome']) : '';
$email = isset($_POST['email']) ? trim((string) $_POST['email']) : '';

if ($nome === '' || $email === '') {
    http_response_code(400);
    echo '<p>Erro: nome e email são obrigatórios.</p>';
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo '<p>Erro: email inválido.</p>';
    exit;
}

// Saída segura
echo '<h1>Dados Recebidos</h1>';
echo '<p>Nome: ' . htmlspecialchars($nome, ENT_QUOTES, 'UTF-8') . '</p>';
echo '<p>Email: ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</p>';

?>