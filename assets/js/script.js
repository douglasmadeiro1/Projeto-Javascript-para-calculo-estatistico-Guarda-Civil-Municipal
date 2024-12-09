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
            "Parada / Permanência  Preventiva - ÁREA CENTRAL / Patrulhamento preventivo",
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
            "Parada / Permanência  Preventiva - Câmara Municipal  / Parada / Permanência  Preventiva ",
        ],
        Permanencia_cachoeira_de_emas: [
            "Parada / Permanência  Preventiva - CACHOEIRA DE EMAS",
        ],
        Permanencia_próprios_municipais: [
            "Parada / Permanência  Preventiva ",
            "parada / permanência preventiva - outros órgãos públicos",
        ],
        Permanencia_complexo_exportivo: [
            "Parada / Permanência  Preventiva - COMPLEXO ESPORTIVO",
        ],
        Atentado_ao_pudor: [
            "Ato obsceno",
        ],
        Apoio: [
            "Apoio",
            "Apoio a GM de Serviço",
        ],
        Apoio_ONGs: [
            "Apoio a ONGs",
            "Apoio a ONGs / Animal em via pública",
        ],
        Apoio_policia_militar_bombeiros: [
            "Apoio a Militar/Policial Militar/Bombeiro",
            "Apoio a Militar/Policial Militar/Bombeiro / Incêndio Área Rural",
        ],
        Apoio_SAMU: [
            "Apoio a Orgãos  de  Saúde , Santa Casa  - PS - UBS - UPA - CAPS",
            "Apoio Samu",
            "Apoio Samu / Averiguação Atitude Suspeita",
            "Apoio Samu / Surto psicótico - atendimento/encaminhamento",
            "Surto psicótico - atendimento/encaminhamento",
            "Surto psicótico - atendimento/encaminhamento / Apoio Samu",
        ],
        Apoio_conselho_tutelar: [
            "Apoio Conselho Tutelar",
            "Apoio Conselho Tutelar / Apoio",
        ],
        Abandono_de_incapaz: [
            "Abandono de incapaz / Apoio Conselho Tutelar",
            "Abandonar idoso em hospitais / Apoio a outros órgãos"
        ],
        Apoio_evento: [
            "Apoio/Monitoramento a eventos",
            "Apoio/Monitoramento a eventos / Acompanhamento - Manifestação pública",
            "Prevenção em festas / eventos diversos",
            "Acompanhamento - Manifestação Religiosa - Procissão",
            "Acompanhamento - manifestação pública - passeata",
        ],
        Apoio_outros_orgãos: [
            "Apoio a outros órgãos",
            "Apoio Órgãos Públicos",
            "Apoio Órgãos Privados",
            "Apoio a Casa de Acolhimento",
            "Apoio a Casa abrigo / Apoio Samu",
        ],
        Auxilio_ao_público: [
            "Auxílio ao público - Cidadão",         
        ],
        Atitude_suspeita: [
            "Abordagem a pessoas em atitude suspeita",
            "Averiguação / Outros",
            "Averiguação Atitude Suspeita",
            "Conduta Inconveniente",
            "Averiguação Atitude Suspeita / Abordagem a veículo",
            "Averiguação Atitude Suspeita / Averiguação / Outros",
        ],
        Apoio_policia_civil: [
            "Apoio a Policia Civil",
            "Preservação local para perícia",
        ],
        Apoio_DEMUTRAN: [
            "APOIO AO DEPARTAMENTO DE TRÂNSITO ",
            "Isolamento de Via",
            "Isolamento de Via / Cabos e fios caidos",
            "Óleo na via",
        ],
        Apoio_outras_secretarias: [
            "Apoio ao Setor de Educação",
        ],
        Apoio_oficial_de_justiça: [
            "Apoio Oficial de Justiça",
        ],
        Treinamentos: [
            "TREINAMENTO COM CÃES",
            "Instrução/Treinamento",
        ],
        Apoio_defesa_civil: [
            "Cabos e fios caidos",
            "Apoio a defesa civil",
            "Queda de Árvore",
        ],
        Cumprimento_mandado_de_prisão: [
            "Cumprimento de Mandado de Prisão",
            "Cumprimento de Mandado  Busca e Apreensão",
        ],
        Depredação: [
            "Dano/Depredação Patrimônio Público",
            "Depredação"
        ],
        Localização_de_pessoa_perdida: [
            "Localização de pessoa perdida",
        ],
        incendio: [
            "Incêndio em vegetação",
            "Incêndio",
        ],
        Disparo_de_arma_de_fogo: [
            "Disparo de arma de fogo",
        ],
        Desinteligencia: [
            "Desinteligência",
            "Desinteligência / Averiguação de Uso de Drogas",
        ],
        Furto: [
            "Averiguação de Furto",
            "Averiguação Atitude Suspeita / Localização de Veículo roubado/furtado/clonado",
            "Tentativa de furto",
            "Averiguação / Outros / Apropriação indébita",
            "Furto",
            "Furto / Averiguação de Furto",
            "Furto de veículo",
            "Localização de Veículo roubado/furtado/clonado / Apoio a Militar/Policial Militar/Bombeiro",
        ],
        Ocorrencia_com_drogas: [
            "Averiguação de Uso de Drogas",
            "Localização de drogas",
            "Tráfico de drogas",
            "Averiguação de Uso de Drogas / Tráfico de drogas",
            "Porte de drogas para consumo pessoal",
            "Porte de drogas para consumo pessoal / Conduzir veículo sem a devida CNH gerando perigo de dano",
            "Porte de drogas para consumo pessoal / Infração de trânsito / Denúncia",

        ],
        Invasão: [
            "Comunicação de invasão",
            "Invasão à proprio municipal - estadual",
            "Invasão à proprio municipal - estadual / Apoio a GM de Serviço",
            "Arrombamento",
        ],
        Escolta: [
            "Escolta",
        ],
        Captura_de_procurado: [
            "Recaptura de foragido",
            "Averiguação / Outros / Recaptura de foragido",
        ],
        Crime_eleitoral: [
            "AVERIGUAÇÃO DE CRIME ELEITORAL",
        ],
        Averiguação_alarme:[
            "Averiguação de Disparo de Alarme",
        ],
        Pessoa_desaparecida: [
            "Desaparecimento de pessoa",
        ],
        Descumprimento_de_medida_protetiva: [
            "Descumprimento de Ordem Judicial/Medida Protetiva / Averiguação / Outros",
            "Atendimento de Medida Protetiva",
            "Descumprimento de Ordem Judicial/Medida Protetiva",
        ],
        Encontro_de_cadaver: [
            "Encontro de cadáver",
        ],
        Fiscalização_de_posturas: [
            "Fiscalização de Posturas",
            "Perturbação do trabalho ou do sossego alheio",
            "Perturbação da tranquilidade",
            "Descarte irregular de resíduo",
            "Fiscalização de Posturas / Ordem de Serviço",
            "Fiscalização de Posturas / Perturbação da tranquilidade",
        ],
        Averiguação_ambiental: [
            "Averiguação Ambiental",
            "Pesca proibida",
        ],
        Agressão: [
            "Averiguação / Outros / Agressão",
            "Lesão corporal",
            "Lesão corporal / Ameaça",
            "Vias de fato",
            "Agressão",
        ],
        Ameaça: [
            "Ameaça",
            "Ameaça / Dano",
        ],
        Operação_saturação: [
            "Operação Saturação",
        ],
        Roubo: [
            "Roubo",
            "Averiguação de Roubo",
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
            "Averiguação de Veiculo / Embriaguez",
            "Direção perigosa de veículo em via pública",
            "Direção perigosa de veículo em via pública - motos",
            "Embriaguez / Direção perigosa de veículo em via pública",
            "Estacionar em rebaixo de meio-Fio destinado a entrada e saída de veículo automotor",
            "Infração de trânsito / Denúncia / Abordagem a pessoas em atitude suspeita",
            "Infração de trânsito / Denúncia / Acidente de trânsito sem vítima",
            "Infração de trânsito / Denúncia / Averiguação de Veiculo",
            "Infração de trânsito / Fiscalização e policiamento / Denúncia",
            "Veículo abandonado em via pública",
            "Conduzir veículo sem a devida CNH gerando perigo de dano",
            "Averiguação / Outros / Embriaguez",
            "Denúncia / Fiscalização e policiamento - tráfego / Infração de trânsito",
        ],
        Violência_doméstica: [
            "Violência doméstica",
            "Auxílio ao público - Cidadão / Violência Doméstica Contra a Mulher/Maria da Penha",
            "Violência Doméstica Contra a Mulher/Maria da Penha",
            "Ameaça Contra a Mulher",
            "Cárcere Privado Contra a Mulher / Apoio Conselho Tutelar",
            "Cárcere Privado Contra a Mulher / Desinteligência",
        ],
        Ocorrencia_com_animais: [
            "Maus-tratos a animais",
            "Ocorrência envolvendo animais",
            "Maus-tratos a animais",
            "Maus-tratos a animais / Apoio a ONGs",
            "Animal em via pública",
            "Animal com sinal de maus tratos",
            "Animal Solto em Local de Risco",
            "Averiguação Ambiental / Maus-tratos a animais",
            "Introdução ou abandono de animais em propriedade alheia",
        ],
        Porte_de_arma_branca: [
            "Porte de arma branca / Desacato / Porte de drogas para consumo pessoal",
            "Violência doméstica / Averiguação / Outros",
            "Localização de arma branca / Violência doméstica",
        ],
        Localização_de_veículo: [
            "Localização de veículo",
        ],
        Acampamento_em_local_proibido: [
            "ACAMPAMENTO EM ESPAÇO PÚBLICO",
            "Acampamento em local indevido",
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
        Ordem_de_serviço: [
            "Ordem de Serviço",
        ],
        Localização_de_arma_de_fogo: [
            "Localização de arma de fogo / Localização de objetos diversos",
        ],
        Localização_de_objetos: [
            "Localização de objetos diversos",
            "Localização de objetos diversos / Averiguação Atitude Suspeita",
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
