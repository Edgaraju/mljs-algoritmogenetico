/**
 * Classe que implementa o algoritmo Genetico
 */
function Genetico (opts) {
    var self = this;

    self.valorTipo = opts['valorTipo'];
    self.tipo = opts['tipo'];
    self.probMutacao = opts['probMutacao'];
    self.probCross = opts['probCross'];
    self.geneBusca = opts['geneBusca'];

    return self;
}

// Extendendo à classe Clusterer
// Genetico.prototype = new Clusterer();

/**
 * Método que implementa Genetico
 * @param  {Object} options - Objecto contendo as opções para o modelo na forma:
 */
Genetico.prototype.buildClusterer = function(options) {
    var self = this;
    var data = utils.clone(options['data']);
    //Define o tamanho da população.
    self.dl = data.length;
    //Define o tamanho do cromossomo/indivíduo.
    self.tamCromo = data[0].toString().length;

    function defineGenes() {
        var resul = [];
        var i = 0;
        for(var y = 0;y<self.dl;y++){
            var str = data[y].toString();
            for (var x=0;x<self.tamCromo;x++) {
                if(resul.indexOf(str.charAt(x))==-1) {
                    resul[i] = str[x];
                    i++;
                }
            }
        }
        return resul;  
    }

    // Define os parâmetros de configuração
    conf = {
        "tamCromo": self.tamCromo, // Tamanho do indivíduo
        "tamPop": self.dl, // Tamanho da população
        "dataTudo": data, // Toda a entrada
        "geneBusca": self.geneBusca, // Toda a entrada
        "probMutacao": self.probMutacao, // Probabilidade de Mutação
        "probCross": self.probCross, // Probabilidade de Cruzamento
        "genes": defineGenes(), // Lista todos os genes utilizados
        "isValid": new Functions().isValid, // Verifica indivíduo
        "fitnessFunction": new Functions().fitnessFunction, // Retorna o valor do fitness
        "iniciar": new Functions().iniciar, // Retorna a população inicial
        "avaliacao": new Functions().avaliar, // Retorna uma população de acordo com o valor do fitness
        "selecao": new Functions().rouletteWheelSelection, // Retorna os pais selecionados
        "crossover": new Functions().crossover, // Retorna indivíduos pós cruzamento
        "mutacao": new Functions().mutacao, // Retorna indivíduos pós mutação
        "evolucao": new Functions().evolucao // Retorna indivíduos de uma nova geração
    };

    // Nova instância do algoritmo genético
    var ga = new AlgoritmoGenetico(conf);
    ga.initialize();

    if(self.tipo == "PorGeracao")
        self.elemento = ga.simularPorGeracao(self.valorTipo);

    if(self.tipo == "PorFitness")
        self.elemento = ga.simularPorFitness(self.valorTipo);

    if(self.tipo == "PorTempo")
        self.elemento = ga.simularPorTempo(self.valorTipo);

    self.individuoMax = self.elemento.resulIndividuo();
    self.fitness = self.elemento.getFitness();

    return this;
};
