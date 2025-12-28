<?php
header('Content-Type: application/json');
include 'conexao.php';

$postjson = json_decode(file_get_contents("php://input"), true);

$cidade = $postjson['cidade'] ?? '';

if (!$cidade) {
    echo json_encode([
        'success' => false,
        'message' => 'Cidade não informada'
    ]);
    exit;
}

try {
    $query = $pdo->prepare("
        SELECT *
        FROM aeroportos
        WHERE cidade = :cidade
        LIMIT 1
    ");

    $query->bindValue(":cidade", $cidade);
    $query->execute();

    $aeroporto = $query->fetch(PDO::FETCH_ASSOC);

    if ($aeroporto) {
        echo json_encode([
            "success" => true,
            "aeroporto" => $aeroporto
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Nenhum aeroporto encontrado"
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erro no servidor",
        "error" => $e->getMessage()
    ]);
}
?>
