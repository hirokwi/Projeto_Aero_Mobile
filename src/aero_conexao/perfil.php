<?php
header('Content-Type: application/json');
include 'conexao.php';

$postjson = json_decode(file_get_contents("php://input"), true);
$id = $postjson['id'] ?? 0;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID inválido']);
    exit;
}

$query = $pdo->prepare("SELECT id, nome, email, cpf, rg, telefone, foto FROM usuarios WHERE id = :id");
$query->bindValue(":id", $id);
$query->execute();
$usuarios = $query->fetch(PDO::FETCH_ASSOC);

if ($usuarios) {
    echo json_encode(['success' => true, 'usuarios' => $usuarios]);
} else {
    echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
}
?>
