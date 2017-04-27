function Individuo(id, cromossomo, fitness) {
    this.id = id;
    this.cromossomo = cromossomo;
    this.fitness = fitness;
    this.probability = 0;
    this.getId = function () {
        return this.id;
    }

    this.getCromossomo = function () {
        return this.cromossomo.slice();
    }

    this.getFitness = function () {
        return this.fitness;
    }

    this.getProbability = function () {
        return this.probability;
    }

    this.setId = function (id) {
        this.id = id;
    }

    this.setCromossomo = function (cromossomo) {
        this.cromossomo = cromossomo.slice();
    }

    this.setFitness = function (fitness) {
        this.fitness = fitness;
    }

    this.setProbability = function (probability) {
        this.probability = probability;
    }

    this.setGen = function (posicao, gen) {
        this.cromossomo[posicao] = gen.slice();
    }

    this.getGen = function (posicao) {
        return this.cromossomo[posicao].slice();
    }

    this.resulIndividuo = function () {
        var result = "";
        for (var i = 0; i < this.cromossomo.length; i++) {
            result += this.cromossomo[i] + " ";
        }
        return result;
    }

};


function Functions() {
    that = this;
    this.iniciar = function (size, tamCromo, genes) {

        var populacao = [];
        var auxCromossomo = [];

        for (var i = 0; i < self.tamPopulacao; i++) {
            populacao[i] = new Individuo(i, self.dataTudo[i].toString(), 0);
        }

        return populacao;
    }

    this.isValid = function (cromossomo) {
        return true;
    }

    this.fitnessFunction = function (individuo) {
        var fitness = 0;
        for (var i = 0; i < individuo.getCromossomo().length; i++) {
            if (individuo.getCromossomo()[i].localeCompare(self.geneBusca) == 0) {
                fitness++;
            }

        }
        return fitness;
    }

    this.avaliar = function (populacao) {
        var populacaoFitness = [];
        populacaoFitness = clonePopulacao(populacao);
        for (var i = 0; i < populacaoFitness.length; i++) {
            populacaoFitness[i].setFitness(this.fitnessFunction(populacaoFitness[i]));
        }
        return populacaoFitness;
    }

    this.rouletteWheelSelection = function (populacao) {
        var probPopulacao = [];
        var parents = [];
        probPopulacao = clonePopulacao(populacao);
        sumFitness = 0;

        for (var i = 0; i < probPopulacao.length; i++) {
            sumFitness += probPopulacao[i].getFitness();
        }
        for (var i = 0; i < probPopulacao.length; i++) {
            probPopulacao[i].setProbability(probPopulacao[i].getFitness() / sumFitness);
        }

        probPopulacao.sort(function (a, b) {
            return a.getProbability() - b.getProbability();
        });

        for (var i = 1; i < probPopulacao.length; i++) {
            probPopulacao[i].setProbability(probPopulacao[i].getProbability() + probPopulacao[i - 1].getProbability());
        }

        for (var i = 0; i < probPopulacao.length; i++) {
            var rand = Math.random();
            for (var j = 0; j < probPopulacao.length; j++) {
                if (rand <= probPopulacao[j].getProbability()) {
                    parents[i] = new Individuo(probPopulacao[j].getId(), probPopulacao[j].getCromossomo(), probPopulacao[j].getFitness());
                    break;
                }
            }
        }
        return parents;
    }

    this.crossover = function (parents, populacao, probab, genes) { 
        var filho = [];
        var auxPopulacao = clonePopulacao(populacao);
        var primeiroIndividuo = Math.floor(parents.length * (100 - probab) / 100);

        function mating(individuo1, individuo2) {
            var childCromossomo = [];
            var i = 0;

            while (i < individuo1.getCromossomo().length / 2) {
                childCromossomo[i] = individuo1.getCromossomo()[i];
                i++;
            }

            while (i < individuo2.getCromossomo().length) {
                childCromossomo[i] = individuo2.getCromossomo()[i];
                i++;
            }
            return childCromossomo;
        }

        auxPopulacao.sort(function (a, b) {
            return b.getFitness() - a.getFitness();
        });

        for (var i = 0; i < primeiroIndividuo; i++) {
            filho[i] = cloneIndividuo(auxPopulacao[i]);
        }

        for (var i = primeiroIndividuo; i < parents.length - 1; i++) {
            filho[i] = new Individuo(i, mating(parents[i], parents[i + 1]), 0);
        }

        filho[i] = new Individuo(i, mating(parents[parents.length - 1], parents[0]), 0);

        return filho;
    }

    this.mutacao = function (filho, probab, genes) { 
        var filhoMutado = [];
        filhoMutado = clonePopulacao(filho);
        for (var i = 0; i < filhoMutado.length; i++) {
            if (Math.random() < (probab / 100)) {
                var posMutation = Math.round(Math.random() * (filhoMutado[i].getCromossomo().length - 1));
                do {
                    var gen = genes[Math.round(Math.random() * (genes.length - 1))];
                } while (gen.localeCompare(filhoMutado[i].getCromossomo()[posMutation]) == 0);
                filhoMutado[i].setGen(posMutation, gen);
            }
        }
        return filhoMutado;
    }

    this.evolucao = function (filhoMutado) {
        var proxPopulacao = [];
        proxPopulacao = clonePopulacao(filhoMutado);
        return proxPopulacao;
    }

    function cloneIndividuo(individuo) {
        var copia = new Individuo(individuo.getId(), individuo.getCromossomo(), individuo.getFitness());
        copia.setProbability(individuo.getProbability());
        return copia;
    }

    function clonePopulacao(populacao) {
        var copia = [];
        for (var i = 0; i < populacao.length; i++) {
            copia[i] = cloneIndividuo(populacao[i]);
        }
        return copia;
    }


}

