<?php
include_once('conexao.php');

$postjson = json_decode(file_get_contents("php://input"), true);

// ---------- VALIDAR CAMPOS ----------
if (!$postjson['nome'] || strlen($postjson['nome']) < 3) {
    echo json_encode(['error' => 'Nome inválido.']);
    exit();
}

if (!filter_var($postjson['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['error' => 'Email inválido.']);
    exit();
}

if (strlen($postjson['telefone']) < 8) {
    echo json_encode(['error' => 'Telefone inválido.']);
    exit();
}

if (strlen($postjson['cpf']) < 11) {
    echo json_encode(['error' => 'CPF inválido.']);
    exit();
}

if (strlen($postjson['rg']) < 5) {
    echo json_encode(['error' => 'RG inválido.']);
    exit();
}

if (strlen($postjson['senha']) < 6) {
    echo json_encode(['error' => 'Senha muito curta.']);
    exit();
}

// ---------- VERIFICAR EMAIL EXISTENTE ----------
$query_buscar = $pdo->prepare("SELECT * FROM usuarios WHERE email = :email");
$query_buscar->bindValue(":email", $postjson['email']);
$query_buscar->execute();
$dados_buscar = $query_buscar->fetchAll(PDO::FETCH_ASSOC);

if (count($dados_buscar) > 0) {
    echo json_encode(['error' => 'Email já cadastrado!']);
    exit();
}

// ---------- INSERIR USUÁRIO ----------
$senhaHash = password_hash($postjson['senha'], PASSWORD_DEFAULT);

$query = $pdo->prepare("INSERT INTO usuarios SET 
    nome = :nome,
    email = :email,
    cpf = :cpf,
    rg = :rg,
    telefone = :telefone,
    senha = :senha");

$query->bindValue(":nome", $postjson['nome']);
$query->bindValue(":email", $postjson['email']);
$query->bindValue(":cpf", $postjson['cpf']);
$query->bindValue(":rg", $postjson['rg']);
$query->bindValue(":telefone", $postjson['telefone']);
$query->bindValue(":senha", $postjson['senha']);

$exec = $query->execute();

if ($exec) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Erro ao cadastrar usuário.']);
}
?>
