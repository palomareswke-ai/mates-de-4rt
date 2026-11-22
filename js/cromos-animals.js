"use strict";

window.CROMOS_ANIMALS = (function () {
  const CARATEULES = {
    mamifers: 'https://st.perplexity.ai/estatic/0b226c450798410ac541646c86ec31afd840e5beab817a5d84fa821e7db61981ec84c3b4a3f072a7a2e1899c9fb06c6e606001c2a3c1e768c5ea9fb181e51b20ea99a60f05d8ca32c037cf87121858999abe414f438d43f20fc2973cf74dedac0959cf1e4c9f00da2ff00599b598a23a',
    aus: 'https://st.perplexity.ai/estatic/0b226c450798410ac541646c86ec31afd840e5beab817a5d84fa821e7db61981ec84c3b4a3f072a7a2e1899c9fb06c6e11384cca95cf5dbfe94a75212d3d4ef32f8986e8380e70cd7392b6407f9508f6ba415df677fc8d9d2818a21fd0398d43f20fc2973cf74dedac0959cf1e4c9f00da2ff00599b598a23a',
    reptils: 'https://st.perplexity.ai/estatic/0b226c450798410ac541646c86ec31afd840e5beab817a5d84fa821e7db61981ec84c3b4a3f072a7a2e1899c9fb06c6eb1794b1470e4ad34fdee628db1fa8cfdb5288b4a02e2b5078d8e85d1e4555100dc48b7dbe3928e6b39263ea29a2ca2305fdaa4b03a31c0d37b511c4a23567e2453bfe44e2b6497a5e3406767a479c1eee8464',
    aquatics: 'https://st.perplexity.ai/estatic/0b226c450798410ac541646c86ec31afd840e5beab817a5d84fa821e7db61981ec84c3b4a3f072a7a2e1899c9fb06c6e98bbb9d1997811c037c188cc97db4d087159d323211e77457ffa9c460d6fa6c07063df388b24813e2de30f85f30054e41d4e710bd1339fa6b70a1af2dd77e327',
    insectes: 'https://st.perplexity.ai/estatic/0b226c450798410ac541646c86ec31afd840e5beab817a5d84fa821e7db61981ec84c3b4a3f072a7a2e1899c9fb06c6ed765d3e2e42b33100690faf2c6f5f7f26b53fefbe7b132bdf00e7fa210d22d1ad20f7430ea01092cccec5fe0a6a637832f97df9a09287725e93f94cc76cca30f'
  };

  const CATEGORIES = [
    { id: 'mamifers', nom: 'Mamífers terrestres', imatge: CARATEULES.mamifers },
    { id: 'aus', nom: 'Aus', imatge: CARATEULES.aus },
    { id: 'reptils', nom: 'Rèptils i amfibis', imatge: CARATEULES.reptils },
    { id: 'aquatics', nom: 'Animals aquàtics', imatge: CARATEULES.aquatics },
    { id: 'insectes', nom: 'Insectes i invertebrats', imatge: CARATEULES.insectes }
  ];

  const CROMOS = [];
  let id = 1;

  CATEGORIES.forEach(categoria => {
    for (let numero = 1; numero <= 50; numero++) {
      CROMOS.push({
        id,
        categoria: categoria.id,
        numero,
        nom: null,
        imatge: null
      });
      id++;
    }
  });

  return { CATEGORIES, CROMOS, CARATEULES };
})();