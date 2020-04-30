class Restaurant {
    constructor(data){
      this.DOM      = document.createElement('li');
      this.name     = data.restaurantName;
      this.lat      = data.lat;
      this.long     = data.long;
      this.comments = data.ratings;
      // this.avering;
      this.average();

      this.viewDetails = false;

      this.DOM.onclick = this.showHideRatings.bind(this);
      this.DOM.className = 'list-group-item';
      document.getElementsByTagName("ul")[0].appendChild(this.DOM)
      this.render();
    }

    average(){
      let score = 0;
      for (let index = 0; index < this.comments.length; index++) {
        score += this.comments[index].stars;        
      }
      this.avering = score / this.comments.length;
    }

    makeStars(qty){
      return `[${qty}]`;
    }
  
    render() {
      let content = `name ${this.name} --- ${this.makeStars(this.avering)}`
      if (this.viewDetails) content +=`
        <ul>${this.renderRatings()}</ul>
        ${this.renderAddComment()}
      `;
      this.DOM.innerHTML =  content;
    }

    renderAddComment(){
      return `
        <form onsubmit="">
          <input name="commentaires" value="" placeholder="ajouter un commentaire">
          <input name="stars" value="1" >
        </form>
        `;
    }

    renderRatings(){
      let content = "";
      for (let i=0; i< this.comments.length; i++){
        content += `<li>${this.makeStars(this.comments[i].stars)} ${this.comments[i].comment}</li>`;
      }
      return content;
    }

    showHideRatings(){
      this.updateState("viewDetails", !this.viewDetails);
    }

    updateState(key, value){
      this[key] = value;
      this.render();
    }
  }