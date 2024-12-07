document.getElementById("processFile").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");  // Aqui, pegamos o elemento input
    const file = fileInput?.files[0];  // Aqui pegamos o arquivo selecionado (o primeiro arquivo, caso haja múltiplos)

    if (!file) {
        alert("Por favor, selecione um arquivo");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = e.target.result; // 'result' agora é um ArrayBuffer

        // Verifica se o arquivo é um Excel ou CSV
        if (file.name.endsWith(".xlsx")) {  // Usando name do arquivo para verificar a extensão
            processExcel(data);
        } else if (file.name.endsWith(".csv")) {
            processCSV(data);
        } else {
            alert("Formato de arquivo não suportado.");
        }
    };

    // Usando readAsArrayBuffer, que é a forma recomendada
    reader.readAsArrayBuffer(file);  // Aqui passamos o arquivo como argumento
});

function processCSV(data) {
    // Papa.parse aceita ArrayBuffer diretamente como entrada
    Papa.parse(data, {
        header: true,
        complete: (results) => {
            console.log("Dados CSV processados:", results.data);
            const naturezas = results.data.map((row) => row["Natureza"]);
            gerarEstatisticas(naturezas);
        },
    });
    
}

function processExcel(data) {
    const XLSX = window.XLSX;
    // Modifiquei a leitura para trabalhar com ArrayBuffer
    const workbook = XLSX.read(data, { type: "array" });  // Usando 'array' para ArrayBuffer
    const sheetName = workbook.SheetNames[0];  // Ajustado para pegar o nome da primeira aba
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    const naturezas = jsonData.map((row) => row["Natureza"]);
    gerarEstatisticas(naturezas);
}

