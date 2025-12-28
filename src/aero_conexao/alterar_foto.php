<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");

include "conexao.php";

$id = $_POST['id'];

if (!isset($_FILES['foto'])) {
    echo json_encode(["success" => false, "msg" => "Nenhuma imagem recebida"]);
    exit();
}

$foto = $_FILES['foto'];

$ext = pathinfo($foto['name'], PATHINFO_EXTENSION);
$novoNome = "user_" . $id . "_" . time() . "." . $ext;

$caminho = "img/" . $novoNome;

if (move_uploaded_file($foto['tmp_name'], $caminho)) {

    $urlFoto = "http://*******/aero_conexao/" . $caminho;

    // USANDO PDO CORRETAMENTE
    $query = $pdo->prepare("UPDATE usuarios SET foto = :foto WHERE id = :id");
    $query->bindValue(":foto", $urlFoto);
    $query->bindValue(":id", $id);

    if ($query->execute()) {
        echo json_encode([
            "success" => true,
            "foto" => $urlFoto
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "msg" => "Erro ao atualizar foto no banco"
        ]);
    }

} else {
    echo json_encode(["success" => false, "msg" => "Falha ao mover imagem"]);
}
