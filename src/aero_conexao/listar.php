<?php
include_once('conexao.php');

$busca = '%' . $_GET['busca'] . '%';

$query = $pdo->query("SELECT * FROM usuarios WHERE cpf LIKE '$busca'");

$res = $query->fetchAll(PDO::FETCH_ASSOC);

$dados = [];

for ($i = 0; $i < count($res); $i++) {

    $dados[] = array(
        'id' => $res[$i]['id'],
        'nome' => $res[$i]['nome'],
        'email' => $res[$i]['email'],
        'telefone' => $res[$i]['telefone'],
        'cpf' => $res[$i]['cpf'],
        'rg' => $res[$i]['rg'],
        'senha' => $res[$i]['senha'],
        'foto' => $res[$i]['foto']  // <-- AQUI!!! (faltava isso)
    );
}

if (count($res) > 0) {
    $result = json_encode(array('success' => true, 'result' => $dados));
} else {
    $result = json_encode(array('success' => false, 'result' => '0'));
}

echo $result;
