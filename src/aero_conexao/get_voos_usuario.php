<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json; charset=utf-8');

include_once("conexao.php");

$input = json_decode(file_get_contents("php://input"), true);

$id_usuario = intval($input["id"] ?? 0);

if ($id_usuario <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "ID inválido"
    ]);
    exit;
}

/*
Tabelas usadas:

usuarios → id
passagens → id (FK usuário), id_voo, confirmado
voos → id_voo, numero_voo, origem, destino, data_voo, hora_voo
*/

$sql = "
SELECT 
    p.id_passagem,
    p.confirmado,
    v.id_voo,
    v.numero_voo,
    v.origem,
    v.destino,
    v.data_voo,
    v.hora_voo
FROM passagens p
INNER JOIN voos v ON v.id_voo = p.id_voo
WHERE p.id = :id
ORDER BY v.data_voo, v.hora_voo
";

$stmt = $pdo->prepare($sql);
$stmt->bindValue(":id", $id_usuario, PDO::PARAM_INT);
$stmt->execute();

$voos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "voos" => $voos
]);
