<?php
header('Content-Type: application/json');
include 'conexao.php';

// Receber JSON do React Native
$postjson = json_decode(file_get_contents("php://input"), true);
$email = $postjson['email'] ?? '';
$senha = $postjson['senha'] ?? '';

if (!$email || !$senha) {
    echo json_encode(['success' => false, 'message' => 'Preencha todos os campos']);
    exit;
}

// Consultar usuário
$query = $pdo->prepare("SELECT id, nome, email, senha, cpf, rg, telefone FROM usuarios WHERE email = :email");
$query->bindValue(":email", $email);
$query->execute();
$usuarios = $query->fetch(PDO::FETCH_ASSOC);

if (!$usuarios) {
    echo json_encode(['success' => false, 'message' => 'Email ou senha incorretos']);
    exit;
}

// Verificar senha diretamente (texto puro)
if ($senha === $usuarios['senha']) {
    unset($usuarios['senha']); // não enviar a senha
    echo json_encode(['success' => true, 'usuarios' => $usuarios]);
} else {
    echo json_encode(['success' => false, 'message' => 'Email ou senha incorretos']);
}
?>
