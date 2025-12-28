<?php
include_once('conexao.php');

$json = file_get_contents('php://input');
$req = json_decode($json, true);

$id_usuario = @$req['id_usuario'];

$query = $pdo->prepare("SELECT * FROM inbox WHERE id_usuario = :id ORDER BY data DESC");
$query->bindValue(':id', $id_usuario);
$query->execute();

$res = $query->fetchAll(PDO::FETCH_ASSOC);

$dados = [];

for ($i = 0; $i < count($res); $i++) {
    $dados[] = array(
        'id_inbox' => $res[$i]['id_inbox'],
        'titulo' => $res[$i]['titulo'],
        'mensagem' => $res[$i]['mensagem'],
        'data' => $res[$i]['data'],
        'lida' => $res[$i]['lida']
    );
}

echo json_encode(array(
    'success' => true,
    'mensagens' => $dados
));
?>