function AlgoritmoGenetico(confs) {
    that = this;
    this.populacao = [];
    this.parents = [];
    this.filho = [];
    this.melhor = Object;
    this.geracao = 0;
    this.iniciar = confs.iniciar;
    this.isValid = confs.isValid;
    this.fitnessFunction = confs.fitnessFunction;
    this.avaliar = confs.avaliacao;
    this.selecao = confs.selecao;
    this.crossover = confs.crossover;
    this.mutacao = confs.mutacao;
    this.evolucao = confs.evolucao;
    self.tamPopulacao = confs.tamPop;
    self.dataTudo = confs.dataTudo;
    self.geneBusca = confs.geneBusca;
    this.initialize = function () {
        that.setPopulacao(that.iniciar(confs.tamPop, confs.tamCromo, confs.genes));
    }

    this.simularGeracao = function () {
        if (that.getPopulacao().length == 0) {
            console.log("População sem indivíduos.");
        } else {
            that.setPopulacao(that.avaliar(that.getPopulacao())); // Populacao é avaliada.
            that.setParents(that.selecao(that.getPopulacao())); // Escolhe individuos para reproduzir.
            that.setFilho(that.crossover(that.getParents(), that.getPopulacao(), confs.probCross,confs.genes)); // São criados os filhos após o cruzamento.
            that.setPopulacao(that.getFilho()); // Os filhos são setados na população.
            that.setPopulacao(that.mutacao(that.getPopulacao(), confs.probMutacao, confs.genes)); // Ocorre a mutação.
            that.setPopulacao(that.evolucao(that.getPopulacao())); // Os indivíduos são atualizados.
            that.setPopulacao(that.avaliar(that.getPopulacao())); // Novos indivíduos são avaliados.
            that.setGeracao(that.getGeracao() + 1); // Incrementa o número da geração.
            that.setMelhor((that.melhorIndividuo(that.getPopulacao()))); // O melhor individuo da geração é escolhido.
        }
    }

    this.simularPorGeracao = function (maxGeracao) {
        while (that.getGeracao() < maxGeracao) {
            that.simularGeracao();
        }
        return that.getMelhor();
    }

    this.simularPorTempo = function (maxTempo) {
        var startT = new Date().getTime();
        var finalT = new Date().getTime();
        var tempoSimulacao = 0;
        while (tempoSimulacao < maxTempo) {
            that.simularGeracao();
            finalT = new Date().getTime();
            tempoSimulacao = finalT - startT;
        }
        return that.getMelhor();
    }

    this.simularPorFitness = function (maxFitness) {
        that.simularGeracao();
        while (that.getMelhor().getFitness() < maxFitness) {
            that.simularGeracao();
        }
        return that.getMelhor();
    }

    this.melhorIndividuo = function (populacaoWithFitness) {
        var melhor = Object;
        var auxPopulacao = [];
        function primeiroValid(populacao) {
            var primeiro = Object;
            var oneValid = false;
            for (var i = 0; i < populacao.length; i++) {
                if (that.isValid(populacao[i])) {
                    oneValid = true;
                    primeiro = that.cloneIndividuo(populacao[i]);
                    break;
                }
            }
            if (!oneValid) {
               console.log("Esse individuo não é válido!");
            }
            return primeiro;
        }
        auxPopulacao = this.clonePopulacao(populacaoWithFitness);
        auxPopulacao = this.avaliar(auxPopulacao);
        melhor = this.cloneIndividuo(primeiroValid(auxPopulacao));
        for (var i = 0; i < auxPopulacao.length; i++) {
            if (this.isValid(auxPopulacao[i]) && auxPopulacao[i].getFitness() > melhor.getFitness()) {
                melhor = this.cloneIndividuo(auxPopulacao[i]);
            }
        }
        return melhor;
    }

    this.cloneIndividuo = function (individuo) {
        var copia = new Individuo(individuo.getId(), individuo.getCromossomo(), individuo.getFitness());
        copia.setProbability(individuo.getProbability());
        return copia;
    }

    this.clonePopulacao = function (populacao) {
        var copia = [];
        for (var i = 0; i < populacao.length; i++) {
            copia[i] = this.cloneIndividuo(populacao[i]);
        }
        return copia;
    }

    this.getPopulacao = function () {
        var populacaoCopia = this.clonePopulacao(this.populacao);
        return populacaoCopia;
    }

    this.getParents = function () {
        var parentsCopia = this.clonePopulacao(this.parents);
        return parentsCopia;
    }

    this.getFilho = function () {
        var filhoCopia = this.clonePopulacao(this.filho);
        return filhoCopia;
    }

    this.getMelhor = function () {
        var melhorCopia = this.cloneIndividuo(this.melhor);
        return melhorCopia;
    }

    this.getGeracao = function () {
        return this.geracao;
    }

    this.setPopulacao = function (populacao) {
        var populacaoCopia = this.clonePopulacao(populacao);
        this.populacao = populacaoCopia;
    }

    this.setParents = function (parents) {
        var parentsCopia = this.clonePopulacao(parents);
        this.parents = parentsCopia;
    }

    this.setFilho = function (filho) {
        var filhoCopia = this.clonePopulacao(filho);
        this.filho = filhoCopia;
    }

    this.setMelhor = function (melhor) {
        var melhorCopia = this.cloneIndividuo(melhor);
        this.melhor = melhorCopia;
    }

    this.setGeracao = function (geracao) {
        this.geracao = geracao;
    }
}