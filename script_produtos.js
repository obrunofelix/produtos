// Função para obter produtos do localStorage
function obterProdutos() {
    let produtos = JSON.parse(localStorage.getItem("produtos"));
    if (!produtos) {
        produtos = [];
        localStorage.setItem("produtos", JSON.stringify(produtos));
    }
    return produtos;
}

// Função para salvar produtos no localStorage
function salvarProdutos(produtos) {
    localStorage.setItem("produtos", JSON.stringify(produtos));
}

// Função para renderizar a tabela
function renderizarTabela() {
    const tabelaBody = document.getElementById("Armazenamento_produtos").querySelector("tbody");
    const produtos = obterProdutos();
    let linhas = '';

    produtos.forEach(produto => {
        linhas += `
            <tr>
                <td>${produto.id}</td>
                <td class="col-nome" data-bs-toggle="tooltip" title="${produto.nome}">${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td class="col-descricao" data-bs-toggle="tooltip" title="${produto.descricao}">${produto.descricao}</td>
                <td class="text-center">
                    <button class="btn btn-warning btn-sm me-2" onClick="editarprodutos(${produto.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onClick="apagarprodutos(${produto.id})">Apagar</button>
                </td>
            </tr>
        `;
    });

    tabelaBody.innerHTML = linhas;

    // Inicializar os tooltips após renderizar a tabela
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

// Função para procurar produto por ID
function procuraProdutoById(id) {
    const produtos = obterProdutos();
    return produtos.find(produto => produto.id === id);
}

// Função para editar produtos
function editarprodutos(id) {
    const produto = procuraProdutoById(id);

    if (!produto) {
        Swal.fire("Erro", "Produto não encontrado.", "error");
        return;
    }

    // Preencher os campos do formulário com os dados atuais do produto
    document.getElementById("id-editar").value = produto.id;
    document.getElementById("Nome-editar").value = produto.nome;
    document.getElementById("Quantidade-editar").value = produto.quantidade;
    document.getElementById("Descricao-editar").value = produto.descricao;

    // Abrir o modal de edição
    const modal = new bootstrap.Modal(document.getElementById('modal_edicao'));
    modal.show();
}

// Função para apagar produtos
function apagarprodutos(id) {
    Swal.fire({
        title: "Tem certeza?",
        text: "Você não poderá desfazer esta ação.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, apagar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            let produtos = obterProdutos();
            produtos = produtos.filter(produto => produto.id !== id);
            salvarProdutos(produtos);
            renderizarTabela();
            Swal.fire("Apagado!", "O produto foi apagado.", "success");
        }
    });
}

// Função para adicionar um novo produto
function adicionarProduto(event) {
    event.preventDefault();

    const nomeDigitado = document.getElementById("Nome-inserir").value.trim();
    const quantidadeDigitada = parseInt(document.getElementById("Quantidade-inserir").value);
    const descricaoDigitada = document.getElementById("Descricao-inserir").value.trim();

    if (!nomeDigitado || isNaN(quantidadeDigitada) || !descricaoDigitada) {
        Swal.fire("Erro", "Por favor, preencha todos os campos corretamente.", "error");
        return;
    }

    const produtos = obterProdutos();
    // Lógica ajustada para atribuir ID começando em 0
    const novoID = produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 0;
    const novoProduto = {
        id: novoID,
        nome: nomeDigitado,
        quantidade: quantidadeDigitada,
        descricao: descricaoDigitada,
    };

    produtos.push(novoProduto);
    salvarProdutos(produtos);
    renderizarTabela();
    Swal.fire("Sucesso", "Produto adicionado com sucesso.", "success");

    // Limpar o formulário
    event.target.reset();

    // Fechar o modal de inserção
    const modalInserir = bootstrap.Modal.getInstance(document.getElementById('modal_inserir'));
    modalInserir.hide();
}

// Função para salvar as edições do produto
function salvarEdicao(event) {
    event.preventDefault();

    const id = parseInt(document.getElementById("id-editar").value);
    const nome = document.getElementById("Nome-editar").value.trim();
    const quantidade = parseInt(document.getElementById("Quantidade-editar").value);
    const descricao = document.getElementById("Descricao-editar").value.trim();

    if (!nome || isNaN(quantidade) || !descricao) {
        Swal.fire("Erro", "Por favor, preencha todos os campos corretamente.", "error");
        return;
    }

    let produtos = obterProdutos();
    const index = produtos.findIndex(produto => produto.id === id);

    if (index !== -1) {
        produtos[index] = { id, nome, quantidade, descricao };
        salvarProdutos(produtos);
        renderizarTabela();
        Swal.fire("Sucesso", "Produto atualizado com sucesso.", "success");

        // Fechar o modal de edição
        const modalEdicao = bootstrap.Modal.getInstance(document.getElementById('modal_edicao'));
        modalEdicao.hide();
    } else {
        Swal.fire("Erro", "Produto não encontrado.", "error");
    }
}

// Inicialização ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    // Renderizar a tabela inicialmente
    renderizarTabela();

    // Configurar o formulário de inserção
    const formulario_inserir = document.getElementById("inserir");
    if (formulario_inserir) {
        formulario_inserir.addEventListener("submit", adicionarProduto);
    }

    // Configurar o formulário de edição
    const formulario_editar = document.getElementById("editar_modal");
    if (formulario_editar) {
        formulario_editar.addEventListener("submit", salvarEdicao);
    }
});
