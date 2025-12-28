<?php
header('Content-Type: application/json');
include 'conexao.php';

$postjson = json_decode(file_get_contents("php://input"), true);
$action = $postjson['action'] ?? '';

switch($action) {

    case 'listar':
        $query = $pdo->query("SELECT * FROM voos ORDER BY id DESC");
        $dados = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'voos' => $dados]);
        break;

    case 'adicionar':
        $query = $pdo->prepare("INSERT INTO voos (codigo_voo, origem, destino, data, horario, companhia, status_voo)
            VALUES (:c, :o, :d, :dt, :h, :cp, :s)");

        $query->bindValue(":c", $postjson['codigo_voo']);
        $query->bindValue(":o", $postjson['origem']);
        $query->bindValue(":d", $postjson['destino']);
        $query->bindValue(":dt", $postjson['data']);
        $query->bindValue(":h", $postjson['horario']);
        $query->bindValue(":cp", $postjson['companhia']);
        $query->bindValue(":s", $postjson['status_voo']);

        $query->execute();
        echo json_encode(['success' => true]);
        break;

    case 'editar':
        $query = $pdo->prepare("UPDATE voos SET 
            origem = :o, destino = :d, data = :dt, horario = :h, companhia = :cp, status_voo = :s
            WHERE codigo_voo = :c");

        $query->bindValue(":o", $postjson['origem']);
        $query->bindValue(":d", $postjson['destino']);
        $query->bindValue(":dt", $postjson['data']);
        $query->bindValue(":h", $postjson['horario']);
        $query->bindValue(":cp", $postjson['companhia']);
        $query->bindValue(":s", $postjson['status_voo']);
        $query->bindValue(":c", $postjson['codigo_voo']);

        $query->execute();
        echo json_encode(['success' => true]);
        break;

    case 'excluir':
        $query = $pdo->prepare("DELETE FROM voos WHERE codigo_voo = :c");
        $query->bindValue(":c", $postjson['codigo_voo']);
        $query->execute();
        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Ação inválida']);
}
?>
