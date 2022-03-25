const ballonHTML = `
<header class="header">
  <h3 class="title"></h3>
</header>
<main class="content">
  <article class="descriptions">
  </article>
</main>
<footer class="footer">
  <section class="pagination">
  </section>
  <section class="actions">
  </section>
</footer>

`;

export class Tour {
  constructor(selectorRoot) {
    this.selectorRoot = selectorRoot;
    this.window = window;
    this.document = document;
    this.steps = []
    this.currentStep = null;
  }

  start() {
    this.steps = [
      {
        selector: "#step1",
        ballonDef: {
          title: "Livro de Ofertas",
          descriptions: [
            {
              value:
                "Todas as ofertas de Compra e Venda da moeda estão aqui. As ordens criadas ficam disponíveis em nosso Livro de Ofertas até que outra oferta correspondente seja encontrada para que ambas sejam executadas.",
            },
            {
              value:
                "Spread é o valor que está destacado entre as informações do Livro de Ofertas. Ele representa a diferença entre o maior preço de compra e o menor preço de venda.",
            },
            { value: "Quer saber mais? " },
            { value: "Click aqui", isInline: true, isLink: true },
          ]
        },
      },
      {
        selector: "#step2",
        ballonDef: {
          title: "Pares e Ticker",
          descriptions: [
            {
              value:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            },
          ]
        },
      },
      {
        selector: "#step3",
        ballonDef: {
          title: "Pares e Ticker Tedsdapsodiapsoidpq",
          descriptions: [
            {
              value:
                "Teste",
            },
          ]
        },
      }
    ]

    this.next()
  }

  highlight(step, index, length) {
    /** @type {HTMLElement} */
    const element = this.document.querySelector(step.selector);

    if (element) {
      this.createOverlay();

      element.classList.add("mb-tour");
      element.classList.add("current-step");

      this.createBalon(element, step.ballonDef, index, length);
    }
  }

  /**
   *
   *
   * @param {*} element
   * @param {*} ballonDef
   * @param {*} index
   * @param {*} length
   */
  createBalon(element, ballonDef, index, length) {
    this.getOffset(element);
    const { ballon, arrowBallon } = this.mountBallon();

    this.mountContent(ballon, ballonDef);
    this.mountHeader(ballon, ballonDef);
    this.mountFooter(ballon, ballonDef, index, length);

    element.appendChild(arrowBallon);
    element.appendChild(ballon);
  }

  mountFooter(ballon, ballonDef, index, length) {
    const paginationSection = ballon.querySelector('.pagination');

    const legStep = this.document.createElement('p');
    legStep.classList.add('text');
    legStep.textContent = `${index+1}/${length}`;
    paginationSection.appendChild(legStep);

    const paginationActions = ballon.querySelector('.actions');
    
    if (ballonDef.previousBtn) {
      const btnPrevious = this.document.createElement('button');
      btnPrevious.innerText = ballonDef.previousBtn.label;
      btnPrevious.classList.add('btn');
      btnPrevious.addEventListener('click', () => ballonDef.btnPrevious.customAction(this));
      paginationActions.appendChild(btnPrevious);
    } else if(index !== 0) {
      const btnPrevious = this.document.createElement('button');
      btnPrevious.innerText = 'Voltar';
      btnPrevious.classList.add('btn');
      btnPrevious.addEventListener('click', () => this.previous());
      paginationActions.appendChild(btnPrevious);
    }  

    const btnNext = this.document.createElement('button');
    if (ballonDef.nextBtn) {
      btnNext.innerText = ballonDef.nextBtn.label;
      btnNext.classList.add('btn');
      btnNext.addEventListener('click', () => ballonDef.nextBtn.customAction(this));
    } else {
      btnNext.innerText = (index + 1) >= length ? 'Finalizar' : 'Próximo';
      btnNext.classList.add('btn');
      btnNext.addEventListener('click', () => this.next());
    }
    btnNext && paginationActions.appendChild(btnNext);
  }

