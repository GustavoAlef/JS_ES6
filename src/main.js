import api from "./api";

class App {
  constructor() {
    this.repositories = [];

    //ref para o evento do botao
    this.formElement = document.querySelector("#repo-form");

    //ref input
    this.inputElement = document.querySelector("input[name=repositorio]");

    //ref para a lista
    this.listElement = document.querySelector("#repo-list");

    this.registerHandlers();
  }

  registerHandlers() {
    //registra os eventos
    this.formElement.onsubmit = event => this.addRepo(event);
  }

  setLoading(loading = true){
      if(loading === true){
          let loadEl = document.createElement('span');
          loadEl.appendChild(document.createTextNode('Carregando'))
          loadEl.setAttribute('id', 'load');
          this.formElement.appendChild(loadEl);
      }else{
          document.getElementById('load').remove();
      }
  }

  async addRepo(event) {
    event.preventDefault(); //nao deixa o form ficar recarregando a pag
    const repoInput = this.inputElement.value;
    if (repoInput.length === 0) return;

    this.setLoading();

    try { //mostra msg de erro
      const response = await api.get(`/repos/${repoInput}`);

      const {name, description, html_url, owner: { avatar_url }} = response.data;

      this.repositories.push({
        name,
        description,
        avatar_url,
        html_url
      });

      this.inputElement.value = "";

      this.render();
    } catch (err) {
        this.inputElement.value = "";
        alert("repositorio inexistente.");
    }

    this.setLoading(false);
  }

  render() {
    //apaga a lista
    this.listElement.innerHTML = "";

    //percorre os repos, cria elementos e renderiza
    this.repositories.forEach(repo => {
      let imgEl = document.createElement("img");
      imgEl.setAttribute("src", repo.avatar_url);

      let titleEl = document.createElement("strong");
      titleEl.appendChild(document.createTextNode(repo.name));

      let descEl = document.createElement("p");
      descEl.appendChild(document.createTextNode(repo.description));

      let linkEl = document.createElement("a");
      linkEl.setAttribute("target", "_blank");
      linkEl.setAttribute("href", repo.html_url);
      linkEl.appendChild(document.createTextNode("Acessar"));

      let listItemEl = document.createElement("li");
      listItemEl.appendChild(imgEl);
      listItemEl.appendChild(titleEl);
      listItemEl.appendChild(descEl);
      listItemEl.appendChild(linkEl);

      this.listElement.appendChild(listItemEl);
    });
  }
}

new App();
