<?php
header('Content-Type: application/json');
include 'conexao.php';

$postjson = json_decode(file_get_contents("php://input"), true);
$id = $postjson['id'] ?? 0;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID inválido']);
    exit;
}

$query = $pdo->prepare("
    SELECT 
        p.id_passagem,
        p.id,
        p.id_voo,
        p.confirmado,
        v.origem,
        v.destino,
        v.data_voo,
        v.hora_voo
    FROM passagens p
    INNER JOIN voos v ON v.id_voo = p.id_voo
    WHERE p.id = :id
    ORDER BY v.data_voo ASC
");

$query->bindValue(":id", $id);
$query->execute();

$reservas = $query->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'reservas' => $reservas
]);
?>
