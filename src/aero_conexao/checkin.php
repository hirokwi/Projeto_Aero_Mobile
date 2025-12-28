<?php
include_once('conexao.php');

header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents("php://input"), true);
$acao = $data['acao'] ?? '';

/*
  A tabela PASSAGENS contém:

  id_passagem   (PK da passagem)
  id            (FK do usuário → usuarios.id)
  id_voo        (FK do voo)
  confirmado

  OU SEJA:
  Sempre que se tratar do usuário, o nome é SEMPRE "id".
*/

/* ============================
      LISTAR VOOS DO USUÁRIO
============================ */
if ($acao === 'listar') {

    // O app envia id_usuario, então vamos aceitar isso,
    // mas transformar para o nome correto: id.
    $usuario_id = intval($data['id_usuario'] ?? $data['id'] ?? 0);

    if (!$usuario_id) {
        echo json_encode(['success' => false, 'message' => 'Usuário inválido']);
        exit;
    }

    $sql = "SELECT 
                p.id_passagem,
                p.confirmado,
                v.id_voo,
                v.numero_voo,
                v.origem,
                v.destino,
                v.data_voo AS data,
                v.hora_voo AS hora
            FROM passagens p
            INNER JOIN voos v ON v.id_voo = p.id_voo
            WHERE p.id = :id   -- aqui usamos APENAS 'id'
            ORDER BY v.data_voo, v.hora_voo";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id', $usuario_id, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(['success' => true, 'voos' => $stmt->fetchAll()]);
    exit;
}

/* ============================
          FAZER CHECK-IN
============================ */
if ($acao === 'fazer_checkin') {

    $id_passagem = intval($data['id_passagem'] ?? 0);

    if (!$id_passagem) {
        echo json_encode(['success' => false, 'msg' => 'Passagem inválida']);
        exit;
    }

    $sql = "UPDATE passagens SET confirmado = 1 WHERE id_passagem = :id_passagem";

    $upd = $pdo->prepare($sql);
    $upd->bindValue(':id_passagem', $id_passagem, PDO::PARAM_INT);

    try {
        $upd->execute();
        echo json_encode(['success' => true, 'msg' => 'Check-in realizado!']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'msg' => 'Erro: '.$e->getMessage()]);
    }

    exit;
}

echo json_encode(['success' => false, 'msg' => 'Ação inválida']);
?>
