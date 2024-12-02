const tabela = document.getElementById("Armazenamento_produtos");
let produtos = JSON.parse(localStorage.getItem("produtos"));

if (!produtos) {
    localStorage.setItem("produtos", JSON.stringify([]));
    location.reload();
}

for (let index = 0; index < produtos.length; index++) {
    const produto = produtos[index];
    const linha = `
        <tr>
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.descricao}</td>
            <td class="text-center">
                <div class="btn btn-warning" onClick="editarprodutos(${produto.id})">Editar</div>
                <div class="btn btn-danger" onClick="apagarprodutos(${produto.id})">Apagar</div>
            </td>
        </tr>
    `;
    tabela.innerHTML += linha;
}

function editarprodutos(id) {
    const produto = procuraProdutoById(id);

    // Abrir o modal
    var modal = new bootstrap.Modal(document.getElementById('modal_edicao'));
    modal.show();

    // Preencher os campos do formulário com os dados atuais do produto
    const nomeeditar = document.getElementById("Nome-editar");
    const quantidadeeditar = document.getElementById("Quantidade-editar");
    const descricaoeditar = document.getElementById("Descricao-editar");

    nomeeditar.value = produto.nome;
    quantidadeeditar.value = produto.quantidade;
    descricaoeditar.value = produto.descricao;

    // Função para salvar as alterações
    const formularioEditar = document.getElementById("editar_modal");
    formularioEditar.onsubmit = function(event) {
        event.preventDefault(); // Evitar que a página recarregue

        // Obter os novos valores
        produto.nome = nomeeditar.value;
        produto.quantidade = quantidadeeditar.value;
        produto.descricao = descricaoeditar.value;

        // Atualizar o produto no localStorage
        const produtos = JSON.parse(localStorage.getItem("produtos"));
        const index = produtos.findIndex(p => p.id === id);
        if (index !== -1) {
            produtos[index] = produto;
            localStorage.setItem('produtos', JSON.stringify(produtos));
        }

        // Fechar o modal após salvar
        modal.hide();
        location.reload(); // Atualizar a tabela
    };
}

function apagarprodutos(id) {
    Swal.fire({
        title: "Tem certeza?",
        text: "Você não poderá desfazer está ação",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, apagar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            const produtoAremover = produtos.findIndex(produto => produto.id == id);
            produtos.splice(produtoAremover, 1);
            localStorage.setItem('produtos', JSON.stringify(produtos));
            location.reload();
        }
    });
}

const formulario_inserir = document.getElementById("inserir");
formulario_inserir.onsubmit = function(event) {
    event.preventDefault();
    const quantidadeDigitada = document.getElementById("Quantidade-inserir").value;
    const descricaoDigitada = document.getElementById("Descricao-inserir").value;
    const nomeDigitado = document.getElementById("Nome-inserir").value;

    console.log(quantidadeDigitada, descricaoDigitada, nomeDigitado);

    let produtos = JSON.parse(localStorage.getItem("produtos"));
    const ultimoID = produtos[produtos.length - 1]?.id || 0;
    const produtoAdd = {
        id: ultimoID + 1,
        nome: nomeDigitado,
        quantidade: quantidadeDigitada,
        descricao: descricaoDigitada,
    };

    produtos.push(produtoAdd);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    location.reload();
};

function procuraProdutoByNome(nomeDigitado) {
    const produtos = JSON.parse(localStorage.getItem("produtos"));
    const found = produtos.find((produto) => {
        return produto.nome == nomeDigitado;
    });
    return found;
}

function procuraProdutoById(id) {
    const produtos = JSON.parse(localStorage.getItem("produtos"));
    const found = produtos.find((produto) => {
        return produto.id == id;
    });
    return found;
}
