<?php
header('Content-Type: application/json');
include 'conexao.php';

$postjson = json_decode(file_get_contents("php://input"), true);
$id = $postjson['id'] ?? 0;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID inválido']);
    exit;
}

// Busca bagagens de todas as passagens do usuário
$query = $pdo->prepare("
    SELECT 
        b.id_bagagem,
        b.codigo_rastreio,
        b.status_bagagem,
        b.ultima_atualizacao,
        p.id_passagem,
        v.origem,
        v.destino,
        v.data_voo,
        v.hora_voo
    FROM bagagens b
    INNER JOIN passagens p ON b.id_passagem = p.id_passagem
    INNER JOIN voos v ON p.id_voo = v.id_voo
    WHERE p.id = :id
");
$query->bindValue(":id", $id);
$query->execute();

$lista = $query->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'bagagens' => $lista
]);
?>
