<?php
header('Content-Type: application/json');
include 'conexao.php';

$postjson = json_decode(file_get_contents("php://input"), true);
$id_passagem = $postjson['id_passagem'] ?? 0;

if (!$id_passagem) {
    echo json_encode(['success' => false, 'msg' => 'ID da passagem inválido']);
    exit;
}

$query = $pdo->prepare("DELETE FROM passagens WHERE id_passagem = :id");
$query->bindValue(":id", $id_passagem);

if ($query->execute()) {
    echo json_encode(['success' => true, 'msg' => 'Reserva cancelada com sucesso!']);
} else {
    echo json_encode(['success' => false, 'msg' => 'Erro ao cancelar reserva']);
}
?>
