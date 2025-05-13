window.addEventListener('DOMContentLoaded', (event) => {
    const cabecalho = document.getElementById('meu-cabecalho'); // MUDE PARA O ID/SELETOR DO SEU HEADER
    const conteudoPrincipal = document.querySelector('main') || document.body; // AJUSTE SE NECESSÁRIO

    console.log(`conteudoPrincipal: ${conteudoPrincipal} `);

    if (cabecalho) {
        const offsetTopOriginalCabecalho = cabecalho.offsetTop; // Posição original do cabeçalho
        const alturaCabecalho = cabecalho.offsetHeight;
        let ultimaPosicaoScroll = 0; // Para rastrear a direção da rolagem
        const delta = 5; // Pequena tolerância para evitar "flickering"

        console.log(`offsetTopOriginalCabecalho: ${offsetTopOriginalCabecalho}, alturaCabecalho: ${alturaCabecalho}, ultimaPosicaoScroll:  ${ultimaPosicaoScroll}`)

        function handleSmartHeader() {
            let posicaoScrollAtual = window.pageYOffset || document.documentElement.scrollTop;

            // CASO 1: Scroll está ACIMA da posição original do cabeçalho
            // O cabeçalho deve estar em seu estado normal, não fixo.
            if (posicaoScrollAtual <= offsetTopOriginalCabecalho) {
                if (cabecalho.classList.contains('fixo')) {
                    cabecalho.classList.remove('fixo');
                    conteudoPrincipal.style.paddingTop = '0';
                }
                // Garante que não esteja escondido se não estiver fixo
                cabecalho.classList.remove('cabecalho-escondido');
                // Atualiza a última posição para a próxima verificação
                ultimaPosicaoScroll = posicaoScrollAtual <= 0 ? 0 : posicaoScrollAtual;
                return; // Sai da função aqui, pois não precisamos da lógica de mostrar/esconder
            }

            // CASO 2: Scroll está ABAIXO da posição original do cabeçalho
            // O cabeçalho deve se tornar fixo.
            if (!cabecalho.classList.contains('fixo')) {
                cabecalho.classList.add('fixo');
                conteudoPrincipal.style.paddingTop = alturaCabecalho + 'px';
            }

            // Verifica se o scroll foi significativo (maior que delta) para evitar flickering
            if (Math.abs(ultimaPosicaoScroll - posicaoScrollAtual) <= delta) {
                // Atualiza a última posição mesmo se o scroll for pequeno, para a próxima comparação
                // mas não muda o estado do cabeçalho ainda.
                // No entanto, para evitar que fique preso no estado escondido se o usuário parar de rolar
                // logo após esconder, podemos forçar a atualização da última posição aqui:
                ultimaPosicaoScroll = posicaoScrollAtual;
                return;
            }

            console.log(`Scroll para baixo ou para cima: posicaoScrollAtual > ultimaPosicaoScroll, onde posicaoScrollAtual: ${posicaoScrollAtual}, ultimaPosicaoScroll: ${ultimaPosicaoScroll}`);
            
            // Determina a direção do scroll
            if (posicaoScrollAtual > ultimaPosicaoScroll) {
                // Scroll PARA BAIXO: esconder o cabeçalho
                cabecalho.classList.add('cabecalho-escondido');
            } else {
                // Scroll PARA CIMA: mostrar o cabeçalho
                cabecalho.classList.remove('cabecalho-escondido');
            }

            // Atualiza a última posição de scroll para a próxima vez
            ultimaPosicaoScroll = posicaoScrollAtual <= 0 ? 0 : posicaoScrollAtual;
        }

        window.addEventListener('scroll', handleSmartHeader, false);
        handleSmartHeader(); // Chama uma vez no carregamento para definir o estado inicial
    }
});