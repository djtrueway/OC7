class Restaurant {
    constructor(data){
      window[data.restaurantName] = this;
      this.DOM      = document.createElement('li');
      this.DOMstar = document.createElement("stars");
      this.DOMcomments = document.createElement("comments");
      this.name     = data.restaurantName;
      this.lat      = data.lat;
      this.long     = data.long;
      this.comments = dataManager.getEvaluation(this.name);

      if(dataManager.getEvaluation(this.name)){
        let score = 0;
        for (let index = 0; index < this.comments.length; index++) {
          score += this.comments[index].stars;
          console.log("--- avering "+ this.comments[index].stars)
        }
        this.avering = score / this.comments.length;
      }else{
        this.comments = [];
        this.avering = data.ratings[0].stars
        console.log('1 ___ data.rating '+ data.ratings[0].stars)
      }

      let method = data.restaurantName
      method = method.split(' ').join('_')
      method = method.split('&').join('_')
      method = method.split("'").join('_')
      method = method.split("-").join('_')
      this.id = method

      this.viewDetails = false;
      this.addMarker();
      this.initialRender();
      SimpleStarRating(this.DOMstar);

      this.DOMstar.addEventListener('rate', function (e) {
        console.log(e);

      if(this.userRating !== null) return;
      console.log("wxcwcwxc", e.detail)
      this.starClick(e)
      //this.addComment(e)
      this.DOMstar.innerHTML += this.renderAddComment(); 
      }.bind(this));

      this.userRating = null;

      window[this.id] = this;

      console.log(this.id)
    }

    initialRender(){
      if(this.avering >= 4){
        this.DOM.onclick = this.showHideRatings.bind(this);
        this.DOM.className = 'list-group-item';
        document.getElementsByTagName("ul")[0].appendChild(this.DOM);
        this.DOM.innerHTML = this.name;
        this.DOMstar.className="rating";
        // this.DOMstar.setAttribute("data-stars", 15);
        this.DOMstar.setAttribute("data-default-rating", this.avering);
        this.DOMstar.onclick = this.starClick;
        this.DOM.appendChild(this.DOMstar);
        this.DOM.appendChild(this.DOMcomments);

        console.log('___ data.rating '+this.avering)
      }
    }

    starClick(e){
      this.stars = e.detail
      return
    }


    makeStars(qty){
      let stars = "";
      for (let i=0; i<qty; i++) stars +="*";
      return stars;
    }

    renderComment() {
      let content = "";
      if (this.viewDetails ){
        content +=`
        <ul>${this.renderRatings()}</ul>
      `;
      }
      this.DOMcomments.innerHTML =  content;
    }

    addComment(){
      
      const stars = this.stars
      const comment = document.querySelector(`#${this.id}Comment`).value;
      if(comment === ''){
        alert('SVP AJOUTE UN COMMENNTAIRE')
        return
      }      
      let rates = {
        "stars": stars,
        "comment": comment
      }
      console.log("----",this.comments);
      this.comments.push(rates)
      dataManager.addComment(this.name, rates);

      this.renderComment()
      document.querySelector(`#${this.id}Comment`).value = '';
      this.stars = '';
      return ;
    }

    renderAddComment(){
      return  `
          <div onclick="event.stopPropagation();">
          <input name="commentaires" class='form-control form-control-sm' id='${this.id}Comment' placeholder="ajouter un commentaire">
          </div>
          <button class='btn btn-sm btn-primary mt-1' onclick="event.stopPropagation();window.${this.id}.addComment() ">ajoute un commentaire</button>
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
      this.renderComment();
    }

    addMarker ( ){
      var marker = L.marker([this.lat, this.long]).addTo(mymap).on('click', (e) =>{
         // alert('make ajax request to the api')
          window.addGoogleStreetView(this.lat, this.long)
      });
      let msg = '<b>'+ this.name + '<b>'+'<br><br>'
      marker.bindPopup(msg);
    }
  }