  /**
   * @private
   */
  next() {
    const currentElement = this.document.querySelectorAll('.mb-tour-step')
    const highlightElement = this.document.querySelectorAll('.mb-tour.current-step')
    highlightElement.forEach(element => element.classList.remove('current-step'))
    currentElement.forEach(element => element.remove())

    if (this.currentStep) {
      if ((this.currentStep.index + 1) >= this.steps.length) {
        const tour = this.document.querySelectorAll('.mb-tour.overlay')
        const currentElement = this.document.querySelectorAll('.mb-tour.current-step')
        currentElement.forEach(element => element.classList.remove('current-step'))
        tour.forEach(element => element.remove())
        const currentBallon = this.document.querySelectorAll('.mb-tour-step.ballon,.mb-tour-step.arrow-ballon')
        currentBallon.forEach(element => element.remove())
      } else {
        this.currentStep.index++
        this.currentStep.source = this.steps[this.currentStep.index];
        this.highlight(this.currentStep.source, this.currentStep.index, this.steps.length)
      }
    } else {
      this.currentStep = {
        index: 0,
        source: this.steps[0]
      }
      this.highlight(this.currentStep.source, this.currentStep.index, this.steps.length)
    }
  }

  /**
   * @private
   */
   previous() {
    const currentElement = this.document.querySelectorAll('.mb-tour-step')
    const highlightElement = this.document.querySelectorAll('.mb-tour.current-step')
    highlightElement.forEach(element => element.classList.remove('current-step'))
    currentElement.forEach(element => element.remove())

    if (this.currentStep) {
      if (this.currentStep.index > 0) {
        this.currentStep.index--
        this.currentStep.source =  this.steps[this.currentStep.index];
        this.highlight(this.currentStep.source, this.currentStep.index, this.steps.length)
      }
    }
  }

  /**
   * @param {*} ballon
   * @param {*} ballonDef
   * @private
   */
  mountHeader(ballon, ballonDef) {
    const title = ballon.querySelector('.title');
    title.innerText = ballonDef.title;
  }

  mountContent(ballon, ballonDef) {
    const description = ballon.querySelector(".descriptions");
    ballonDef.descriptions.forEach(desc => {
      if (desc.isInline) {
        let descNode = this.document.createElement("span");

        if (desc.isLink) {
          descNode.classList.add('link');
        }

        descNode.innerText = desc.value;
        description.lastChild.appendChild(descNode);
      } else {
        let descNode = this.document.createElement("p");
        descNode.classList.add('text');
        descNode.innerText = desc.value;
        description.appendChild(descNode);
      }
    });
  }

  /**
   * @private
   * @return {{ ballon: HTMLElement, arrowBallon: HTMLElement}} 
   */
  mountBallon() {
    const arrowBallon = this.document.createElement("div");
    const ballon = this.document.createElement("div");

    arrowBallon.classList.add("mb-tour-step");
    arrowBallon.classList.add("arrow-ballon");

    ballon.classList.add("mb-tour-step");
    ballon.classList.add("ballon");
    ballon.innerHTML = ballonHTML;
    return { ballon, arrowBallon };
  }

  getOffset(element) {
    const x = element.offsetLeft - element.scrollLeft;
    const y = element.offsetTop - element.scrollTop;
    const elRect = element.getBoundingClientRect();
    return {
      x: +x > +elRect.x ? elRect.x : x,
      y: +y > +elRect.y ? elRect.y : y,
    };
  }

  /**
   * @private
   */
  createOverlay() {
    /** @type {HTMLDivElement} */
    let overlay = this.document.querySelector("div.mb-tour.overlay");

    if (!overlay) {
      overlay = this.document.createElement("div");
      let root = this.getRoot();
  
      if (root) {
        overlay.classList.add("mb-tour");
        overlay.classList.add("overlay");
  
        root.appendChild(overlay);
      }
    }
  }

  /**
   * @return {HTMLElement}
   * @private
   */
  getRoot() {
    let root;
    if (this.selectorRoot) {
      root = this.document.querySelector(this.selectorRoot);
    } else {
      root = this.document.body;
    }
    return root;
  }
}
