class Restaurant {
    constructor(data){
      window[data.restaurantName] = this;
      this.DOM      = document.createElement('li');
      this.DOMstar = document.createElement("stars");
      this.DOMcomments = document.createElement("comments");
      this.name     = data.restaurantName;
      this.lat      = data.lat;
      this.long     = data.long;
      // var dataComments = sessionStorage.getItem(`comment-${this.name}`);
      // console.log(dataComments)
      // if(dataComments === null){
      //   console.log('fff1')
      //   this.comments = data.ratings;
      //   dataComments = sessionStorage.setItem(`comment-${this.name}`, JSON.stringify(data.ratings));
      // }else{
      //   console.log('fff2')
      //   this.comments = JSON.parse(dataComments);
      // }
      
      this.comments = dataManager.getEvaluation(this.name);


      this.average();

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
    }

    initialRender(){
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
    }

    starClick(e){
      this.stars = e.detail
      return
    }

    newRating(event){     
    }


    average(){
      let score = 0;
      for (let index = 0; index < this.comments.length; index++) {
        score += this.comments[index].stars;
      }
      this.avering = score / this.comments.length;
    }

    makeStars(qty){
      let stars = "";
      for (let i=0; i<qty; i++) stars +="*";
      return stars;
    }

    renderComment() {
      let content = "";
      if (this.viewDetails){
        content +=`
        <ul>${this.renderRatings()}</ul>
      `;
      }
      this.DOMcomments.innerHTML =  content;
    }

    addComment(){
      
      const stars = this.stars
      const comment = document.querySelector(`#${this.name}Comment`).value;
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
      // dataManager.addComment(this.name, this.comments);
      this.renderComment()
      document.querySelector(`#${this.name}Comment`).value = '';
      this.stars = '';
      return ;
    }

    renderAddComment(){
      return  `
          <div onclick="event.stopPropagation();">
          <input name="commentaires" class='form-control form-control-sm' id='${this.name}Comment' placeholder="ajouter un commentaire">
          </div>
          <button class='btn btn-sm btn-primary mt-1' onclick="event.stopPropagation();window.${this.name}.addComment() ">ajoute un commentaire</button>
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
