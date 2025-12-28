<?php
include_once('conexao.php');

$json = file_get_contents('php://input');
$req = json_decode($json, true);

$id_inbox = @$req['id_inbox'];

$query = $pdo->prepare("UPDATE inbox SET lida = 1 WHERE id_inbox = :id");
$query->bindValue(':id', $id_inbox);
$query->execute();

echo json_encode(array(
    'success' => true,
    'msg' => 'Mensagem marcada como lida'
));
?>