function gerarEstatisticas(naturezas) {
    const categorias = {
        Permanencia_área_central: [
            "Parada / Permanência  Preventiva - ÁREA CENTRAL",
            "Parada / Permanência  Preventiva - PRAÇA CENTRAL",
        ],
        Permanencia_rodoviária: [
            "Parada / Permanência  Preventiva - Rodoviária ",
        ],
        Permanencia_unidade_de_saúde: [
            "Parada / Permanência Preventiva - Unidade de Saúde",
        ],
        Permanencia_Unidade_escolar: [
            "Parada / Permanência Preventiva - Unidade Escolar",
            "Parada / Permanência Preventiva - Unidade Escolar / Operação Saturação",
        ],
        Permanencia_feira: [
            "Parada / Permanência  Preventiva - FEIRA LIVRE",
        ],
        Permanencia_câmara_municipal: [
            "Parada / Permanência  Preventiva - Câmara Municipal ",
        ],
        Permanencia_cachoeira_de_emas: [
            "Parada / Permanência  Preventiva - CACHOEIRA DE EMAS",
        ],
        Permanencia_feira: [
            "Parada / Permanência  Preventiva - FEIRA LIVRE",
        ],
        Permanencia_próprios_municipais: [
            "Parada / Permanência  Preventiva ",
            "Parada / Permanência  Preventiva - ÁREA CENTRAL",
            "Parada / Permanência  Preventiva - CACHOEIRA DE EMAS",
            "Parada / Permanência  Preventiva - Câmara Municipal ",
            "Parada / Permanência  Preventiva - FEIRA LIVRE",
            "parada / permanência preventiva - outros órgãos públicos",
        ],
        Apoio_geral: [
            "apoio",
            "apoio a ongs",
            "apoio a órgãos de saúde , santa casa - ps - ubs - upa - caps",
        ],
        Apoio: [
            "Apoio",
        ],
        Apoio_policia_militar_bombeiros: [
            "Apoio a Militar/Policial Militar/Bombeiro",
        ],
        Apoio_SAMU: [
            "Apoio a Orgãos  de  Saúde , Santa Casa  - PS - UBS - UPA - CAPS",
            "Apoio Samu",
        ],
        Apoio_conselho_tutelar: [
            "Apoio Conselho Tutelar",
        ],
        Apoio_evento: [
            "Apoio/Monitoramento a eventos",
        ],
        Apoio_outros_orgãos: [
            "Apoio a outros órgãos",
            "Apoio Órgãos Públicos",
        ],
        Auxilio_ao_público: [
            "Auxílio ao público - Cidadão",         
        ],
        Atitude_suspeita: [
            "Abordagem a pessoas em atitude suspeita",
            "Averiguação / Outros",
            "Averiguação Atitude Suspeita",
            "Conduta Inconveniente",
        ],
        Desinteligencia: [
            "Desinteligência",
        ],
        Furto: [
            "Averiguação de Furto",
        ],
        Ocorrencia_com_drogas: [
            "Averiguação de Uso de Drogas",
            "Localização de drogas",
            "Tráfico de drogas",
        ],
        Invasão: [
            "Comunicação de invasão",
            "Invasão à proprio municipal - estadual",
        ],
        Pessoa_desaparecida: [
            "Desaparecimento de pessoa",
        ],
        Descumbrimento_de_medida_protetiva: [
            "Descumprimento de Ordem Judicial/Medida Protetiva / Averiguação / Outros",
        ],
        Encontro_de_cadaver: [
            "Encontro de cadáver",
        ],
        Fiscalização_de_posturas: [
            "Fiscalização de Posturas",
            "Perturbação do trabalho ou do sossego alheio",
            "Perturbação da tranquilidade",
            "Averiguação Ambiental",
        ],
        Lesão_corporal: [
            "Averiguação / Outros / Agressão",
            "Lesão corporal",
            "Lesão corporal / Ameaça",
        ],
        Operação_saturação: [
            "Operação Saturação",
        ],
        Roubo: [
            "Roubo",
        ],
        Tentativa_de_suicídio: [
            "Tentativa de suicídio",
        ],
        Trânsito: [
            "Acidente / Acidente de trânsito com vítima",
            "Acidente de trânsito com vítima",
            "Acidente de trânsito com vítima / Acidente de trânsito sem vítima / Acidente com Lesão Corporal",
            "Averiguação de Veiculo",
            "Acidente de trânsito sem vítima",
            "Averiguação de Veiculo / Acidente de trânsito com vítima",
            "Denúncia / Infração de trânsito",
            "Denúncia / Infração de trânsito / Fiscalização e policiamento - tráfego",
            "Fiscalização e policiamento - tráfego",
            "Fiscalização e policiamento - tráfego / Infração de trânsito / Denúncia",
            "Infração de trânsito / Denúncia",
            "Infração de trânsito / Denúncia / Porte de drogas para consumo pessoal",
            "Infração de trânsito / Embriaguez / Denúncia",
            "Remoção de veículo",
            "Embriaguez / Averiguação / Outros",
        ],
        Violência_doméstica: [
            "Violência doméstica",
        ],
        Ocorrencia_com_animais: [
            "Apoio a ONGs",
            "Maus-tratos a animais",
            "Ocorrência envolvendo animais",
        ],
        Porte_de_arma_branca: [
            "Porte de arma branca / Desacato / Porte de drogas para consumo pessoal",
        ],
        Localização_de_veículo: [
            "Localização de veículo",
        ],
        Pessoa_indigente: [
            "Pessoa indigente",
        ],
        Deslocamento_administrativo: [
            "Deslocamento Administrativo",
        ],
        Patrulhamento_em_próprios_públicos: [
            "Patrulhamento preventivo",
        ],
    };

    const contagem = {};

    for (const natureza of naturezas) {
        let categorizada = false;

        // Normaliza a natureza para evitar problemas com espaços ou maiúsculas
        const naturezaNormalizada = natureza
            ? natureza.toLowerCase().trim()
            : "";

        for (const [categoria, palavrasChave] of Object.entries(categorias)) {
            if (
                palavrasChave.some((palavra) =>
                    naturezaNormalizada.includes(palavra.trim().toLowerCase())
                )
            ) {
                contagem[categoria] = (contagem[categoria] || 0) + 1;
                categorizada = true;
                break;
            }
        }

        if (!categorizada) {
            contagem["Outros"] = (contagem["Outros"] || 0) + 1;
        }
    }

    console.log("Contagem de Categorias:", contagem); // Depuração
    exibirGrafico(contagem);
}


function exibirGrafico(dados) {
    const ctx = document.getElementById("naturezaChart").getContext("2d");
    const labels = Object.keys(dados);
    const valores = Object.values(dados);

    const cores = [
        "rgba(255, 99, 132, 0.5)", 
        "rgba(54, 162, 235, 0.5)", 
        "rgba(255, 206, 86, 0.5)", 
        "rgba(75, 192, 192, 0.5)", 
        "rgba(153, 102, 255, 0.5)", 
        "rgba(255, 159, 64, 0.5)",
    ];

    const coresBorda = [
        "rgba(255, 99, 132, 1)", 
        "rgba(54, 162, 235, 1)", 
        "rgba(255, 206, 86, 1)", 
        "rgba(75, 192, 192, 1)", 
        "rgba(153, 102, 255, 1)", 
        "rgba(255, 159, 64, 1)",
    ];

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Quantidade de Incidências", // Ainda presente na legenda
                    data: valores,
                    backgroundColor: cores.slice(0, labels.length),
                    borderColor: coresBorda.slice(0, labels.length),
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false, // Esconde o título da legenda
                },
                tooltip: {
                    enabled: true,
                },
                datalabels: {
                    anchor: "end", // Ajusta a âncora do rótulo
                    align: "end", // Posiciona ao final (acima da barra)
                    formatter: (value) => value, // Mostra o valor diretamente
                    color: "black",
                    font: {
                        size: 14,
                        weight: "bold",
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(...valores) * 1.2, // Adiciona espaço no topo
                },
            },
        },
        plugins: [ChartDataLabels], // Adiciona o plugin
    });
}
