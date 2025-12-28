<?php
include_once('conexao.php');

$dados = json_decode(file_get_contents("php://input"), true);

$id_inbox = $dados['id_inbox'];

$query = $pdo->prepare("DELETE FROM inbox WHERE id_inbox = :id");
$query->bindValue(":id", $id_inbox);
$query->execute();

echo json_encode(['success' => true]);
