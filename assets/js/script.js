document.getElementById("processFile").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");  // Aqui, pegamos o elemento input
    const file = fileInput?.files[0];  // Aqui pegamos o arquivo selecionado (o primeiro arquivo, caso haja múltiplos)

    const spinner = document.getElementById("spinner");
    spinner.style.display = "block"; // Mostra o spinner
    setTimeout(() => spinner.style.display = "none", 1500);

    if (!file) {
        alert("Por favor, selecione um arquivo");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = e.target.result;
    
        if (file.name.endsWith(".xlsx")) {
            processExcel(data); // XLSX usa ArrayBuffer
        } else if (file.name.endsWith(".xls")) {
            processExcel(data, true); // XLS usa BinaryString
        } else if (file.name.endsWith(".csv")) {
            processCSV(data);
        } else {
            alert("Formato de arquivo não suportado.");
        }
    };
    
    // Use o método adequado para cada tipo de arquivo
    if (file.name.endsWith(".xls")) {
        reader.readAsBinaryString(file); // XLS requer BinaryString
    } else {
        reader.readAsArrayBuffer(file); // Outros formatos podem usar ArrayBuffer
    };

    // Usando readAsArrayBuffer, que é a forma recomendada
    reader.readAsArrayBuffer(file);  // Aqui passamos o arquivo como argumento
});

function processCSV(data) {
    Papa.parse(data, {
        header: false, // Ler como matriz
        complete: (results) => {
            const planilha = results.data;
            console.log("Dados CSV processados:", planilha);
            gerarEstatisticas(planilha);
        },
    });
}

function processExcel(data, isXLS = false) {
    const XLSX = window.XLSX;

    const options = isXLS ? { type: "binary" } : { type: "array" };

    const workbook = XLSX.read(data, options);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Obter os dados como uma matriz 2D
    gerarEstatisticas(jsonData);
}
function gerarEstatisticas(planilha) {
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
        Permanencia_próprios_municipais: [
            "Parada / Permanência  Preventiva ",
            "parada / permanência preventiva - outros órgãos públicos",
        ],
        Apoio: [
            "Apoio",
        ],
        Apoio_ONGs: [
            "Apoio a ONGs",
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
        Descumprimento_de_medida_protetiva: [
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
            "Acidente de trânsito sem vítima",
            "Averiguação de Veiculo",
            "Averiguação de Veiculo / Acidente de trânsito com vítima",
            "Denúncia / Infração de trânsito",
            "Denúncia / Infração de trânsito / Fiscalização e policiamento - tráfego",
            "Embriaguez / Averiguação / Outros",
            "Fiscalização e policiamento - tráfego",
            "Fiscalização e policiamento - tráfego / Infração de trânsito / Denúncia",
            "Infração de trânsito / Denúncia",
            "Infração de trânsito / Denúncia / Porte de drogas para consumo pessoal",
            "Infração de trânsito / Embriaguez / Denúncia",
            "Remoção de veículo",
        ],
        Violência_doméstica: [
            "Violência doméstica",
        ],
        Ocorrencia_com_animais: [
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
        Serviço_administrativo: [
            "Deslocamento Administrativo",
        ],
        Patrulhamento_em_próprios_públicos: [
            "Patrulhamento preventivo",
            "Parada / Permanência  Preventiva - OUTROS ORGÃOS PUBLICOS",
        ],
    };

    const contagem = {};

    for (const linha of planilha) {
        for (const celula of linha) {
            if (!celula) continue; // Ignorar células vazias

            let categorizada = false;
            const textoNormalizado = celula.toString().toLowerCase().trim();

            for (const [categoria, palavrasChave] of Object.entries(categorias)) {
                if (palavrasChave.some((palavra) => celula.trim() === palavra.trim())) {
                    contagem[categoria] = (contagem[categoria] || 0) + 1;
                    categorizada = true;
                    break;
                }
            }

            /* if (!categorizada) {
                contagem["Outros"] = (contagem["Outros"] || 0) + 1;
            }
                */

        }
    }

    console.log("Contagem de Categorias:", contagem);
    exibirGrafico(contagem);
}

function processCSV(data) {
    Papa.parse(data, {
        header: false, // Ler como matriz
        complete: (results) => {
            const planilha = results.data;
            console.log("Dados CSV processados:", planilha);
            gerarEstatisticas(planilha);
        },
    });
}


function exibirGrafico(dados) {
    const ctx = document.getElementById("naturezaChart").getContext("2d");

    // Verificar se já existe um gráfico e destruí-lo antes de criar um novo
    if (window.chartInstance) {
        window.chartInstance.destroy(); // Destrói o gráfico existente
    }

    // Ordenar os dados em ordem decrescente
    const dadosOrdenados = Object.entries(dados).sort((a, b) => b[1] - a[1]); // Maior para menor
    const labels = dadosOrdenados.map(([key]) => key);
    const valores = dadosOrdenados.map(([_, value]) => value);

    const totalIncidencias = valores.reduce((a, b) => a + b, 0);

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

    // Criar um novo gráfico com animação suave
    window.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Quantidade de Incidências", 
                    data: valores,
                    backgroundColor: cores.slice(0, labels.length),
                    borderColor: coresBorda.slice(0, labels.length),
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 800, // Duração da animação em milissegundos
                easing: "linear", // Tipo de suavização (pode ser easeOutQuad, easeInOutQuad, etc.)
                onComplete: function () {
                    // O que acontece quando a animação termina (opcional)
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: true,
                },
                title: {
                    display: true,
                    text: `Distribuição de Incidências - Total: ${totalIncidencias}`, // Título com o total
                    font: {
                        size: 18,
                        weight: "bold",
                    },
                },
                datalabels: {
                    anchor: "end",
                    align: "end",
                    formatter: (value) => value,
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
                    max: Math.max(...valores) * 1.2, 
                },
            },
        },
        plugins: [ChartDataLabels], 
    });
    
    const canvas = document.getElementById("naturezaChart");
    canvas.style.width = "100%";
    canvas.style.height = "auto";
}
